"use client";

import { createContext, useContext, useState } from "react";

const ChatModeContext = createContext({
  mode: "default" as ChatMode,
  setMode: (m: ChatMode) => {}
});

export function ChatModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ChatMode>("default");
  return (
    <ChatModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = () => useContext(ChatModeContext);
