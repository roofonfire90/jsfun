import { apiProxyRequest } from "../apiProxyClient.js";

/**
 * Zentrale Fetch-Hilfsfunktion für JSON-APIs (Proxy-basiert).
 *
 * - IMMER über /api/proxy
 * - Erwartet JSON
 * - Liest Body genau einmal
 */
export const fetchJson = async (url) => {
  const response = await apiProxyRequest({
    method: "GET",
    url,
  });

  if (response == null) {
    throw new Error(`Empty response for ${url}`);
  }

  return response;
};
