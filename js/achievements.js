// Достижения — геймификация вовлечённости (см. концепцию, п.7 и продуктовый бриф).

export const ACHIEVEMENTS = [
  {
    id: "first_report",
    icon: "🎯",
    title: "Первый отчёт",
    desc: "Оставьте свой первый отчёт о рыбалке",
    check: (s) => s.reportsCount >= 1,
  },
  {
    id: "three_reports",
    icon: "🐟",
    title: "Три отчёта",
    desc: "Оставьте 3 отчёта",
    check: (s) => s.reportsCount >= 3,
  },
  {
    id: "ten_reports",
    icon: "🏆",
    title: "Десять отчётов",
    desc: "Оставьте 10 отчётов",
    check: (s) => s.reportsCount >= 10,
  },
  {
    id: "first_favorite",
    icon: "⭐",
    title: "Первое место",
    desc: "Сохраните первое место в избранное",
    check: (s) => s.favCount >= 1,
  },
  {
    id: "photo_report",
    icon: "📸",
    title: "Фотодоказательство",
    desc: "Прикрепите фото к отчёту",
    check: (s) => s.hasPhotoReport,
  },
  {
    id: "explorer",
    icon: "🧭",
    title: "Исследователь",
    desc: "Оставьте отчёты по 2 разным водоёмам",
    check: (s) => s.distinctPoints >= 2,
  },
];

export function computeAchievements(stats) {
  return ACHIEVEMENTS.map((a) => ({ ...a, earned: a.check(stats) }));
}
