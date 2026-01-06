'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES, Language } from '@/lib/constants/languages';
import { detectLanguagesFromData, isDataEmpty } from '@/lib/utils/languageDetection';

interface LanguageContextType {
  // Current display language
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  
  // Selected translation languages for forms
  selectedTranslationLanguages: string[];
  setSelectedTranslationLanguages: (langs: string[]) => void;
  
  // Helper to toggle language selection
  toggleTranslationLanguage: (langCode: string) => void;
  
  // Get language info
  getLanguageInfo: (code: string) => Language | undefined;
  
  // Auto-detect languages from data
  detectAndSetLanguages: (data: {
    profiles?: Profile[];
    categories?: Category[];
    contacts?: Contact[];
    educations?: Education[];
    experiences?: Experience[];
    projects?: Project[];
  }) => void;
  
  // Save to database (optional)
  saveLanguagePreference: (profileId: string, languages: string[]) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_selected_languages';
const CURRENT_LANG_KEY = 'portfolio_current_language';
const LANGUAGES_DETECTED_KEY = 'portfolio_languages_detected';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [languagesDetected, setLanguagesDetected] = useState(false);
  
  const [currentLanguage, setCurrentLanguageState] = useState(() => {
    // Load current language from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CURRENT_LANG_KEY);
      if (saved) {
        return saved;
      }
    }
    return DEFAULT_LANGUAGE;
  });
  
  const [selectedTranslationLanguages, setSelectedTranslationLanguages] = useState<string[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      const detected = localStorage.getItem(LANGUAGES_DETECTED_KEY);
      
      if (saved && detected === 'true') {
        // Already detected and saved, use saved value
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    // Return empty array, will be populated by detectAndSetLanguages
    return [];
  });

  // Save to localStorage whenever languages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTranslationLanguages));
    }
  }, [selectedTranslationLanguages]);

  // Save currentLanguage to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_LANG_KEY, currentLanguage);
    }
  }, [currentLanguage]);

  // Wrapper to update currentLanguage
  const setCurrentLanguage = useCallback((lang: string) => {
    setCurrentLanguageState(lang);
  }, []);

  const toggleTranslationLanguage = useCallback((langCode: string) => {
    setSelectedTranslationLanguages((prev) => {
      if (prev.includes(langCode)) {
        return prev.filter((code) => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  }, []);

  const getLanguageInfo = useCallback((code: string) => {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
  }, []);

  const detectAndSetLanguages = useCallback((data: {
    profiles?: Profile[];
    categories?: Category[];
    contacts?: Contact[];
    educations?: Education[];
    experiences?: Experience[];
    projects?: Project[];
  }) => {
    // Check if already detected
    if (languagesDetected) {
      return;
    }

    // Check if data is empty
    if (isDataEmpty(data)) {
      // Data is empty, set to empty array
      setSelectedTranslationLanguages([]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(LANGUAGES_DETECTED_KEY, 'true');
      setLanguagesDetected(true);
      return;
    }

    // Detect languages from data
    const detectedLanguages = detectLanguagesFromData(data);
    
    if (detectedLanguages.length > 0) {
      setSelectedTranslationLanguages(detectedLanguages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(detectedLanguages));
      localStorage.setItem(LANGUAGES_DETECTED_KEY, 'true');
      setLanguagesDetected(true);
      
      console.log('Auto-detected languages from data:', detectedLanguages);
    }
  }, [languagesDetected]);

  const saveLanguagePreference = useCallback(async (profileId: string, languages: string[]) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredLanguages: languages }),
      });
      
      if (!response.ok) {
        console.error('Failed to save language preference to database');
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        selectedTranslationLanguages,
        setSelectedTranslationLanguages,
        toggleTranslationLanguage,
        getLanguageInfo,
        detectAndSetLanguages,
        saveLanguagePreference,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
