/**
 * Crypto News API
 * - Nur Fetch
 * - Keine Filterung
 * - Keine Interpretation
 */
const NEWS_EP = "https://free-crypto-news.vercel.app/api/news?limit=50";

export async function fetchCryptoNews() {
  const res = await fetch(NEWS_EP);
  if (!res.ok) {
    throw new Error("News API nicht erreichbar");
  }

  const data = await res.json();

  if (!Array.isArray(data.articles)) {
    throw new Error("News API: articles fehlt oder falsches Format");
  }

  return data.articles;
}
