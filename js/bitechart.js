// Почасовой график клёва на сутки — детальнее, чем 4 чекпоинта в timewindows.js:
// считаем score той же формулой (score.js) для каждого из 24 часов, плюс отдельно
// solunar-подсчёт (subs.solunar) для вкладки "Клёв по луне".

import { getAstroData } from "./astro.js";
import { computeScore } from "./score.js";
import { findClosestIndex, hourlySnapshot } from "./timewindows.js";

function extractWindows(hours, key, predicate) {
  const windows = [];
  let start = null;
  for (let i = 0; i <= hours.length; i++) {
    const match = i < hours.length && predicate(hours[i][key]);
    if (match && start === null) start = i;
    if (!match && start !== null) {
      const slice = hours.slice(start, i);
      windows.push({
        startHour: start,
        endHour: i,
        avg: Math.round(slice.reduce((s, h) => s + h[key], 0) / slice.length),
      });
      start = null;
    }
  }
  return windows;
}

function formatHourRange(startHour, endHour) {
  const fmt = (h) => `${String(h % 24).padStart(2, "0")}:00`;
  return `${fmt(startHour)}–${fmt(endHour)}`;
}

function summarize(hours, key) {
  const avg = Math.round(hours.reduce((s, h) => s + h[key], 0) / hours.length);
  const max = Math.max(...hours.map((h) => h[key]));

  const peakWindows = extractWindows(hours, key, (v) => v >= max - 8)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 2)
    .sort((a, b) => a.startHour - b.startHour);

  const goodWindows = extractWindows(hours, key, (v) => v >= 55 && v < max - 8)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 2)
    .sort((a, b) => a.startHour - b.startHour);

  return {
    avg,
    max,
    peakLabel: peakWindows.map((w) => formatHourRange(w.startHour, w.endHour)).join(", ") || "—",
    goodLabel: goodWindows.map((w) => formatHourRange(w.startHour, w.endHour)).join(", ") || "—",
  };
}

export function computeHourlyBiteSeries({ weather, lat, lon, reports, date }) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const hours = [];
  for (let h = 0; h < 24; h++) {
    const time = new Date(day);
    time.setHours(h, 0, 0, 0);
    const idx = findClosestIndex(weather.hourlyTimes, time);
    const snapshot = hourlySnapshot(weather.hourly, idx);
    const astro = getAstroData(time, lat, lon);
    const result = computeScore({ weather: { current: snapshot }, astro, reports, now: time });
    hours.push({ hour: h, time, score: result.score, solunarScore: Math.round(result.subs.solunar) });
  }

  const weatherSummary = summarize(hours, "score");
  const moonSummary = summarize(hours, "solunarScore");

  return {
    hours,
    avgScore: weatherSummary.avg,
    peakLabel: weatherSummary.peakLabel,
    goodLabel: weatherSummary.goodLabel,
    avgSolunar: moonSummary.avg,
    peakSolunarLabel: moonSummary.peakLabel,
    goodSolunarLabel: moonSummary.goodLabel,
  };
}
