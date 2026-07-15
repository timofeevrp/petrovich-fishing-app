// MAX-контакт — номер телефона, по которому рыбаку можно написать/позвонить
// в MAX. Приложение не открывает MAX напрямую (нет надёжной публичной
// схемы диплинка) — просто показывает номер и даёт tel:-ссылку. Сам
// номер собираем из проверенных цифр, а не из сырого ввода, поэтому
// опасные схемы (javascript:, data: и т.п.) here в принципе невозможны.

export function normalizeMaxContact(raw) {
  const value = (raw || "").trim();
  if (!value) return { phoneDigits: "", display: "", telHref: "", error: "" };

  const cleaned = value.replace(/[^\d+]/g, "");
  if (!cleaned) {
    return { phoneDigits: "", display: "", telHref: "", error: "Проверьте номер телефона." };
  }

  let digits = cleaned.replace(/\D/g, "");
  // Российский номер, набранный с 8 — приводим к формату с 7.
  if (digits.length === 11 && digits[0] === "8") digits = "7" + digits.slice(1);

  if (digits.length < 10 || digits.length > 15) {
    return { phoneDigits: "", display: "", telHref: "", error: "Проверьте номер телефона — введите в международном формате, например +7 999 123-45-67." };
  }

  return { phoneDigits: digits, display: formatPhoneDisplay(digits), telHref: `tel:+${digits}`, error: "" };
}

function formatPhoneDisplay(digits) {
  if (digits.length === 11 && digits[0] === "7") {
    const d = digits.slice(1);
    return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  }
  return "+" + digits;
}

// Рендерит номер телефона (текстом, чтобы можно было просто скопировать
// и написать самому) + кнопку tel:-ссылки. Ничего не рендерит, если
// номера нет — рассчитывает на уже провалидированные phoneDigits/display.
export function renderMaxContact(phoneDigits, display, escapeHtml) {
  if (!phoneDigits) return "";
  return `
    <div class="section-header"><span class="icon">💬</span><h3>MAX</h3></div>
    <div class="card" style="text-align:center;">
      <div style="font-size:19px;font-weight:800;letter-spacing:0.02em;">${escapeHtml(display)}</div>
      <div class="card-sub">Напишите или позвоните в MAX по этому номеру</div>
      <a href="tel:+${escapeHtml(phoneDigits)}" class="btn-primary btn-full" style="display:block;text-align:center;text-decoration:none;margin-top:10px;">📞 Связаться</a>
    </div>`;
}
