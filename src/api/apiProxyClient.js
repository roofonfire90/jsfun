// src/services/api/apiProxyClient.js

const PROXY_ENDPOINT = "/api/proxy";

export async function apiProxyRequest({
  method,
  url,
  headers = {},
  params = null,
  body = null,
  timeoutMs = 15000,
}) {
  if (!method) {
    throw new Error("apiProxyRequest: method is required");
  }

  if (!url) {
    throw new Error("apiProxyRequest: url is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  let responseText;

  try {
    response = await fetch(PROXY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "identity",
        ...headers,
      },
      body: JSON.stringify({
        method,
        url,
        params,
        body,
      }),
      signal: controller.signal,
    });

    responseText = await response.text();
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError")
      throw new Error("API proxy request timed out");
    
    throw new Error(`API proxy network error: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok)
    throw new Error(`API proxy HTTP ${response.status}: ${responseText || "Unknown error"}`);
  
  if (!responseText)
    return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}
