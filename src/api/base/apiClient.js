/**
 * Zentrale Fetch-Hilfsfunktion für JSON-APIs.
 *
 * - Erwartet JSON-Antworten
 * - Liest den Response-Body genau einmal
 * - Liefert aussagekräftige Fehler bei HTTP- oder Content-Type-Problemen
 *
 * @param {string} url Ziel-URL (relativ, über Proxy)
 * @returns {Promise<any>} Geparstes JSON
 */
export const fetchJson = async (url) => {
  const res = await fetch(url);

  const contentType = res.headers.get("content-type") || "";
  const bodyText = await res.text();

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} for ${url}\n` +
      bodyText.slice(0, 300)
    );
  }

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got "${contentType}" for ${url}\n` +
      bodyText.slice(0, 300)
    );
  }

  return JSON.parse(bodyText);
};
