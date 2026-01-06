import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText, MultiLangText, multiLangUIText } from '@/lib/constants/languages';

/**
 * Hook to get localized text based on current language
 */
export function useLocalizedText() {
  const { currentLanguage } = useLanguage();

  const getText = (multiLangText: MultiLangText | string | undefined | null): string => {
    if (!multiLangText) return '';
    if (typeof multiLangText === 'string') return multiLangText;
    return getLocalizedText(multiLangText, currentLanguage);
  };

  // Get UI text by key
  const getUIText = (key: keyof typeof multiLangUIText): string => {
    const uiText = multiLangUIText[key];
    if (!uiText) return key;
    return getLocalizedText(uiText, currentLanguage);
  };

  return { getText, getUIText, currentLanguage };
}
