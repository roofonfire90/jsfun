/**
 * ============================================================
 * API Client – Zentrale Fetch-Hilfsfunktion
 * ============================================================
 *
 * Zweck:
 * - Einheitlicher Zugriff auf externe APIs
 * - Saubere Fehlerdiagnose bei:
 *   - HTTP-Fehlern
 *   - CORS-/Proxy-Problemen
 *   - HTML-Fallbacks (z. B. Vite index.html)
 *
 * Design-Entscheidungen:
 * - Der Response-Body wird GENAU EINMAL gelesen
 * - JSON wird explizit selbst geparst
 * - Fehler schlagen früh und mit Kontext zu
 *
 * Wichtiger Hinweis:
 * - Diese Funktion erwartet JSON-Antworten
 * - Andere Content-Types werden als Fehler behandelt
 */

/**
 * Führt einen Fetch-Request aus und erwartet JSON als Antwort.
 *
 * @param {string} url Ziel-URL (relativ, über Proxy)
 * @returns {Promise<any>} Geparstes JSON
 */
export const fetchJson = async (url) => {
  const res = await fetch(url);

  // Content-Type explizit auswerten (nicht blind res.json() nutzen)
  const contentType = res.headers.get("content-type") || "";

  // Response-Body exakt EINMAL lesen
  const bodyText = await res.text();

  // ------------------------------------------------------------
  // HTTP-Status prüfen
  // ------------------------------------------------------------
  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} for ${url}\n` +
      bodyText.slice(0, 300)
    );
  }

  // ------------------------------------------------------------
  // Content-Type validieren
  // ------------------------------------------------------------
  // HTML deutet fast immer auf:
  // - Proxy-Fallback
  // - index.html
  // - externe Fehlerseite
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got "${contentType}" for ${url}\n` +
      bodyText.slice(0, 300)
    );
  }

  // ------------------------------------------------------------
  // JSON explizit parsen
  // ------------------------------------------------------------
  return JSON.parse(bodyText);
};
