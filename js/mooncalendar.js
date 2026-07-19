// Месячный лунный календарь клёва — в отличие от погодного прогноза (max 7 дней
// вперёд, дальше нет данных Open-Meteo), фаза луны известна на много месяцев
// вперёд, поэтому такой календарь можно строить на весь месяц и даже дальше.
// Это отдельный, чисто лунный сигнал — не смешивается с погодным баллом.

import { getAstroData } from "./astro.js";
import { solunarScore } from "./score.js";
import { scoreInterpretation } from "./score.js";

export function computeMonthLunarScores(year, month, lat, lon) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d, 12, 0, 0);
    const astro = getAstroData(date, lat, lon);
    const score = Math.round(solunarScore(astro, date));
    days.push({ date, day: d, score, interp: scoreInterpretation(score) });
  }
  return days;
}
