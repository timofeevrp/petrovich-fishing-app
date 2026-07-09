// Безопасная нормализация MAX-контакта. MAX здесь — просто внешний способ
// связи (как телефон или почта), а не встроенный чат и не партнёрская
// интеграция: приложение только строит безопасную внешнюю ссылку.

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;
const SAFE_PROTOCOLS = ["https:"];

export function normalizeMaxContact(raw) {
  const value = (raw || "").trim();
  if (!value) return { safeUrl: "", displayText: "", error: "" };

  if (!/:\/\//.test(value)) {
    // Похоже на голый username, без протокола.
    const username = value.replace(/^@/, "");
    if (!USERNAME_RE.test(username)) {
      return { safeUrl: "", displayText: "", error: "Проверьте MAX-контакт. Можно указать username или безопасную ссылку." };
    }
    return { safeUrl: `https://max.ru/u/${username}`, displayText: `@${username}`, error: "" };
  }

  // Похоже на ссылку — проверяем протокол максимально строго,
  // никаких javascript:/data:/file:/vbscript: и любых других схем.
  let url;
  try {
    url = new URL(value);
  } catch {
    return { safeUrl: "", displayText: "", error: "Проверьте MAX-контакт. Можно указать username или безопасную ссылку." };
  }
  if (!SAFE_PROTOCOLS.includes(url.protocol)) {
    return { safeUrl: "", displayText: "", error: "Проверьте MAX-контакт. Можно указать username или безопасную ссылку." };
  }
  return { safeUrl: url.href, displayText: url.hostname + url.pathname, error: "" };
}

// Рендерит безопасную кликабельную ссылку или, если ссылки нет/она невалидна,
// обычный неактивный текст — никогда не подставляет сырой ввод в href.
export function renderMaxLink(safeUrl, label, escapeHtml) {
  if (!safeUrl) return "";
  return `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-full" style="display:block;text-align:center;text-decoration:none;">${escapeHtml(label)}</a>`;
}
