"use client";

import { createContext, useContext, useState } from "react";


const ChatContext = createContext<ChatProps | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatResponseProps[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        
        isMinimized,
        setIsMinimized,
        
        isInputFocused,
        setIsInputFocused,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside <ChatProvider>");
  return ctx;
}
