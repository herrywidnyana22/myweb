import {
  languageRule,
  formatRule,
  educationRule,
  projectRule,
  profileRule,
  contactRule,
  highlightRule,
} from './promptRule';

export const buildPrompt = ({message, profile, address, projects, contacts, educations, experiences}: BuildPromptProps) => `
The user asked: "${message}"

Here is the portfolio data (JSON):
- Projects: ${JSON.stringify(projects)}
- Profile: ${JSON.stringify(profile)}
- Address: ${JSON.stringify(address)}
- Contacts: ${JSON.stringify(contacts)}
- Educations: ${JSON.stringify(educations)}
- Experiences: ${JSON.stringify(experiences)}

${languageRule}
${formatRule}
${educationRule}
${projectRule}
${profileRule}
${contactRule}
${highlightRule}

IMPORTANT:
- Always follow the JSON format strictly.
- Do not include explanations outside JSON.
`;
