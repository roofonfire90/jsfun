import { loadPanel } from "./panelLoader.js";

export function initTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", async () => {
      const name = tab.dataset.panel;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      await loadPanel(name);
    });
  });

  // Initial
  loadPanel("finance");
}
