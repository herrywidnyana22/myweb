import { MultiLangText } from '@/lib/constants/languages';

async function translateField(
  text: string,
  targetLanguages: string[],
  sourceLanguage: string = 'id'
): Promise<MultiLangText> {
  try {
    const response = await fetch('/api/translate/field', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLanguages,
        sourceLanguage,
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

    return data.translations as MultiLangText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Batch translate multiple fields
 */
export async function translateFields(
  fields: Array<{ key: string; text: string }>,
  targetLanguages: string[],
  sourceLanguage: string = 'id'
): Promise<Record<string, MultiLangText>> {
  const results: Record<string, MultiLangText> = {};

  // Translate all fields in parallel
  await Promise.all(
    fields.map(async ({ key, text }) => {
      try {
        const translations = await translateField(
          text,
          targetLanguages,
          sourceLanguage
        );
        results[key] = translations;
      } catch (error) {
        console.error(`Failed to translate field "${key}":`, error);
        // Return source text only if translation fails
        results[key] = { source: text };
      }
    })
  );

  return results;
}

export function hasAllTranslations(
  multiLangText: MultiLangText | string,
  requiredLanguages: string[]
): boolean {
  if (typeof multiLangText === 'string') {
    return false;
  }

  if (!multiLangText.source) {
    return false;
  }

  return requiredLanguages.every(
    lang => multiLangText[lang] && multiLangText[lang].trim() !== ''
  );
}

export function getMissingTranslations(
  multiLangText: MultiLangText | string,
  requiredLanguages: string[]
): string[] {
  if (typeof multiLangText === 'string') {
    return requiredLanguages;
  }

  return requiredLanguages.filter(
    lang => !multiLangText[lang] || multiLangText[lang].trim() === ''
  );
}
