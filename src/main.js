import { initTabs } from "./components/panels/tabs.js";
import { initHeroCarousel } from "./components/hero/HeroCarousel.js";
import {
  initAuth,
  login,
  getUser,
  isAuthenticated
} from "./app/auth/auth.js";
import { initToggles } from "./app/toggles.js";

(async () => {
  // ----------------------------------------------------------
  // 1. Auth0 initialisieren
  //    (inkl. Redirect-Callback & Fehlerhandling!)
  // ----------------------------------------------------------
  await initAuth();

  // ----------------------------------------------------------
  // 2. Prüfe ob Error in URL (z.B. account_not_approved)
  // ----------------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  if (params.has("error")) {
    const error = params.get("error");
    const errorDesc = params.get("error_description");
    
    // Spezieller Fall: Account nicht freigegeben
    if (error === "access_denied" && errorDesc === "account_not_approved") {
      document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="text-align: center; max-width: 500px; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
            <h1 style="color: #1f2937; margin-bottom: 16px; font-size: 24px;">Account muss freigegeben werden</h1>
            <p style="color: #6b7280; margin-bottom: 32px; line-height: 1.6;">
              Dein Account wurde noch nicht vom Administrator freigegeben.<br/>
              Bitte warte auf die Freigabe oder kontaktiere den Admin.
            </p>
            <button id="retry-login" style="padding: 14px 32px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s;">
              OK - Anderen Account versuchen
            </button>
          </div>
        </div>
      `;
      
      document.getElementById("retry-login").addEventListener("click", async () => {
        // Lösche Error-Parameter aus URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Importiere forceLogin
        const { forceLogin } = await import("./app/auth/auth.js");
        
        // Erzwinge neuen Login (löscht Cache und erzwingt neue Anmeldung)
        await forceLogin();
      });
      return;
    }
    
    // Andere Fehler
    const errorMsg = errorDesc || error;
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; max-width: 500px; padding: 40px;">
          <h1 style="color: #ef4444; margin-bottom: 16px;">⚠️ Login Error</h1>
          <p style="color: #6b7280; margin-bottom: 24px;">${errorMsg}</p>
          <button onclick="location.href='/'" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Try Again
          </button>
        </div>
      </div>
    `;
    return;
  }

  // ----------------------------------------------------------
  // 3. Login-Status prüfen
  // ----------------------------------------------------------
  const loggedIn = await isAuthenticated();

  // ----------------------------------------------------------
  // 4. Nicht eingeloggt → Login
  // ----------------------------------------------------------
  if (!loggedIn) {
    await login();
    return;
  }

  // ----------------------------------------------------------
  // 4. Eingeloggt → App freigeben
  // ----------------------------------------------------------
  const user = await getUser();
  console.log("User:", user);

  document.querySelector(".page").classList.remove("hidden");
  document.querySelector(".top-bar").classList.remove("hidden");

  initToggles();
  initTabs();
  initHeroCarousel();
})();
