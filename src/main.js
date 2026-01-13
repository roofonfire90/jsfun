import { initHeroCarousel } from "./components/hero/HeroCarousel.js";
import { initTabs } from "./components/panels/tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initHeroCarousel();
});
