'use client';

import { useState, useEffect } from 'react';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { MultiLangText } from '@/lib/constants/languages';
import { Loader2, Sparkles, Languages } from 'lucide-react';

interface MultiLangInputProps {
  label: string;
  value: string | MultiLangText;
  onChange: (value: MultiLangText) => void;
  selectedLanguages: string[]; // e.g., ['en', 'ja', 'zh']
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  getLanguageInfo: (code: string) => { name: string; flag: string } | undefined;
}

export const MultiLangInput = ({
  label,
  value,
  onChange,
  selectedLanguages,
  placeholder = '',
  disabled = false,
  error,
  type = 'input',
  rows = 4,
  getLanguageInfo,
}: MultiLangInputProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<MultiLangText>(() => {
    if (typeof value === 'string') {
      return { source: value };
    }
    return value || { source: '' };
  });

  // Update translations when value changes externally
  useEffect(() => {
    if (typeof value === 'string') {
      setTranslations({ source: value });
    } else if (value) {
      setTranslations(value);
    }
  }, [value]);

  const handleSourceChange = (newValue: string) => {
    const updated = { ...translations, source: newValue };
    setTranslations(updated);
    onChange(updated);
  };

  const handleTranslate = async () => {
    const sourceText = translations.source;
    if (!sourceText.trim() || selectedLanguages.length === 0) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate/field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          targetLanguages: selectedLanguages,
          sourceLanguage: 'id',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      
      if (!data.success || !data.translations) {
        throw new Error('Invalid translation response');
      }

      const updated = { ...translations, ...data.translations };
      setTranslations(updated);
      onChange(updated);
    } catch (error) {
      console.error('Translation error:', error);
      alert(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslationEdit = (langCode: string, newValue: string) => {
    const updated = { ...translations, [langCode]: newValue };
    setTranslations(updated);
    onChange(updated);
  };

  const InputComponent = type === 'textarea' ? FormTextarea : FormInput;

  return (
    <div className="space-y-3">
      {/* Source Input with Translate Button */}
      <div className="relative">
        <InputComponent
          label={`${label} (Source)`}
          value={translations.source || ''}
          onChange={(e) => handleSourceChange(typeof e === 'string' ? e : e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isTranslating}
          error={error}
          {...(type === 'textarea' ? { rows } : {})}
        />
        
        {/* Translate Button */}
        {selectedLanguages.length > 0 && translations.source.trim() && (
          <button
            type="button"
            onClick={handleTranslate}
            disabled={disabled || isTranslating}
            className="absolute right-3 top-9 flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-xs font-medium rounded transition-colors shadow-sm"
          >
            {isTranslating ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages className="size-3" />
                <span>Translate</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Translation Fields */}
      {selectedLanguages.length > 0 && (
        <div className="pl-4 border-l-2 border-blue-200 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="size-4 text-blue-500" />
            <span className="font-medium">AI Translations (editable)</span>
          </div>
          
          {selectedLanguages.map((langCode) => {
            const langInfo = getLanguageInfo(langCode);
            if (!langInfo) return null;

            return (
              <InputComponent
                key={langCode}
                label={`${langInfo.flag} ${langInfo.name}`}
                value={translations[langCode] || ''}
                onChange={(val) => handleTranslationEdit(langCode, typeof val === 'string' ? val : val.target.value)}
                placeholder={`${label} in ${langInfo.name}`}
                disabled={disabled}
                {...(type === 'textarea' ? { rows } : {})}
              />
            );
          })}
        </div>
      )}

      {selectedLanguages.length === 0 && translations.source && (
        <p className="text-xs text-gray-500 italic">
          Select languages above to enable translation
        </p>
      )}
    </div>
  );
};
