import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  isLoading: false,
  error: null,

  setChats: (chats) => set({ chats }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    chats: state.chats.map((c) => 
      c.id === message.chatId ? { ...c, preview: message.text, time: 'Just now' } : c
    )
  })),

  markAsRead: (chatId) => set((state) => ({
    chats: state.chats.map((c) => 
      c.id === chatId ? { ...c, unread: 0 } : c
    )
  })),
}));

export default useChatStore;
