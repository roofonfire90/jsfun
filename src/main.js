import { initTabs } from "./components/panels/tabs.js";
import { initHeroCarousel } from "./components/hero/HeroCarousel.js";
import { initAuth, login, getUser, isAuthenticated } from "./app/auth/auth.js";
import { initToggles } from "./app/toggles.js";

(async () => {
  // 1. Auth initialisieren (inkl. Callback-Verarbeitung)
  await initAuth();

  // 2. Login-Status prüfen
  const loggedIn = await isAuthenticated();

  // 3. NICHT eingeloggt → sofort Auth0 Login
  if (!loggedIn) {
    await login();
    return; 

  // 4. Ab hier: User ist eingeloggt
  const user = await getUser();
  document.querySelector(".page").classList.remove("hidden");

  // 5. Jetzt erst App initialisieren
  initToggles();
  initTabs();
  initHeroCarousel();
})();
