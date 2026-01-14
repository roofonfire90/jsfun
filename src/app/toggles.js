import { setLanguage } from "../services/calculationService.js";

/**
 * Translations for UI elements
 */
const translations = {
  de: {
    // Hero Slides
    "hero-analysis": "ANALYSE",
    "hero-news": "NEWS",
    "hero-about": "ÜBER UNS",
    "hero-alt-analysis": "Analyse",
    "hero-alt-news": "News",
    "hero-alt-about": "Über uns",
    
    // Tabs
    "tab-finance": "Finanzen",
    "tab-news": "Neuigkeiten",
    "tab-about": "Über uns",
    
    // Finance Panel - Investment
    "investment-title": "Investitionsvergleich (Jahresende)",
    "investment-label": "Investitionsbetrag (€)",
    "investment-button": "Auswerten",
    "investment-error": "Bitte einen gültigen Investitionsbetrag eingeben.",
    
    // Charts
    "chart-comparison-title": "Was wäre aus deiner Investition geworden?",
    "chart-comparison-subtitle": "Startkapital:",
    "chart-comparison-placeholder-title": "Investitionsvergleich",
    "chart-comparison-placeholder-subtitle": "Bitte Betrag eingeben und auswerten",
    "chart-yaxis-value": "Wert (€)",
    "chart-investment": "Investment",
    "chart-endvalue": "Endwert",
    "chart-profit": "Gewinn",
    
    // News Panel
    "news-sort-date": "Datum ↓",
    "news-sort-alpha": "A–Z",
    "news-search-placeholder": "Suchtext eingeben …",
    "news-search-label": "News durchsuchen",
    "news-clear-label": "Suche leeren",
    "news-loader": "Weitere Einträge werden geladen …",
    
    // About Panel
    "about-title": "Data · Finance · Visualization",
    "about-description": "Dieses Projekt visualisiert Finanz- und Marktdaten mit einem klaren Fokus auf Verständlichkeit, Vergleichbarkeit und saubere Datenpipelines.",
    "about-tech": "Technologie-Stack: Vanilla JS · Vite · Highcharts · saubere Modulstruktur"
  },
  en: {
    // Hero Slides
    "hero-analysis": "ANALYSIS",
    "hero-news": "NEWS",
    "hero-about": "ABOUT",
    "hero-alt-analysis": "Analysis",
    "hero-alt-news": "News",
    "hero-alt-about": "About",
    
    // Tabs
    "tab-finance": "Finance",
    "tab-news": "News",
    "tab-about": "About",
    
    // Finance Panel - Investment
    "investment-title": "Investment Comparison (Year-End)",
    "investment-label": "Investment Amount (€)",
    "investment-button": "Evaluate",
    "investment-error": "Please enter a valid investment amount.",
    
    // Charts
    "chart-comparison-title": "What would have happened to your investment?",
    "chart-comparison-subtitle": "Starting capital:",
    "chart-comparison-placeholder-title": "Investment Comparison",
    "chart-comparison-placeholder-subtitle": "Please enter amount and evaluate",
    "chart-yaxis-value": "Value (€)",
    "chart-investment": "Investment",
    "chart-endvalue": "Final Value",
    "chart-profit": "Profit",
    
    // News Panel
    "news-sort-date": "Date ↓",
    "news-sort-alpha": "A–Z",
    "news-search-placeholder": "Enter search text …",
    "news-search-label": "Search news",
    "news-clear-label": "Clear search",
    "news-loader": "Loading more entries …",
    
    // About Panel
    "about-title": "Data · Finance · Visualization",
    "about-description": "This project visualizes financial and market data with a clear focus on understandability, comparability, and clean data pipelines.",
    "about-tech": "Technology Stack: Vanilla JS · Vite · Highcharts · clean module structure"
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
      } else if (element.hasAttribute("title")) {
        element.title = translations[currentLang][key];
      } else if (element.hasAttribute("aria-label")) {
        element.setAttribute("aria-label", translations[currentLang][key]);
      } else {
        element.textContent = translations[currentLang][key];
      }
    }
  });

  // Update all elements with data-i18n-alt attribute (for img alt tags)
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.getAttribute("data-i18n-alt");
    if (translations[currentLang][key]) {
      element.setAttribute("alt", translations[currentLang][key]);
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

// Export currentLang and translations for use in charts
export const getCurrentLang = () => currentLang;
export const getTranslations = () => translations;

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
 * Initialize logout button
 */
const initLogoutButton = () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    // Dynamic import to avoid circular dependency
    const { logout } = await import("./auth/auth.js");
    await logout();
  });
};

/**
 * Initialize all toggles
 */
export const initToggles = () => {
  initThemeToggle();
  initLanguageToggle();
  initLogoutButton();
};
