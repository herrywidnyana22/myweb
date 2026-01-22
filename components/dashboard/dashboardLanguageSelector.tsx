'use client';

import { LanguageSelector } from '@/components/form/LanguageSelector';
import { CollapsibleCard } from './collapsibleCard';
import { useLanguage } from '@/contexts/LanguageContext';

export const DashboardLanguageSelector = () => {
  const { selectedTranslationLanguages, toggleTranslationLanguage } =
    useLanguage();

  return (
    <CollapsibleCard title='Language Settings' className='mb-6'>
      <p className='mb-4 text-sm text-gray-300'>
        Select translation languages for all content. AI will automatically
        translate your input to selected languages.
      </p>
      <LanguageSelector
        selectedLanguages={selectedTranslationLanguages}
        onToggle={toggleTranslationLanguage}
      />
    </CollapsibleCard>
  );
};
