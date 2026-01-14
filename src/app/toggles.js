import { setLanguage } from "../services/calculationService.js";

/**
 * Translations for UI elements
 */
const translations = {
  de: {
    "investment-title": "Investitionsvergleich (Jahresende)",
    "investment-label": "Investitionsbetrag (€)",
    "investment-button": "Auswerten"
  },
  en: {
    "investment-title": "Investment Comparison (Year-End)",
    "investment-label": "Investment Amount (€)",
    "investment-button": "Evaluate"
  }
};

let currentLang = "de";
let isDarkMode = false;

/**
 * Initialize theme toggle
 */
const initThemeToggle = () => {
  const themeBtn = document.getElementById("theme-toggle");
  if (!themeBtn) return;

  const sunIcon = themeBtn.querySelector(".icon-sun");
  const moonIcon = themeBtn.querySelector(".icon-moon");

  // Check for saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    isDarkMode = true;
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }

  themeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    sunIcon.classList.toggle("hidden");
    moonIcon.classList.toggle("hidden");

    // Save preference
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });
};

/**
 * Update language in the DOM
 */
const updateLanguage = () => {
  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      if (element.tagName === "INPUT") {
        element.placeholder = translations[currentLang][key];
      } else {
        element.textContent = translations[currentLang][key];
      }
    }
  });

  // Update calculator service language
  setLanguage(currentLang);

  // Re-render investment results if they exist
  const calcBtn = document.getElementById("investment-calc-btn");
  if (calcBtn) {
    calcBtn.click();
  }
};

/**
 * Initialize language toggle
 */
const initLanguageToggle = () => {
  const langBtn = document.getElementById("lang-toggle");
  if (!langBtn) return;

  const deFlag = langBtn.querySelector(".flag-de");
  const enFlag = langBtn.querySelector(".flag-en");

  // Check for saved preference
  const savedLang = localStorage.getItem("language");
  if (savedLang === "en") {
    currentLang = "en";
    deFlag.classList.add("hidden");
    enFlag.classList.remove("hidden");
    updateLanguage();
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "de" ? "en" : "de";
    deFlag.classList.toggle("hidden");
    enFlag.classList.toggle("hidden");

    // Save preference
    localStorage.setItem("language", currentLang);

    // Update UI
    updateLanguage();
  });
};

/**
 * Initialize all toggles
 */
export const initToggles = () => {
  initThemeToggle();
  initLanguageToggle();
};
