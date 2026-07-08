// Уровни рыбака по числу отчётов — геймификация вовлечённости (см. концепцию, п.7).

export const LEVELS = [
  { threshold: 0, name: "Новичок", icon: "🎣" },
  { threshold: 3, name: "Начинающий рыбак", icon: "🐟" },
  { threshold: 10, name: "Знаток водоёма", icon: "🥈" },
  { threshold: 25, name: "Эксперт региона", icon: "🥇" },
  { threshold: 50, name: "Легенда Саныча", icon: "👑" },
];

export function getLevelInfo(reportsCount) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (reportsCount >= LEVELS[i].threshold) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const progress = next
    ? Math.round(((reportsCount - current.threshold) / (next.threshold - current.threshold)) * 100)
    : 100;
  return { current, next, progress: Math.max(0, Math.min(100, progress)) };
}
