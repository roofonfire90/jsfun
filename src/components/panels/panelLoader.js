import { initFinancePanel } from "./financePanel.js";
import { initNewsPanel } from "./newsPanel.js";

const panelCache = new Map();

export async function loadPanel(name) {
  const container = document.querySelector("#panel-content");
  if (!container) {
    throw new Error("panel-content Container nicht gefunden");
  }

  // Panel existiert bereits → nur aktivieren
  if (panelCache.has(name)) {
    activatePanel(name);
    return;
  }

  // Panel laden
  const res = await fetch(`/src/components/panels/${name}.html`);
  if (!res.ok) {
    throw new Error(`Panel ${name} konnte nicht geladen werden`);
  }

  const html = await res.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();

  const panel = wrapper.querySelector(".panel");
  if (!panel) {
    throw new Error(`Panel ${name} enthält kein Root-Element`);
  }

  panel.dataset.panel = name;
  panel.classList.add("panel", "active");

  container.appendChild(panel);
  panelCache.set(name, panel);

  // Panel-spezifische Initialisierung

  if (name === "finance") {
    requestAnimationFrame(() => {
      initFinancePanel(panel);
    });
  }

  if (name === "news") {
    requestAnimationFrame(() => {
      initNewsPanel(panel);
    });
  }

  activatePanel(name);
}

function activatePanel(name) {
  panelCache.forEach((panel, key) => {
    panel.classList.toggle("active", key === name);
  });
}
