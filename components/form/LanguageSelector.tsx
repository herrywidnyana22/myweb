'use client';

import {
  AVAILABLE_LANGUAGES,
  MAX_TRANSLATION_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '@/lib/constants/languages';
import { Check } from 'lucide-react';
import { FlagIcon } from '../flagIcon';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onToggle: (langCode: string) => void;
  disabled?: boolean;
}

export const LanguageSelector = ({
  selectedLanguages,
  onToggle,
  disabled = false,
}: LanguageSelectorProps) => {
  const availableForSelection = AVAILABLE_LANGUAGES.filter(
    lang => lang.code !== DEFAULT_LANGUAGE
  );

  const canSelectMore = selectedLanguages.length < MAX_TRANSLATION_LANGUAGES;

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-white'>
        Translation Languages
        <span className='ml-2 text-xs text-gray-400'>
          (Select up to {MAX_TRANSLATION_LANGUAGES})
        </span>
      </label>

      <div className='grid grid-cols-2 gap-2'>
        {availableForSelection.map(lang => {
          const isSelected = selectedLanguages.includes(lang.code);
          const canToggle = isSelected || canSelectMore;

          return (
            <button
              key={lang.code}
              type='button'
              onClick={() => canToggle && onToggle(lang.code)}
              disabled={disabled || !canToggle}
              className={`relative flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                isSelected
                  ? 'border-primary text-primary-dark bg-orange-50'
                  : canToggle
                    ? 'border-gray-200 bg-white hover:border-gray-300'
                    : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
            >
              <FlagIcon code={lang.countryCode} flagCode={lang.flag} />
              <div className='flex-1 text-left'>
                <div className='text-sm font-medium text-gray-600'>
                  {lang.name}
                </div>
                <div className='text-xs text-gray-500'>{lang.nativeName}</div>
              </div>
              {isSelected && <Check className='text-primary-hover size-5' />}
            </button>
          );
        })}
      </div>

      {selectedLanguages.length > 0 && (
        <div className='text-primary-hover mt-4 flex items-center rounded-lg border border-gray-300 p-2 text-sm'>
          <strong>Selected: </strong>
          <span className='inline-flex flex-wrap items-center gap-2'>
            {selectedLanguages
              .map(code => {
                const lang = AVAILABLE_LANGUAGES.find(l => l.code === code);
                return lang ? (
                  <span key={code} className='inline-flex items-center'>
                    <FlagIcon code={lang.countryCode} flagCode={lang.flag} />
                    {lang.name}
                  </span>
                ) : (
                  code
                );
              })
              .reduce((prev, curr) => [prev, ', ', curr] as any)}
          </span>
        </div>
      )}
    </div>
  );
};
