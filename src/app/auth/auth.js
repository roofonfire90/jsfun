// ------------------------------------------------------------
// Auth0 SPA SDK – korrekt als ESM importiert (named export)
// ------------------------------------------------------------
import { createAuth0Client } from "https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2/dist/auth0-spa-js.production.esm.js";

let auth0Client = null;

// ------------------------------------------------------------
// Init + Redirect Callback
// ------------------------------------------------------------
export async function initAuth() {
  auth0Client = await createAuth0Client({
    domain: "jsfun.eu.auth0.com",
    clientId: "rJ59QPQGJcEToOnMOqgaR3BSM91PRTq5",
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    cacheLocation: 'localstorage', // Speichert Tokens im localStorage
    useRefreshTokens: true // Verwendet Refresh Tokens
  });

  // OAuth Redirect Callback
  if (window.location.search.includes("code=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return auth0Client;
}

// ------------------------------------------------------------
// Auth helpers
// ------------------------------------------------------------
export function login() {
  return auth0Client.loginWithRedirect();
}

export function logout() {
  return auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

export async function getUser() {
  return await auth0Client.getUser();
}

export async function isAuthenticated() {
  return await auth0Client.isAuthenticated();
}
