// ------------------------------------------------------------
// Auth0 SPA SDK – ESM Import
// ------------------------------------------------------------
import { createAuth0Client } from
  "https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2/dist/auth0-spa-js.production.esm.js";

let auth0Client = null;

export async function initAuth() {
  auth0Client = await createAuth0Client({
    domain: "jsfun.eu.auth0.com",
    clientId: "rJ59QPQGJcEToOnMOqgaR3BSM91PRTq5",
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true
  });

  const params = new URLSearchParams(window.location.search);

  // ----------------------------------------------------------
  // ❌ Fehler (z.B. account_not_approved) → Speicher löschen
  // ----------------------------------------------------------
  if (params.has("error")) {
    console.warn("Auth Error:", params.get("error"), params.get("error_description"));
    clearAuth0Storage();
    // URL wird in main.js gehandhabt - hier nichts tun
    return auth0Client;
  }

  // ----------------------------------------------------------
  // Normaler OAuth Callback
  // ----------------------------------------------------------
  if (params.has("code") && params.has("state")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return auth0Client;
}

// ------------------------------------------------------------
// Login (NUR wenn main.js es explizit will)
// ------------------------------------------------------------
export function login() {
  return auth0Client.loginWithRedirect({
    authorizationParams: {
      prompt: "select_account"
    }
  });
}

// Erzwinge neuen Login (löscht Cache)
export function forceLogin() {
  clearAuth0Storage();
  return auth0Client.loginWithRedirect({
    authorizationParams: {
      prompt: "login" // Erzwingt komplette Neuanmeldung
    }
  });
}

export function getAuth0Client() {
  return auth0Client;
}

export async function isAuthenticated() {
  return auth0Client.isAuthenticated();
}

export async function getUser() {
  return auth0Client.getUser();
}

export function logout() {
  clearAuth0Storage();
  return auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

// ------------------------------------------------------------
// Storage Cleanup
// ------------------------------------------------------------
function clearAuth0Storage() {
  Object.keys(localStorage)
    .filter(k => k.startsWith("auth0"))
    .forEach(k => localStorage.removeItem(k));
  sessionStorage.clear();
}
