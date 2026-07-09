// Лучшее время суток для рыбалки сегодня: утро/день/вечер/ночь.
// Берём по одной репрезентативной точке на каждый период из почасовых данных
// и считаем score той же формулой, что и общий прогноз (см. score.js).

import { getAstroData } from "./astro.js";
import { computeScore, scoreInterpretation } from "./score.js";

const CHECKPOINTS = [
  { key: "morning", label: "Утро", icon: "🌅", hour: 7 },
  { key: "day", label: "День", icon: "☀️", hour: 13 },
  { key: "evening", label: "Вечер", icon: "🌆", hour: 19 },
  { key: "night", label: "Ночь", icon: "🌙", hour: 23 },
];

export function findClosestIndex(times, target) {
  let best = 0;
  let bestDiff = Infinity;
  times.forEach((t, i) => {
    const diff = Math.abs(t.getTime() - target.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

export function hourlySnapshot(hourly, idx) {
  const idx3 = Math.max(0, idx - 3);
  return {
    pressure: hourly.pressure_msl[idx],
    pressureTrend3h: hourly.pressure_msl[idx] - hourly.pressure_msl[idx3],
    windSpeed: hourly.wind_speed_10m[idx],
    tempAir: hourly.temperature_2m[idx],
    precip: hourly.precipitation[idx],
    cloud: hourly.cloud_cover[idx],
  };
}

export function computeDayWindows(weather, lat, lon, reports, baseDate = new Date()) {
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);

  const windows = CHECKPOINTS.map((cp) => {
    const time = new Date(today);
    time.setHours(cp.hour, 0, 0, 0);
    const idx = findClosestIndex(weather.hourlyTimes, time);
    const snapshot = hourlySnapshot(weather.hourly, idx);
    const astro = getAstroData(time, lat, lon);
    const result = computeScore({ weather: { current: snapshot }, astro, reports, now: time });
    return { ...cp, time, result, interp: scoreInterpretation(result.score) };
  });

  const best = windows.reduce((a, b) => (b.result.score > a.result.score ? b : a));
  return { windows, best };
}
