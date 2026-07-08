// Предупреждения по текущим условиям — честно предупреждаем о рисках,
// а не только продаём "хороший прогноз" (см. бриф: доверие важнее красивых цифр).

export function computeWarnings(current, month) {
  const warnings = [];

  if (current.windSpeed >= 10) {
    warnings.push({
      icon: "💨",
      text: "Сильный ветер — на воде будет некомфортно, лодку лучше не брать.",
    });
  }

  if (Math.abs(current.pressureTrend3h) >= 3) {
    warnings.push({
      icon: current.pressureTrend3h > 0 ? "📈" : "📉",
      text: "Резкий скачок давления за последние часы — рыба может капризничать сильнее обычного.",
    });
  }

  if (current.precip >= 4) {
    warnings.push({
      icon: "🌧️",
      text: "Ожидается сильный дождь — возьмите дождевик и берегите снасти.",
    });
  }

  if ([11, 0, 1].includes(month) && current.tempAir <= 2) {
    warnings.push({
      icon: "🧊",
      text: "Зимний период — на льду будьте осторожны: проверяйте толщину и не выходите в одиночку.",
    });
  }

  return warnings;
}
