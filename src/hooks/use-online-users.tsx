/**
 * Hook to fetch and listen to online users
 */

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/provider';
import { collection, query, getDocs, onSnapshot, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { isUserOnline } from '@/lib/user-presence';

export interface OnlineUser {
  userId: string;
  userName: string;
  school: string;
  lastSeen: Date | null;
  isOnline: boolean;
}

export function useOnlineUsers(maxUsers: number = 50): OnlineUser[] {
  const { firestore, user } = useFirebase();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!firestore || !user || user.isAnonymous) {
      setOnlineUsers([]);
      return;
    }

    // For now, we'll use a simpler approach:
    // Listen to users/{userId}/presence/status documents
    // Since we can't easily query across all user subcollections,
    // we'll fetch users from the students collection and check their presence individually
    
    // Alternative: Store lastSeen directly in students document (simpler but less real-time)
    // For now, let's use students collection with lastSeen field
    
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'students'),
        orderBy('lastSeen', 'desc'),
        limit(maxUsers)
      ),
      async (snapshot) => {
        const users: OnlineUser[] = [];
        
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const userId = docSnapshot.id;
          
          // Skip current user
          if (userId === user.uid) return;
          
          if (data.studentName) {
            const lastSeen = data.lastSeen?.toDate?.() || null;
            const online = isUserOnline(lastSeen);
            
            users.push({
              userId,
              userName: data.studentName || 'Student',
              school: data.schoolName || 'Unknown School',
              lastSeen,
              isOnline: online,
            });
          }
        });
        
        // Sort by online status first, then by lastSeen
        users.sort((a, b) => {
          if (a.isOnline !== b.isOnline) {
            return a.isOnline ? -1 : 1;
          }
          if (a.lastSeen && b.lastSeen) {
            return b.lastSeen.getTime() - a.lastSeen.getTime();
          }
          return 0;
        });
        
        setOnlineUsers(users);
      },
      (error: any) => {
        if (error?.code === 'permission-denied') {
          console.warn('[Online Users] Permission denied - cannot access students collection');
          setOnlineUsers([]);
        } else {
          console.error('Error listening to online users:', error);
          setOnlineUsers([]);
        }
      }
    );

    return () => unsubscribe();
  }, [firestore, user, maxUsers]);

  return onlineUsers;
}

