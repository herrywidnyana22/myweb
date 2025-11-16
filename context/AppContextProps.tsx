'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { Lang, translations } from "@/lib/translate";

interface AppContextProps {
  // Language
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: typeof translations['id'];

  // Chat Mode
  chatMode: ChatMode;
  setChatMode: (m: ChatMode) => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ===== LANGUAGE STATE =====
  const [language, setLanguage] = useState<Lang>("id");

  useEffect(() => {
    const saved = localStorage.getItem("app_language") as Lang | null;
    if (saved === "id" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  // ===== CHAT MODE STATE =====
  const [chatMode, setChatMode] = useState<ChatMode>("default");

  useEffect(() => {
    const saved = localStorage.getItem("app_chat_mode") as ChatMode | null;
    if (saved === "default" || saved === "telegram") {
      setChatMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_chat_mode", chatMode);
  }, [chatMode]);

  // ===== VALUE =====
  const value: AppContextProps = {
    language,
    setLanguage,
    t: translations[language],

    chatMode,
    setChatMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};
