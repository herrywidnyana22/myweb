'use client';

import { LanguageSelector } from '@/components/form/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const DashboardLanguageSelector = () => {
  const { selectedTranslationLanguages, toggleTranslationLanguage } = useLanguage();

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="size-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Language Settings</h2>
      </div>
      <p className="text-gray-300 text-sm mb-4">
        Select translation languages for all content. AI will automatically translate your input to selected languages.
      </p>
      <LanguageSelector
        selectedLanguages={selectedTranslationLanguages}
        onToggle={toggleTranslationLanguage}
      />
    </div>
  );
};
