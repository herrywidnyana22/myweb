'use client';

import { loadUI } from "@/lib/translate/translateUIText";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext<AppContextProps | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // LANGUAGE
  const [language, setLanguage] = useState<string>("id");
  const [ui, setUI] = useState<Record<string, string>>({});

  // load language
  useEffect(() => {
    const saved = localStorage.getItem("app_language");
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("app_language", language);

    (async () => {
      const translated = await loadUI(language);
      setUI(translated);
    })();
  }, [language]);

  // CHAT MODE
  const [chatMode, setChatMode] = useState<ChatMode>("default");

  useEffect(() => {
    const saved = localStorage.getItem("app_chat_mode") as ChatMode;
    if (saved) setChatMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("app_chat_mode", chatMode);
  }, [chatMode]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        ui,
        setUI,

        chatMode,
        setChatMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};
