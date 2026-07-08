// Геомагнитная активность (Kp-индекс) — NOAA SWPC, бесплатно, без ключа.
// ВАЖНО: научная связь геомагнитной активности с клёвом не подтверждена —
// показываем это только как информационную справку (как в народных рыболовных
// календарях), а не как фактор, влияющий на score.

const URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // Kp обновляется раз в 3 часа

let cache = null;

export async function fetchKpIndex() {
  if (cache && cache.expires > Date.now()) return cache.value;

  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Kp-index error: ${res.status}`);
  const rows = await res.json();
  const last = rows[rows.length - 1]; // { time_tag, Kp, a_running, station_count }
  const value = { time: last.time_tag, kp: parseFloat(last.Kp) };

  cache = { value, expires: Date.now() + CACHE_TTL_MS };
  return value;
}

export function kpLabel(kp) {
  if (kp < 3) return { label: "Спокойно", icon: "🟢" };
  if (kp < 5) return { label: "Слабая активность", icon: "🟡" };
  if (kp < 7) return { label: "Умеренная буря", icon: "🟠" };
  return { label: "Сильная буря", icon: "🔴" };
}
