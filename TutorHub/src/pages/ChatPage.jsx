import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import {
  getChatRooms,
  getChatMessages,
  sendChatMessage,
  createChatRoom,
  updateChatMessage,
  deleteChatMessage,
  normalizeMessage,
} from '../services/chatService';
import { getChatHubConnection, subscribeChatHub } from '../services/chatHubClient';
import axiosInstance from '../services/axiosInstance';
import useAuthStore from '../store/authStore';

function ChatPage() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [hubReady, setHubReady] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [menuMessageId, setMenuMessageId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const userIdRef = useRef(userId);

  activeChatRef.current = activeChat;
  userIdRef.current = userId;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }, []);

  const fetchRooms = useCallback(async (selectRoomId = null) => {
    try {
      const data = await getChatRooms();
      setRooms(data);
      const target = selectRoomId || activeChatRef.current;
      if (target && data.some((r) => r.id === String(target))) {
        setActiveChat(String(target));
      } else if (data.length > 0 && !activeChatRef.current) {
        setActiveChat(data[0].id);
      }
      return data;
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message;
      toast.error(msg || 'Could not load conversations. Try signing out and back in.');
      return [];
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const fetchMessages = useCallback(async (roomId) => {
    if (!roomId) return;
    try {
      const raw = await getChatMessages(roomId);
      const normalized = raw.map((m) => normalizeMessage(m, userIdRef.current));
      setMessages(normalized);
      scrollToBottom();
      fetchRooms(roomId);
    } catch (err) {
      console.error(err);
      toast.error('Could not load messages');
    }
  }, [fetchRooms, scrollToBottom]);

  const appendMessage = useCallback((rawMsg) => {
    const msg = normalizeMessage(rawMsg, userIdRef.current);
    if (!msg?.id) return;

    const roomId = msg.chatRoomId || activeChatRef.current;
    if (String(roomId) !== String(activeChatRef.current)) return;

    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    scrollToBottom();
  }, [scrollToBottom]);

  const replaceMessage = useCallback((rawMsg) => {
    const msg = normalizeMessage(rawMsg, userIdRef.current);
    if (!msg?.id) return;
    if (String(msg.chatRoomId) !== String(activeChatRef.current)) return;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoadingRooms(true);
      const targetUserId = searchParams.get('userId');
      const roomIdParam = searchParams.get('roomId');
      let openRoomId = roomIdParam;

      if (targetUserId) {
        try {
          const room = await createChatRoom(targetUserId);
          if (room?.id) {
            openRoomId = room.id;
            setMobileView('chat');
          }
        } catch {
          toast.error('Could not start conversation');
        }
        searchParams.delete('userId');
        setSearchParams(searchParams, { replace: true });
      }

      await fetchRooms(openRoomId || undefined);
      if (openRoomId) {
        setActiveChat(String(openRoomId));
        setMobileView('chat');
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat);
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    let joinedRoom = null;
    let conn = null;

    const setup = async () => {
      try {
        conn = await getChatHubConnection();
        setHubReady(!!conn);
      } catch {
        setHubReady(false);
      }
    };
    setup();

    const unsubReceive = subscribeChatHub('ReceiveMessage', (raw) => {
      const roomId = String(raw.chatRoomId ?? raw.ChatRoomId ?? raw.roomId ?? '');
      if (roomId === String(activeChatRef.current)) {
        appendMessage(raw);
      }
      fetchRooms();
    });

    const unsubUpdated = subscribeChatHub('MessageUpdated', (raw) => {
      replaceMessage(raw);
      fetchRooms();
    });

    const unsubDeleted = subscribeChatHub('MessageDeleted', (raw) => {
      replaceMessage(raw);
      fetchRooms();
    });

    return () => {
      unsubReceive();
      unsubUpdated();
      unsubDeleted();
    };
  }, [appendMessage, replaceMessage, fetchRooms]);

  const joinedRoomRef = useRef(null);

  useEffect(() => {
    if (!hubReady || !activeChat) return undefined;

    let cancelled = false;
    const join = async () => {
      try {
        const conn = await getChatHubConnection();
        if (!conn || cancelled) return;
        await conn.invoke('JoinRoom', String(activeChat));
        joinedRoomRef.current = String(activeChat);
      } catch (err) {
        console.error('JoinRoom failed', err);
      }
    };
    join();

    return () => {
      cancelled = true;
      const room = joinedRoomRef.current;
      joinedRoomRef.current = null;
      if (room) {
        getChatHubConnection().then((c) =>
          c?.invoke('LeaveRoom', room).catch(() => {})
        );
      }
    };
  }, [hubReady, activeChat]);

  const handleChatSelect = (id) => {
    setActiveChat(String(id));
    setMobileView('chat');
    setMenuMessageId(null);
    setEditingId(null);
  };

  const handleStartEdit = (m) => {
    setEditingId(m.id);
    setEditText(m.text || '');
    setMenuMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (messageId) => {
    if (!activeChat || !editText.trim() || actionLoading) return;
    setActionLoading(true);
    try {
      const updated = await updateChatMessage(activeChat, messageId, editText.trim());
      replaceMessage(updated);
      setEditingId(null);
      setEditText('');
      await fetchRooms(activeChat);
      toast.success('Message updated');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Could not update message');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeChat || actionLoading) return;
    if (!window.confirm('Delete this message?')) return;
    setActionLoading(true);
    setMenuMessageId(null);
    try {
      const deleted = await deleteChatMessage(activeChat, messageId);
      replaceMessage(deleted);
      await fetchRooms(activeChat);
      toast.success('Message deleted');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Could not delete message');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeChat || sending) return;
    if (!messageText.trim() && !fileInputRef.current?.files?.[0]) return;

    let fileUrl = null;
    let fileType = null;

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadRes = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileUrl = uploadRes.data.url;
        fileType = file.type;
      } catch {
        toast.error('File upload failed');
        return;
      }
    }

    const text = messageText.trim();
    setSending(true);

    try {
      const conn = hubReady ? await getChatHubConnection() : null;
      if (conn?.state === 'Connected') {
        await conn.invoke('SendMessage', String(activeChat), {
          text,
          fileUrl,
          fileType,
        });
      } else {
        const saved = await sendChatMessage(activeChat, text, fileUrl, fileType);
        appendMessage(saved);
      }
      setMessageText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchRooms(activeChat);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const chat = rooms.find((c) => c.id === String(activeChat));
  const filteredRooms = rooms.filter((r) =>
    r.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardShell fullWidth className="!px-0 !pt-0 max-w-none w-full">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,280px)_1fr] h-[calc(100dvh-60px-5.5rem)] md:h-[calc(100dvh-60px-2rem)] overflow-hidden bg-slate-50 min-h-0 rounded-xl border border-slate-200 md:mx-0">
          {/* Conversation list */}
          <div
            className={`border-r border-slate-200 bg-white flex flex-col h-full min-h-0 ${
              mobileView === 'list' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <div className="p-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-800">Messages</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hubReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                  title={hubReady ? 'Live connection' : 'Using REST fallback'}
                >
                  {hubReady ? 'Live' : 'Offline'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
              {loadingRooms ? (
                <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
              ) : filteredRooms.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  No conversations yet. Message a tutor from their profile.
                </div>
              ) : (
                filteredRooms.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`w-full p-4 text-left transition-all flex gap-3 items-start hover:bg-slate-50 ${
                      String(activeChat) === c.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleChatSelect(c.id)}
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-primary">
                      {c.user.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1 gap-2">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{c.user.name}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{c.lastMessage?.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {c.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                    {(c.lastMessage?.unreadCount ?? 0) > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {c.lastMessage.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div
            className={`flex flex-col h-full min-h-0 bg-slate-50 ${
              mobileView === 'chat' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {chat ? (
              <>
                <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-slate-200 bg-white flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    aria-label="Back to conversations"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-primary shrink-0">
                    {chat.user.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{chat.user.name}</div>
                    <div className="text-xs text-slate-500">{chat.user.role}</div>
                  </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                      Say hello — your message will be delivered instantly.
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`group flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[78%] ${
                          m.own ? 'self-end flex-row-reverse' : 'self-start'
                        }`}
                      >
                        {!m.own && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 bg-primary">
                            {chat.user.initials}
                          </div>
                        )}
                        <div className="relative min-w-0 flex-1">
                          <div className={`flex items-start gap-1 ${m.own ? 'flex-row-reverse' : ''}`}>
                          {m.own && !m.isDeleted && editingId !== m.id && (
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setMenuMessageId(menuMessageId === m.id ? null : m.id)
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                                aria-label="Message options"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              {menuMessageId === m.id && (
                                <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white shadow-lg py-1 text-sm">
                                  <button
                                    type="button"
                                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 touch-manipulation"
                                    onClick={() => handleStartEdit(m)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 touch-manipulation"
                                    onClick={() => handleDeleteMessage(m.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                          {editingId === m.id ? (
                            <div className="rounded-2xl border border-primary/30 bg-white p-3 shadow-sm space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={2}
                                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoading || !editText.trim()}
                                  onClick={() => handleSaveEdit(m.id)}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg disabled:opacity-50"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`p-3.5 rounded-2xl text-sm leading-relaxed break-words ${
                                m.isDeleted
                                  ? 'bg-slate-100 text-slate-400 italic border border-slate-200'
                                  : m.own
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                              }`}
                            >
                              {m.isDeleted ? (
                                <span>This message was deleted</span>
                              ) : (
                                <>
                                  {m.fileUrl && (
                                    <div className="mb-2">
                                      {m.fileType?.startsWith('image/') ? (
                                        <img
                                          src={m.fileUrl}
                                          alt="attachment"
                                          className="max-w-full rounded-lg max-h-40 sm:max-h-48 object-cover"
                                        />
                                      ) : (
                                        <a
                                          href={m.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center gap-2 underline ${m.own ? 'text-white' : ''}`}
                                        >
                                          View attachment
                                        </a>
                                      )}
                                    </div>
                                  )}
                                  {m.text && <div>{m.text}</div>}
                                </>
                              )}
                            </div>
                          )}
                          </div>
                          </div>

                          <div
                            className={`text-[10px] text-slate-400 mt-1 flex items-center gap-1 ${
                              m.own ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span>{m.time}</span>
                            {m.isEdited && !m.isDeleted && (
                              <span className="italic">edited</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2 sm:gap-3 shrink-0"
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={() => {
                      if (fileInputRef.current?.files?.[0]) {
                        setMessageText((prev) => prev || fileInputRef.current.files[0].name);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                    aria-label="Attach file"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    className="flex-1 min-w-0 h-11 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-11 h-11 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl flex items-center justify-center shrink-0"
                    aria-label="Send"
                  >
                    <svg className="w-5 h-5 stroke-current" strokeWidth="2" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <p className="text-sm mb-2">Select a conversation to start chatting</p>
                <p className="text-xs text-slate-400 md:hidden">Or pick a contact from the list</p>
                <button
                  type="button"
                  className="md:hidden mt-4 text-primary font-semibold text-sm"
                  onClick={() => setMobileView('list')}
                >
                  View conversations
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  );
}

export default ChatPage;
