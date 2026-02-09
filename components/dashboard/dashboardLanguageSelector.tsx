'use client';

import { LanguageSelector } from '@/components/form/LanguageSelector';
import { CollapsibleCard } from './collapsibleCard';
import { useLanguageStore } from '@/store/language';

export const DashboardLanguageSelector = () => {
  const selectedTranslationLanguages = useLanguageStore(
    state => state.selectedTranslationLanguages
  );
  const toggleTranslationLanguage = useLanguageStore(
    state => state.toggleTranslationLanguage
  );

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
