import { initTabs } from "./components/panels/tabs.js";
import { initHeroCarousel } from "./components/hero/HeroCarousel.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initHeroCarousel(); // darf NIE crashen
});
