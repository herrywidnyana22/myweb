import { MultiLangText, DEFAULT_LANGUAGE } from '@/lib/constants/languages';

/**
 * Extract all language codes used in MultiLangText objects
 */
export function extractLanguagesFromMultiLangText(data: MultiLangText | string | null | undefined): string[] {
  if (!data || typeof data === 'string') {
    return [];
  }

  const languages = new Set<string>();
  
  // Check all keys except 'source'
  Object.keys(data).forEach((key) => {
    if (key !== 'source' && data[key]) {
      languages.add(key);
    }
  });

  return Array.from(languages);
}

/**
 * Detect all languages used across all data entities
 */
export function detectLanguagesFromData(data: {
  profiles?: Profile[];
  categories?: Category[];
  contacts?: Contact[];
  educations?: Education[];
  experiences?: Experience[];
  projects?: Project[];
}): string[] {
  const allLanguages = new Set<string>();

  // Helper to process a field
  const processField = (field: any) => {
    const langs = extractLanguagesFromMultiLangText(field);
    langs.forEach((lang) => allLanguages.add(lang));
  };

  // Process profiles
  if (data.profiles) {
    data.profiles.forEach((profile) => {
      profile.items?.forEach((item) => {
        processField(item.name);
        processField(item.subtitle);
        processField(item.description);
        processField(item.tooltipText);
      });
    });
  }

  // Process categories
  if (data.categories) {
    data.categories.forEach((category) => {
      processField(category.name);
    });
  }

  // Process contacts
  if (data.contacts) {
    data.contacts.forEach((contact) => {
        processField(contact.description);
        processField(contact.tooltipText);
    });
  }

  // Process educations
  if (data.educations) {
    data.educations.forEach((education) => {
      processField(education.major);
    });
  }

  // Process experiences
  if (data.experiences) {
    data.experiences.forEach((experience) => {
      processField(experience.role);
      processField(experience.jobdesk);
      processField(experience.description);
    });
  }

  // Process projects
  if (data.projects) {
    data.projects.forEach((project) => {
      processField(project.name);
      processField(project.description);
      
      project.entries?.forEach((item) => {
        processField(item.name);
        processField(item.tooltipText);
        processField(item.subtitle);
        processField(item.description);
        processField(item.techStack);
      });
    });
  }

  // Remove default language if it's the only one (it's always included)
  const languages = Array.from(allLanguages).filter((lang) => lang !== DEFAULT_LANGUAGE);
  
  return languages;
}

/**
 * Check if data is empty (no entities with data)
 */
export function isDataEmpty(data: {
  profiles?: Profile[];
  categories?: Category[];
  contacts?: Contact[];
  educations?: Education[];
  experiences?: Experience[];
  projects?: Project[];
}): boolean {
  const hasData = 
    (data.profiles && data.profiles.length > 0) ||
    (data.categories && data.categories.length > 0) ||
    (data.contacts && data.contacts.length > 0) ||
    (data.educations && data.educations.length > 0) ||
    (data.experiences && data.experiences.length > 0) ||
    (data.projects && data.projects.length > 0);

  return !hasData;
}
