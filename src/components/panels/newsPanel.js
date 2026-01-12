import { fetchCryptoNews } from "../../api/newsApi.js";
import { newsStore } from "../../state/store.js";
import { renderNewsList } from "./newsRenderer.js";

let initialized = false;

/**
 * Initialisiert das News-Panel.
 * - verwendet globalen newsStore
 * - kein lokaler State
 * - deterministisches Verhalten
 */
export async function initNewsPanel(panelRoot) {
  if (initialized) return;
  initialized = true;

  const listEl   = panelRoot.querySelector(".news-list");
  const input    = panelRoot.querySelector(".news-search input");
  const clearBtn = panelRoot.querySelector(".clear-search");
  const loader   = panelRoot.querySelector(".news-loader");
  const sortBtns = panelRoot.querySelectorAll(".sort-btn");

  /* --------------------------------------------------
     1. Daten laden (Cache → Fetch)
     -------------------------------------------------- */
  if (!newsStore.hydrateFromCache()) {
    const articles = await fetchCryptoNews();
    newsStore.setNews(articles);
  }

  render();

  /* --------------------------------------------------
     2. Suche
     -------------------------------------------------- */
  input.addEventListener("input", () => {
    newsStore.setSearchTerm(input.value);
    render();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    newsStore.setSearchTerm("");
    render();
  });

  /* --------------------------------------------------
     3. Sortierung
     -------------------------------------------------- */
  sortBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.sort;
      const current = newsStore.getMeta();

      // Richtung bestimmen
      let direction = "asc";
      if (field === "date") direction = "desc";

      // Toggle bei erneutem Klick
      if (
        newsStore.getMeta().sort?.field === field &&
        newsStore.getMeta().sort?.direction === direction
      ) {
        direction = direction === "asc" ? "desc" : "asc";
      }

      newsStore.setSort(field, direction);

      // UI-State
      sortBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Button-Label
      if (field === "date") {
        btn.textContent = direction === "asc" ? "Datum ↑" : "Datum ↓";
      }

      if (field === "alpha") {
        btn.textContent = direction === "asc" ? "A–Z" : "Z–A";
      }

      render();
    });
  });

  /* --------------------------------------------------
     4. Accordion (Event Delegation)
     -------------------------------------------------- */
  listEl.addEventListener("click", e => {
    const title = e.target.closest(".news-title");
    if (!title) return;
    title.closest(".news-item")?.classList.toggle("open");
  });

  /* --------------------------------------------------
     5. Lazy Loading (UI-only)
     -------------------------------------------------- */
  panelRoot.addEventListener("scroll", () => {
    if (
      panelRoot.scrollTop + panelRoot.clientHeight >=
      panelRoot.scrollHeight - 40
    ) {
      newsStore.loadMore();
      render();
    }
  });

  /* --------------------------------------------------
     6. Render
     -------------------------------------------------- */
  function render() {
    const visible = newsStore.getVisible();
    renderNewsList(listEl, visible);
    loader.style.display = newsStore.hasMore() ? "block" : "none";
  }
}
