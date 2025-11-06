export function safeParseJSON(value: string | undefined) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    console.warn('⚠️ Invalid JSON in Google Sheet cell:', value);
    return [];
  }
}

export const getColor = (value: number) => {
  if (value > 80) return '#32D74B'; // Hijau (iOS green)
  if (value > 50) return '#FFA500'; // Oranye

  return '#FF3B30'; // Merah (iOS red)
};

export async function getMywebData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const [projects, profile, address, contacts, educations, experiences] = await Promise.all([
      fetch(`${baseUrl}/api/projects`).then(r => r.json()),
      fetch(`${baseUrl}/api/profile`).then(r => r.json()),
      fetch(`${baseUrl}/api/address`).then(r => r.json()),
      fetch(`${baseUrl}/api/contacts`).then(r => r.json()),
      fetch(`${baseUrl}/api/educations`).then(r => r.json()),
      fetch(`${baseUrl}/api/experiences`).then(r => r.json()),
    ]);
    return { projects, profile, address, contacts, educations, experiences };
  } catch (error) {
    console.error('Failed to fetch Google Sheet data:', error);
    throw new Error('Failed to load data from Sheets');
  }
}