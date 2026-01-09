'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import type { WithId } from '@/firebase/use-collection';
import { showNotification } from '@/lib/notifications';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { markUserNotificationAsRead, markAllUserNotificationsAsRead, deleteUserNotification } from '@/lib/realtime-notifications';
import { playNotificationSound } from '@/lib/notification-sound';

export default function NotificationBell() {
  const { firestore, user } = useFirebase();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  type FirestoreNotification = {
    type: string;
    title: string;
    message: string;
    data?: any;
    actionUrl?: string;
    read: boolean;
    createdAt?: any;
  };

  const notifQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'notifications');
  }, [firestore, user]);

  const { data: notificationsRaw } = useCollection<FirestoreNotification>(notifQuery as any);

  // Sort notifications client-side by createdAt descending (newest first)
  const notifications = useMemo(() => {
    if (!notificationsRaw) return null;
    return [...notificationsRaw].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 
                    (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 
                    (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0));
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 
                    (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 
                    (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0));
      return bTime - aTime; // Descending (newest first)
    });
  }, [notificationsRaw]);

  const prevIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!notifications) {
      setUnreadCount(0);
      return;
    }

    const unread = notifications.filter(n => !n.read);
    setUnreadCount(unread.length);

    // Detect new notifications (by id) since last render
    const currentIds = notifications.map(n => (n as WithId<FirestoreNotification>).id);
    const prevIds = prevIdsRef.current;

    const newIds = currentIds.filter(id => !prevIds.includes(id));
    if (newIds.length > 0) {
      let shouldPlaySound = false;
      // For each new unread challenge_invite, fire a browser notification
      notifications.forEach(n => {
        const notif = n as WithId<FirestoreNotification>;
        if (
          newIds.includes(notif.id) &&
          !notif.read &&
          notif.type === 'challenge_invite'
        ) {
          shouldPlaySound = true;
          // This will only show if user has granted permission & enabled notifications
          showNotification(notif.title, notif.message, 'quiz', {
            actionUrl: notif.actionUrl,
            challengeId: notif.data?.challengeId,
          }).catch(() => {
            // Best-effort only; ignore errors
          });
        }
      });
      
      // Play notification sound for new challenge invitations
      if (shouldPlaySound) {
        playNotificationSound();
      }
    }

    prevIdsRef.current = currentIds;
  }, [notifications]);

  const handleNotificationClick = (notification: WithId<FirestoreNotification>) => {
    setIsOpen(false);
    
    // Mark as read when clicked
    if (!notification.read && user) {
      markUserNotificationAsRead(user.uid, notification.id).catch(err => {
        console.error('Failed to mark notification as read:', err);
      });
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await markUserNotificationAsRead(user.uid, notificationId);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      // Mark all unread notifications as read
      if (notifications) {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(
          unread.map(n => markUserNotificationAsRead(user.uid, (n as WithId<FirestoreNotification>).id))
        );
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteUserNotification(user.uid, notificationId);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto p-1"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {!notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group ${
                    !notification.read ? 'bg-muted/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      !notification.read ? 'bg-blue-600' : 'bg-transparent'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-none ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(() => {
                          try {
                            if (!notification.createdAt) return 'Just now';
                            // Handle Firestore Timestamp
                            let date: Date;
                            if (notification.createdAt?.toDate) {
                              // Firestore Timestamp object
                              date = notification.createdAt.toDate();
                            } else if (notification.createdAt?.seconds) {
                              // Firestore Timestamp with seconds property
                              date = new Date(notification.createdAt.seconds * 1000);
                            } else if (typeof notification.createdAt === 'string') {
                              // ISO string
                              date = new Date(notification.createdAt);
                            } else if (typeof notification.createdAt === 'number') {
                              // Unix timestamp
                              date = new Date(notification.createdAt);
                            } else {
                              // Fallback
                              date = new Date(notification.createdAt);
                            }
                            // Validate date
                            if (isNaN(date.getTime())) {
                              return 'Just now';
                            }
                            return formatDistanceToNow(date, { addSuffix: true });
                          } catch (error) {
                            return 'Just now';
                          }
                        })()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-60 hover:opacity-100 active:opacity-100 transition-opacity -mr-2 -mt-2 touch-manipulation"
                      onClick={(e) => handleDelete(notification.id, e)}
                      aria-label="Delete notification"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Link 
            href="/notifications" 
            className="text-xs text-primary hover:underline"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
