function getSeason(
  date: Date = new Date(),
): 'winter' | 'spring' | 'summer' | 'autumn' {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function temperatureScore(
  temp: number,
  date: Date = new Date(),
): number {
  const season = getSeason(date);

  let optimalMin = 0,
    optimalMax = 0,
    acceptMin = 0,
    acceptMax = 0;

  switch (season) {
    case 'winter':
      optimalMin = 19;
      optimalMax = 22;
      acceptMin = 17;
      acceptMax = 25;
      break;
    case 'spring':
      optimalMin = 20;
      optimalMax = 24;
      acceptMin = 17;
      acceptMax = 27;
      break;
    case 'summer':
      optimalMin = 22;
      optimalMax = 26;
      acceptMin = 20;
      acceptMax = 28;
      break;
    case 'autumn':
      optimalMin = 20;
      optimalMax = 23;
      acceptMin = 17;
      acceptMax = 25;
      break;
  }

  if (temp >= optimalMin && temp <= optimalMax) return 100;
  if (temp >= acceptMin && temp <= acceptMax) return 70;
  if (
    (temp >= acceptMin - 2 && temp < acceptMin) ||
    (temp > acceptMax && temp <= acceptMax + 2)
  )
    return 40;
  return 10;
}

export function humidityScore(
  humidity: number,
  date: Date = new Date(),
): number {
  const season = getSeason(date);

  let optimalMin = 0,
    optimalMax = 0,
    acceptMin = 0,
    acceptMax = 0;

  switch (season) {
    case 'winter':
      optimalMin = 30;
      optimalMax = 45;
      acceptMin = 25;
      acceptMax = 50;
      break;
    case 'spring':
      optimalMin = 35;
      optimalMax = 55;
      acceptMin = 30;
      acceptMax = 60;
      break;
    case 'summer':
      optimalMin = 40;
      optimalMax = 60;
      acceptMin = 35;
      acceptMax = 65;
      break;
    case 'autumn':
      optimalMin = 35;
      optimalMax = 55;
      acceptMin = 30;
      acceptMax = 60;
      break;
  }

  if (humidity >= optimalMin && humidity <= optimalMax) return 100;
  if (humidity >= acceptMin && humidity <= acceptMax) return 70;
  if (
    (humidity >= acceptMin - 5 && humidity < acceptMin) ||
    (humidity > acceptMax && humidity <= acceptMax + 5)
  )
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
  date: Date = new Date(),
): number {
  const t = temperatureScore(temp, date);
  const h = humidityScore(humidity, date);
  const p = ppmScore(ppm);
  const score = 0.2 * t + 0.3 * h + 0.5 * p;
  return Math.round(score);
}

export function airQualityLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Poor';
  return 'Hazardous';
}
