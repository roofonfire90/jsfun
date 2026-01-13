import { fetchJson } from "./base/apiClient.js";
import { CRYPTO_NEWS_EP } from "../constants/api_endpoints.js";

/**
 * Crypto News API
 * - Proxy-basiert
 * - Keine Filterung
 * - Keine Interpretation
 */
export async function fetchCryptoNews() {
  const data = await fetchJson(CRYPTO_NEWS_EP);

  if (!Array.isArray(data?.articles)) {
    throw new Error("News API: articles fehlt oder falsches Format");
  }

  return data.articles;
}
