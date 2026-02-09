import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_LANGUAGE,
  AVAILABLE_LANGUAGES,
  Language,
} from '@/lib/constants/languages';
import {
  detectLanguagesFromData,
  isDataEmpty,
} from '@/lib/utils/languageDetection';

interface LanguageStore {
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

  // Save to database
  saveLanguagePreference: (
    profileId: string,
    languages: string[]
  ) => Promise<void>;

  // Internal state
  languagesDetected: boolean;
  setLanguagesDetected: (detected: boolean) => void;

  // Initialize from database
  initializeFromDatabase: () => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: DEFAULT_LANGUAGE,
      selectedTranslationLanguages: [],
      languagesDetected: false,

      setCurrentLanguage: lang => set({ currentLanguage: lang }),

      setSelectedTranslationLanguages: langs =>
        set({ selectedTranslationLanguages: langs }),

      toggleTranslationLanguage: langCode =>
        set(state => ({
          selectedTranslationLanguages:
            state.selectedTranslationLanguages.includes(langCode)
              ? state.selectedTranslationLanguages.filter(
                  code => code !== langCode
                )
              : [...state.selectedTranslationLanguages, langCode],
        })),

      getLanguageInfo: code =>
        AVAILABLE_LANGUAGES.find(lang => lang.code === code),

      detectAndSetLanguages: data => {
        const { languagesDetected } = get();

        // Check if already detected
        if (languagesDetected) {
          return;
        }

        // Check if data is empty
        if (isDataEmpty(data)) {
          set({
            selectedTranslationLanguages: [],
            languagesDetected: true,
          });
          return;
        }

        // First, try to get preferredLanguages from profile
        if (data.profiles && data.profiles.length > 0) {
          const profile = data.profiles[0];
          if (
            profile.preferredLanguages &&
            Array.isArray(profile.preferredLanguages)
          ) {
            const langs = profile.preferredLanguages as string[];
            if (langs.length > 0) {
              set({
                selectedTranslationLanguages: langs,
                languagesDetected: true,
              });

              return;
            }
          }
        }

        // Fallback: Detect languages from data
        const detectedLanguages = detectLanguagesFromData(data);

        if (detectedLanguages.length > 0) {
          set({
            selectedTranslationLanguages: detectedLanguages,
            languagesDetected: true,
          });
          console.log('Auto-detected languages from data:', detectedLanguages);
        }
      },

      saveLanguagePreference: async (profileId, languages) => {
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
      },

      setLanguagesDetected: detected => set({ languagesDetected: detected }),

      initializeFromDatabase: async () => {
        try {
          const response = await fetch('/api/profiles');
          if (response.ok) {
            const result = await response.json();
            const profiles: Profile[] = result.data || result;

            if (profiles.length > 0) {
              const profile = profiles[0];

              // Check if preferredLanguages exists and is not null
              if (
                profile.preferredLanguages &&
                Array.isArray(profile.preferredLanguages)
              ) {
                const langs = profile.preferredLanguages as string[];
                if (langs.length > 0) {
                  set({
                    selectedTranslationLanguages: langs,
                    languagesDetected: true,
                  });
                  console.log('Loaded languages from database:', langs);
                  return;
                }
              }

              // If preferredLanguages is null/empty, detect from multilingual fields
              const detectedLangs: string[] = [];

              // Check role field
              if (profile.role && typeof profile.role === 'object') {
                const roleKeys = Object.keys(profile.role).filter(
                  k => k !== 'source'
                );
                detectedLangs.push(...roleKeys);
              }

              // Check quote field
              if (profile.quote && typeof profile.quote === 'object') {
                const quoteKeys = Object.keys(profile.quote).filter(
                  k => k !== 'source'
                );
                detectedLangs.push(...quoteKeys);
              }

              // Check description field
              if (
                profile.description &&
                typeof profile.description === 'object'
              ) {
                const descKeys = Object.keys(profile.description).filter(
                  k => k !== 'source'
                );
                detectedLangs.push(...descKeys);
              }

              // Remove duplicates and 'id' (default language)
              const uniqueLangs = [...new Set(detectedLangs)].filter(
                lang => lang !== 'id'
              );

              if (uniqueLangs.length > 0) {
                set({
                  selectedTranslationLanguages: uniqueLangs,
                  languagesDetected: true,
                });
                console.log(
                  'Auto-detected languages from profile fields:',
                  uniqueLangs
                );

                // Save to database
                try {
                  await fetch(`/api/profiles/${profile.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferredLanguages: uniqueLangs }),
                  });
                  console.log('Saved detected languages to database');
                } catch (err) {
                  console.error('Failed to save languages to database:', err);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching languages from database:', error);
        }
      },
    }),
    {
      name: 'language-store',
      partialize: state => ({
        currentLanguage: state.currentLanguage,
        selectedTranslationLanguages: state.selectedTranslationLanguages,
        languagesDetected: state.languagesDetected,
      }),
    }
  )
);
