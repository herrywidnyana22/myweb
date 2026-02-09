import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create<ChatStoreProps>()(
  persist(
    set => ({
      chatMode: 'default',
      messages: [],
      isMinimized: false,
      isInputFocused: false,
      openedDockId: {},
      targetedDockId: {},

      setChatMode: v => set({ chatMode: v }),

      setMessages: v =>
        set(state => ({
          messages: typeof v === 'function' ? v(state.messages) : v,
        })),

      setIsMinimized: v =>
        set(state => ({
          isMinimized: typeof v === 'function' ? v(state.isMinimized) : v,
        })),

      setIsInputFocused: v => set({ isInputFocused: v }),

      setOpenedDockId: v =>
        set(state => ({
          openedDockId: typeof v === 'function' ? v(state.openedDockId) : v,
        })),

      setTargetedDockId: v =>
        set(state => ({
          targetedDockId: typeof v === 'function' ? v(state.targetedDockId) : v,
        })),
    }),

    {
      name: 'chat-store',

      partialize: state => ({
        chatMode: state.chatMode,
      }),
    }
  )
);
