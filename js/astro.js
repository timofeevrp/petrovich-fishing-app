// Астрономический блок: фаза луны, восход/закат, приближённые solunar-окна.
// Использует SunCalc (глобальный, подключён через CDN в index.html).
// Solunar-транзит луны считается упрощённо — сэмплированием высоты луны по суткам,
// это proxy-модель для MVP, не претендующая на точность профессиональных solunar-калькуляторов.

function sampleMoonAltitude(date, lat, lon, stepMinutes = 10) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const samples = [];
  for (let m = 0; m < 24 * 60; m += stepMinutes) {
    const t = new Date(dayStart.getTime() + m * 60000);
    const pos = SunCalc.getMoonPosition(t, lat, lon);
    samples.push({ time: t, altitude: pos.altitude });
  }
  return samples;
}

function findExtrema(samples) {
  let max = samples[0];
  let min = samples[0];
  for (const s of samples) {
    if (s.altitude > max.altitude) max = s;
    if (s.altitude < min.altitude) min = s;
  }
  return { transit: max.time, underfoot: min.time };
}

export function getAstroData(date, lat, lon) {
  const illum = SunCalc.getMoonIllumination(date);
  const sunTimes = SunCalc.getTimes(date, lat, lon);
  const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
  const samples = sampleMoonAltitude(date, lat, lon);
  const { transit, underfoot } = findExtrema(samples);

  const majorWindows = [transit, underfoot].map((t) => ({
    start: new Date(t.getTime() - 60 * 60000),
    end: new Date(t.getTime() + 60 * 60000),
  }));
  const minorWindows = [moonTimes.rise, moonTimes.set]
    .filter(Boolean)
    .map((t) => ({
      start: new Date(t.getTime() - 30 * 60000),
      end: new Date(t.getTime() + 30 * 60000),
    }));

  const inWindow = (t, windows) =>
    windows.some((w) => t >= w.start && t <= w.end);

  return {
    moonPhaseFraction: illum.fraction, // 0..1, освещённость
    moonPhaseAngle: illum.phase, // 0 = новолуние, 0.5 = полнолуние
    lunarDay: Math.min(30, Math.floor(illum.phase * 29.53) + 1), // 1..30, традиционный "лунный день"
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    moonrise: moonTimes.rise || null,
    moonset: moonTimes.set || null,
    isMajorWindowNow: inWindow(date, majorWindows),
    isMinorWindowNow: inWindow(date, minorWindows),
    majorWindows,
    minorWindows,
  };
}

export function moonPhaseLabel(phase) {
  if (phase < 0.03 || phase > 0.97) return "Новолуние";
  if (phase < 0.22) return "Растущий серп";
  if (phase < 0.28) return "Первая четверть";
  if (phase < 0.47) return "Растущая луна";
  if (phase < 0.53) return "Полнолуние";
  if (phase < 0.72) return "Убывающая луна";
  if (phase < 0.78) return "Последняя четверть";
  return "Убывающий серп";
}
