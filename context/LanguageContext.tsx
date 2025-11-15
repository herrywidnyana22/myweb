'use client';


import { Lang, translations } from '@/lib/translate';
import { createContext, useContext, useEffect, useState } from 'react';

interface LangContextProps {
  language: Lang;
  setLanguage: (l: Lang) => void;

  // translator
  t: typeof translations['id'];
}

const LanguageContext = createContext<LangContextProps | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Lang>('id');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('app_language') as Lang | null;
    if (saved === 'id' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const value: LangContextProps = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
};