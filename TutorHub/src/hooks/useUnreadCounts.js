import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import { getChatUnreadCount } from '../services/chatService';
import { getNotifications } from '../services/notificationService';
import { subscribeChatHub, getChatHubConnection } from '../services/chatHubClient';

export default function useUnreadCounts() {
  const { isAuthenticated } = useAuthStore();
  const [chatUnread, setChatUnread] = useState(0);
  const [notifUnread, setNotifUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setChatUnread(0);
      setNotifUnread(0);
      return;
    }
    try {
      const [chatCount, notifRes] = await Promise.all([
        getChatUnreadCount(),
        getNotifications(),
      ]);
      setChatUnread(chatCount);
      const list = notifRes?.data ?? [];
      setNotifUnread(list.filter((n) => !n.isRead).length);
    } catch {
      /* keep previous counts */
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
    if (!isAuthenticated) return undefined;

    getChatHubConnection().catch(() => {});

    const unsubMsg = subscribeChatHub('ReceiveMessage', () => refresh());
    const unsubNotif = subscribeChatHub('ReceiveNotification', () => refresh());

    const interval = setInterval(refresh, 60000);
    return () => {
      unsubMsg();
      unsubNotif();
      clearInterval(interval);
    };
  }, [isAuthenticated, refresh]);

  return { chatUnread, notifUnread, refresh };
}
