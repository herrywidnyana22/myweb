import {
  languageRule,
  contextRules,
  behaviorRule,
  memoryRule,
  jsonFormatRule,
  translationUIRules,
  translationDataRules,
  translationChatRules,
} from './promptRule';

const today = new Date();
const todayStr = today.toDateString();

/**
 * Build dynamic context based on available data
 */
function buildDataContext({
  profile,
  address,
  projects,
  contacts,
  educations,
  experiences,
}: Pick<
  BuildPromptProps,
  'profile' | 'address' | 'projects' | 'contacts' | 'educations' | 'experiences'
>) {
  const sections: string[] = [];

  // Profile Data
  if (profile) {
    sections.push(`Profile Data:
${JSON.stringify(profile, null, 2)}`);
  }

  // Address Data
  if (address && (address.address || address.lat || address.lng)) {
    sections.push(`Location/Address Data:
${JSON.stringify(address, null, 2)}`);
  }

  // Projects Data
  if (projects && projects.length > 0) {
    sections.push(`Projects (${projects.length} total):
${JSON.stringify(projects, null, 2)}`);
  }

  // Contacts Data
  if (contacts && contacts.length > 0) {
    sections.push(`Contact Information (${contacts.length} contacts):
${JSON.stringify(contacts, null, 2)}`);
  }

  // Education Data
  if (educations && educations.length > 0) {
    sections.push(`Education History (${educations.length} entries):
${JSON.stringify(educations, null, 2)}`);
  }

  // Experience Data
  if (experiences && experiences.length > 0) {
    sections.push(`Work Experience (${experiences.length} positions):
${JSON.stringify(experiences, null, 2)}`);
  }

  return sections.length > 0
    ? sections.join('\n\n')
    : '⚠ No portfolio data available yet';
}

/**
 * Generate dynamic context rules based on available data
 */
function buildDynamicContextRules({
  profile,
  address,
  projects,
  contacts,
  educations,
  experiences,
}: Pick<
  BuildPromptProps,
  'profile' | 'address' | 'projects' | 'contacts' | 'educations' | 'experiences'
>) {
  const availableData: string[] = [];
  const rules: string[] = [];

  if (profile) {
    availableData.push('profile');
    rules.push(`
- For questions about identity, bio, role, birth date, experience years, or personal info:
  → Answer using Profile data and include relevant fields in "text"`);
  }

  if (address && (address.address || address.lat || address.lng)) {
    availableData.push('address');
    rules.push(`
- For questions about location, address, or "where do you live":
  → Use Address data and optionally add address card with mapUrl if available`);
  }

  if (projects && projects.length > 0) {
    availableData.push('projects');
    rules.push(`
- For questions about projects, portfolio, apps, or work samples:
  → Include relevant project cards from Projects data (${projects.length} available)`);
  }

  if (contacts && contacts.length > 0) {
    availableData.push('contacts');
    rules.push(`
- For questions about contact info, social media, email, or "how to reach":
  → Include contact cards from Contacts data (${contacts.length} available)`);
  }

  if (educations && educations.length > 0) {
    availableData.push('educations');
    rules.push(`
- For questions about education, university, degree, or academic background:
  → Include education cards from Education data (${educations.length} available)`);
  }

  if (experiences && experiences.length > 0) {
    availableData.push('experiences');
    rules.push(`
- For questions about work experience, job history, or previous positions:
  → Include experience cards from Experience data (${experiences.length} available)`);
  }

  const summary = `
AVAILABLE DATA IN DATABASE:
${availableData.length > 0 ? availableData.map(d => `✓ ${d}`).join('\n') : '⚠ No data available'}

CONTEXT-BASED RESPONSE RULES:
${rules.length > 0 ? rules.join('\n') : '⚠ No specific data available - provide general responses only'}

IMPORTANT:
- ONLY use cards for data types that are available above
- If user asks about data that's NOT available (not listed above), respond in "text" that the information is not available yet
- Do NOT create fake/placeholder cards
- If NO data is available at all, explain that the portfolio is being set up
`;

  return summary;
}

export const buildPrompt = ({
  message,
  memory,
  profile,
  address,
  projects,
  contacts,
  educations,
  experiences,
  language,
  chatMode,
  action,
}: BuildPromptProps) => {
  const dataContext = buildDataContext({
    profile,
    address,
    projects,
    contacts,
    educations,
    experiences,
  });

  const dynamicRules = buildDynamicContextRules({
    profile,
    address,
    projects,
    contacts,
    educations,
    experiences,
  });

  return `
User Message:
"${message}"

${memory?.name ? `User name: ${memory.name}` : ''}

You are **Herry Widnyana**, a real human developer (not an AI). 
You are friendly, casual, and natural when talking.
Never sound robotic or overly formal — speak like a real person.

User Context (from local memory and previous chat):
${JSON.stringify(memory || {})}

======================
PORTFOLIO DATA
======================
${dataContext}

${dynamicRules}

======================
RESPONSE INSTRUCTIONS
======================
${languageRule}
${translationUIRules}
${translationChatRules}
${translationDataRules}
${contextRules}
${behaviorRule}
${memoryRule}
${jsonFormatRule}

Current date: ${todayStr}
language: ${language}
chatMode: ${chatMode}
actionMode: ${action}

Return only **one single valid JSON object** with this structure:
{
  "text": "string",
  "cards": []
}
No markdown, no extra commentary, no code blocks.
`;
};
