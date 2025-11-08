

export function safeParseJSON(value: string | undefined) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    console.warn('Invalid JSON in Google Sheet cell:', value);
    return [];
  }
}

export const getColor = (value: number) => {
  if (value > 80) return '#32D74B'; 
  if (value > 50) return '#FFA500'; 

  return '#FF3B30'; // Merah (iOS red)
}



