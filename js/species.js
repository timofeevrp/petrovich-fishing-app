// База знаний по видам рыбы: сезонная активность, комфортная температура, наживка/снасти.
// Упрощённая эвристика для MVP (см. концепцию, раздел "Прогноз по видам рыбы" — P1),
// не заменяет реальные ихтиологические данные, но даёт объяснимую рекомендацию "на что ловить".

const SEASON_ORDER = ["winter", "spring", "summer", "autumn"];

export function getSeasonKey(month) {
  // month: 0-11 (Date.getMonth())
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "autumn";
}

function isAdjacentSeason(a, b) {
  const ia = SEASON_ORDER.indexOf(a);
  const ib = SEASON_ORDER.indexOf(b);
  const diff = Math.abs(ia - ib);
  return diff === 1 || diff === 3; // 3 — переход зима/осень по кругу
}

export const SPECIES_INFO = {
  "щука": {
    optimalTemp: 13,
    bestSeasons: ["spring", "autumn"],
    baits: {
      spring: "Блесна-колебалка, крупный воблер",
      summer: "Воблер, силиконовая приманка (джиг)",
      autumn: "Крупный воблер, живец",
      winter: "Жерлица на живца, балансир",
    },
    tackle: "Спиннинг / жерлица",
  },
  "окунь": {
    optimalTemp: 16,
    bestSeasons: ["summer", "autumn"],
    baits: {
      spring: "Мелкая вертушка, силикон",
      summer: "Воблер-крэнк, силикон малого размера",
      autumn: "Джиг-приманки, блесна",
      winter: "Мормышка, балансир",
    },
    tackle: "Спиннинг лайт / зимняя удочка",
  },
  "судак": {
    optimalTemp: 12,
    bestSeasons: ["autumn", "spring"],
    baits: {
      spring: "Джиг, поролонка",
      summer: "Джиг силикон на глубине",
      autumn: "Крупный джиг, глубоководный воблер",
      winter: "Балансир, отвесное блеснение",
    },
    tackle: "Спиннинг джиговый / зимняя снасть",
  },
  "лещ": {
    optimalTemp: 20,
    bestSeasons: ["summer"],
    baits: {
      spring: "Червь, мотыль на фидер",
      summer: "Кукуруза, бойлы, фидер",
      autumn: "Червь, опарыш",
      winter: "Мотыль, безмотылка",
    },
    tackle: "Фидер / поплавочная",
  },
  "карп": {
    optimalTemp: 22,
    bestSeasons: ["summer"],
    baits: {
      spring: "Кукуруза, червь",
      summer: "Бойлы, кукуруза с ароматизатором",
      autumn: "Бойлы малой жирности",
      winter: "Активность минимальна",
    },
    tackle: "Карповое удилище / фидер",
  },
  "карась": {
    optimalTemp: 20,
    bestSeasons: ["summer"],
    baits: {
      spring: "Мотыль, червь",
      summer: "Тесто, перловка, червь",
      autumn: "Опарыш, червь",
      winter: "Активность минимальна",
    },
    tackle: "Поплавочная / фидер",
  },
  "плотва": {
    optimalTemp: 14,
    bestSeasons: ["spring", "autumn"],
    baits: {
      spring: "Мотыль, опарыш",
      summer: "Растительные насадки, перловка",
      autumn: "Мотыль, опарыш",
      winter: "Мормышка с мотылём",
    },
    tackle: "Поплавочная / зимняя удочка",
  },
  "голавль": {
    optimalTemp: 18,
    bestSeasons: ["summer"],
    baits: {
      spring: "Червь",
      summer: "Кузнечик, небольшой воблер",
      autumn: "Воблер",
      winter: "Активность минимальна",
    },
    tackle: "Спиннинг лёгкий / поплавочная",
  },
  "язь": {
    optimalTemp: 13,
    bestSeasons: ["spring", "autumn"],
    baits: {
      spring: "Червь, мотыль",
      summer: "Растительные насадки, опарыш",
      autumn: "Червь",
      winter: "Мормышка",
    },
    tackle: "Поплавочная / спиннинг лёгкий",
  },
  "форель": {
    optimalTemp: 10,
    bestSeasons: ["autumn", "spring", "winter"],
    baits: {
      spring: "Блесна, силикон",
      summer: "Воблер ранним утром",
      autumn: "Блесна, силикон",
      winter: "Мормышка, блесна (платники)",
    },
    tackle: "Спиннинг ультралайт",
  },
  "ряпушка": {
    optimalTemp: 8,
    bestSeasons: ["autumn", "winter"],
    baits: {
      spring: "Мелкая мормышка",
      summer: "Мелкая мормышка",
      autumn: "Мормышка, мелкая блесна",
      winter: "Мормышка, мелкая блесна",
    },
    tackle: "Зимняя удочка / бортовая снасть",
  },
  "сом": {
    optimalTemp: 23,
    bestSeasons: ["summer"],
    baits: {
      spring: "Червь-выползок",
      summer: "Живец, квок",
      autumn: "Живец",
      winter: "Активность минимальна",
    },
    tackle: "Сомовье удилище / квок",
  },
  "жерех": {
    optimalTemp: 17,
    bestSeasons: ["summer", "autumn"],
    baits: {
      spring: "Блесна",
      summer: "Кастмастер, воблер на всплеск",
      autumn: "Воблер",
      winter: "Активность минимальна",
    },
    tackle: "Спиннинг дальнобойный",
  },
};

export const DEFAULT_SPECIES_POOL = ["щука", "окунь", "плотва", "лещ", "карась"];

const FALLBACK_INFO = {
  optimalTemp: 15,
  bestSeasons: ["spring", "autumn"],
  baits: {
    spring: "Универсальная насадка/приманка",
    summer: "Универсальная насадка/приманка",
    autumn: "Универсальная насадка/приманка",
    winter: "Мормышка",
  },
  tackle: "Универсальная снасть",
};

export function computeSpeciesLikelihood(speciesNames, month, waterTemp, generalScore) {
  const seasonKey = getSeasonKey(month);

  const scored = speciesNames.map((name) => {
    const info = SPECIES_INFO[name] || FALLBACK_INFO;
    let seasonBonus;
    if (info.bestSeasons.includes(seasonKey)) seasonBonus = 25;
    else if (info.bestSeasons.some((s) => isAdjacentSeason(seasonKey, s))) seasonBonus = 5;
    else seasonBonus = -20;

    const tempBonus = Math.max(-25, Math.min(20, 20 - Math.abs(waterTemp - info.optimalTemp) * 1.5));
    const speciesScore = Math.max(0, Math.min(100, 50 + seasonBonus + tempBonus));
    const finalScore = Math.round(speciesScore * 0.6 + generalScore * 0.4);

    return {
      name,
      score: Math.max(0, Math.min(100, finalScore)),
      bait: info.baits[seasonKey],
      tackle: info.tackle,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
