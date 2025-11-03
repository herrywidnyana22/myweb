export const getColor = (value: number) => {
    if (value > 80) return '#32D74B'; // Hijau (iOS green)
    if (value > 50) return '#FFA500'; // Oranye
    return '#FF3B30'; // Merah (iOS red)
  };