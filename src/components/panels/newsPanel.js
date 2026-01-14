import { fetchCryptoNews } from "../../api/newsApi.js";
import { newsStore } from "../../state/store.js";
import { renderNewsList } from "./newsRenderer.js";
import { getCurrentLang, getTranslations } from "../../app/toggles.js";

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
  const loadingIndicator = panelRoot.querySelector(".news-loading");
  const sortBtns = panelRoot.querySelectorAll(".sort-btn");
  const scrollContainer = panelRoot.querySelector(".news-content-wrapper");

  /* --------------------------------------------------
     1. Daten laden (Cache → Fetch)
     -------------------------------------------------- */
  if (!newsStore.hydrateFromCache()) {
    // Show loading animation
    loadingIndicator.classList.remove("hidden");
    
    const articles = await fetchCryptoNews();
    newsStore.setNews(articles);
    
    // Hide loading animation
    loadingIndicator.classList.add("hidden");
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
      console.log("Sort button clicked:", btn.dataset.sort);
      const field = btn.dataset.sort;
      const currentSort = newsStore.getMeta().sort;

      // Toggle direction if clicking the same field again
      let direction;
      if (currentSort.field === field) {
        // Toggle existing direction
        direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        // New field: set default direction
        direction = field === "date" ? "desc" : "asc";
      }

      newsStore.setSort(field, direction);
      console.log("Sort set to:", field, direction);

      // UI-State
      sortBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Button-Label mit Übersetzungen
      const lang = getCurrentLang();
      const dateAsc = lang === 'de' ? 'Datum ↑' : 'Date ↑';
      const dateDesc = lang === 'de' ? 'Datum ↓' : 'Date ↓';
      const alphaAsc = 'A–Z';
      const alphaDesc = 'Z–A';

      if (field === "date") {
        btn.textContent = direction === "asc" ? dateAsc : dateDesc;
      }

      if (field === "alpha") {
        btn.textContent = direction === "asc" ? alphaAsc : alphaDesc;
      }

      console.log("Rendering after sort...");
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
     5. Lazy Loading (Throttled)
     -------------------------------------------------- */
  let scrollTimeout = null;
  scrollContainer.addEventListener("scroll", () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 100
      ) {
        if (newsStore.hasMore()) {
          newsStore.loadMore();
          render();
        }
      }
    }, 100);
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
