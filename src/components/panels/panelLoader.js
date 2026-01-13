import financeTemplate from "./finance.template.js";
import newsTemplate from "./news.template.js";
import aboutTemplate from "./about.template.js";

import { initFinancePanel } from "./financePanel.js";
import { initNewsPanel } from "./newsPanel.js";

const templates = {
  finance: financeTemplate,
  news: newsTemplate,
  about: aboutTemplate,
};

const panelCache = new Map();

export function loadPanel(name) {
  const container = document.querySelector("#panel-content");
  if (!container) {
    throw new Error("panel-content fehlt");
  }

  // bereits geladen → nur aktivieren
  if (panelCache.has(name)) {
    activatePanel(name);
    return;
  }

  const html = templates[name];
  if (!html) {
    throw new Error(`Panel '${name}' unbekannt`);
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();

  const panel = wrapper.firstElementChild;
  if (!panel || !panel.classList.contains("panel")) {
    throw new Error(`Panel '${name}' ohne gültiges Root-Element`);
  }

  panel.dataset.panel = name;

  container.appendChild(panel);
  panelCache.set(name, panel);

  // panel-spezifische Initialisierung
  if (name === "finance") {
    initFinancePanel(panel);
  }

  if (name === "news") {
    initNewsPanel(panel);
  }

  activatePanel(name);
}

function activatePanel(name) {
  panelCache.forEach((panel, key) => {
    panel.classList.toggle("active", key === name);
  });
}
