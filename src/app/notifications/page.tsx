'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  Trash2, 
  Trophy, 
  Users, 
  Swords,
  Info
} from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import type { WithId } from '@/firebase/use-collection';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import NotificationSettings from '@/components/NotificationSettings';

export default function NotificationsPage() {
  const { firestore, user } = useFirebase();
  const [notifications, setNotifications] = useState<WithId<FirestoreNotification>[]>([]);
  const [filter, setFilter] = useState('all');
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
    const notificationsCollection = collection(firestore, 'users', user.uid, 'notifications');
    // Order by createdAt descending so newest notifications appear first
    return query(notificationsCollection, orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data } = useCollection<FirestoreNotification>(notifQuery as any);

  if (data && data !== notifications) {
    setNotifications(data as WithId<FirestoreNotification>[]);
  }

  const handleMarkAsRead = (id: string) => {
    // Mark-as-read is not wired yet for Firestore; can be added via markUserNotificationAsRead
    void id;
  };

  const handleMarkAllRead = () => {
    // Bulk mark-all-read can be added later
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Delete can be wired via deleteUserNotification
    void id;
  };

  const handleNotificationClick = (notification: WithId<FirestoreNotification>) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'challenge_invite':
        return <Swords className="h-5 w-5 text-orange-500" />;
      case 'challenge_result':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'friend_request':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'achievement_unlock':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'system_message':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'challenges') return n.type.includes('challenge');
    if (filter === 'social') return n.type === 'friend_request';
    return true;
  });

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your learning journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <TabsList className="mb-4 bg-muted/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold">No notifications</h3>
                    <p>You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-4 ${
                          !notification.read ? 'bg-muted/20' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="mt-1 shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
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
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <Button variant="link" className="h-auto p-0 text-xs mt-2">
                              View details
                            </Button>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Tabs>
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
