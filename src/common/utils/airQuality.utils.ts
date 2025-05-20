export function temperatureScore(temp: number): number {
  if (temp >= 20 && temp <= 25) return 100;
  if ((temp >= 15 && temp < 20) || (temp > 25 && temp <= 30)) return 70;
  if ((temp >= 10 && temp < 15) || (temp > 30 && temp <= 35)) return 40;
  return 10;
}

export function humidityScore(humidity: number): number {
  if (humidity >= 30 && humidity <= 50) return 100;
  if ((humidity >= 20 && humidity < 30) || (humidity > 50 && humidity <= 60))
    return 70;
  if ((humidity >= 10 && humidity < 20) || (humidity > 60 && humidity <= 70))
    return 40;
  return 10;
}

export function ppmScore(ppm: number): number {
  if (ppm <= 800) return 100;
  if (ppm <= 1000) return 70;
  if (ppm <= 1500) return 40;
  return 10;
}

export function airQualityScore(
  temp: number,
  humidity: number,
  ppm: number,
): number {
  const t = temperatureScore(temp);
  const h = humidityScore(humidity);
  const p = ppmScore(ppm);
  const score = 0.25 * t + 0.25 * h + 0.5 * p;
  return Math.round(score);
}

export function airQualityLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Poor';
  return 'Hazardous';
}
