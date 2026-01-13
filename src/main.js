import { initHeroCarousel } from "./components/hero/HeroCarousel.js";
import { initTabs } from "./components/panels/tabs.js";

// Dev-only: Run smoke test for API proxy
// if (import.meta.env.DEV) {
//   import("/dev/smokeTestProxy.js").then(({ runProxySmokeTest }) => {
//     runProxySmokeTest();
//   });
// }

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initHeroCarousel();
});
