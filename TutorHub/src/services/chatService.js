import axiosInstance from './axiosInstance';

const apiBase = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const resolveFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = apiBase();
  return base ? `${base}${url.startsWith('/') ? url : `/${url}`}` : url;
};

const pick = (obj, camel, pascal) => obj?.[camel] ?? obj?.[pascal];

export const normalizeRoom = (r) => {
  if (!r) return null;
  const user = r.user ?? r.User ?? {};
  const last = r.lastMessage ?? r.LastMessage;
  return {
    id: String(pick(r, 'id', 'Id') ?? ''),
    user: {
      id: pick(user, 'id', 'Id') ?? '',
      name: pick(user, 'name', 'Name') ?? 'Unknown',
      role: pick(user, 'role', 'Role') ?? '',
      initials: pick(user, 'initials', 'Initials') ?? '?',
      isOnline: pick(user, 'isOnline', 'IsOnline') ?? false,
    },
    lastMessage: last
      ? {
          text: pick(last, 'text', 'Text') ?? '',
          time: pick(last, 'time', 'Time') ?? '',
          unreadCount: pick(last, 'unreadCount', 'UnreadCount') ?? 0,
        }
      : null,
  };
};

export const normalizeMessage = (m, currentUserId) => {
  if (!m) return null;
  const senderId = pick(m, 'senderId', 'SenderId') ?? '';
  return {
    id: String(pick(m, 'id', 'Id') ?? `tmp-${Date.now()}`),
    chatRoomId: String(pick(m, 'chatRoomId', 'ChatRoomId') ?? pick(m, 'roomId', 'RoomId') ?? ''),
    text: pick(m, 'text', 'Text') ?? '',
    fileUrl: resolveFileUrl(pick(m, 'fileUrl', 'FileUrl')),
    fileType: pick(m, 'fileType', 'FileType'),
    time: pick(m, 'time', 'Time') ?? 'Just now',
    senderId,
    own: currentUserId ? senderId === currentUserId : (pick(m, 'own', 'Own') ?? false),
  };
};

export const getChatRooms = async () => {
  const res = await axiosInstance.get('/api/chat/rooms');
  const list = res.data?.data ?? res.data ?? [];
  return Array.isArray(list) ? list.map(normalizeRoom) : [];
};

export const getChatMessages = async (roomId) => {
  const res = await axiosInstance.get(`/api/chat/rooms/${roomId}/messages`);
  const list = res.data?.data ?? res.data ?? [];
  return Array.isArray(list) ? list : [];
};

export const sendChatMessage = async (roomId, text, fileUrl = null, fileType = null) => {
  const payload = { text: text || '' };
  if (fileUrl) payload.fileUrl = fileUrl;
  if (fileType) payload.fileType = fileType;
  const res = await axiosInstance.post(`/api/chat/rooms/${roomId}/messages`, payload);
  return res.data?.data ?? res.data;
};

export const createChatRoom = async (targetUserId) => {
  const res = await axiosInstance.post('/api/chat/rooms', { userId: targetUserId });
  const room = res.data?.data ?? res.data;
  return normalizeRoom(room);
};

export const getChatUnreadCount = async () => {
  try {
    const res = await axiosInstance.get('/api/chat/unread-count');
    return res.data?.data ?? 0;
  } catch {
    const rooms = await getChatRooms();
    return rooms.reduce((sum, r) => sum + (r.lastMessage?.unreadCount || 0), 0);
  }
};
