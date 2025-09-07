import {
  languageRule,
  formatRule,
  educationRule,
  projectRule,
  profileRule,
  contactRule,
  highlightRule,
} from './promptRule';

export const buildPrompt = (message: string, projects: any, profile: any) => `
The user asked: "${message}"

Here is the portfolio data (JSON):
- Projects: ${JSON.stringify(projects)}
- Profile: ${JSON.stringify(profile)}

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
