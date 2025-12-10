'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loadUI } from "@/lib/translate/translateUIText";

export const useAppStore = create<AppStore>()(

  persist(
    (set) => ({
      language: "id",
      ui: {},
      chatMode: "default",
      messages: [],
      isMinimized: false,
      isInputFocused: false,
      openedDockId: {},
      targetedDockId: {},

      // STYLE MIRIP REACT useState
      setLanguage: async (v) => {
        set({ language: v });
        const translated = await loadUI(v);
        set({ ui: translated });
      },

      setUI: (v) => set({ ui: v }),

      setChatMode: (v) => set({ chatMode: v }),

      setMessages: (v) =>
        set((state) => ({
          messages: typeof v === "function" ? v(state.messages) : v
        })),

      setIsMinimized: (v) =>
        set((state) => ({
          isMinimized: typeof v === "function" ? v(state.isMinimized) : v
        })),

      setIsInputFocused: (v) => set({ isInputFocused: v }),

      setOpenedDockId: (v) =>
        set((state) => ({
          openedDockId:
            typeof v === "function" ? v(state.openedDockId) : v
        })),

      setTargetedDockId: (v) =>
        set((state) => ({
          targetedDockId:
            typeof v === "function" ? v(state.targetedDockId) : v
        })),
    }),

    {
      name: "app-store",

      partialize: (state) => ({
        language: state.language,
        chatMode: state.chatMode,
      }),
      
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        // saat zustand selesai load dari storage → load UI sesuai bahasa
        const translated = await loadUI(state.language);
        useAppStore.setState({ ui: translated });
      }
    }
  )
);
