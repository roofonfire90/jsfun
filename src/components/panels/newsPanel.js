import { fetchCryptoNews } from "../../api/newsApi.js";
import { createNewsState } from "./newsState.js";
import { renderNewsList } from "./newsRenderer.js";

let initialized = false;

export async function initNewsPanel(panelRoot) {
  if (initialized) return;
  initialized = true;

  const listEl = panelRoot.querySelector(".news-list");
  const input = panelRoot.querySelector(".news-search input");
  const clearBtn = panelRoot.querySelector(".clear-search");
  const loader = panelRoot.querySelector(".news-loader");

  const state = createNewsState();

  const sortButtons = panelRoot.querySelectorAll(".sort-btn");

  sortButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.sort;

      if (state.sort.by === type) {
        // Richtung toggeln
        state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
      } else {
        state.sort.by = type;
        state.sort.dir = type === "date" ? "desc" : "asc";
      }

      // UI-State
      sortButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Label anpassen
      if (type === "date") {
        btn.textContent = state.sort.dir === "asc" ? "Datum ↑" : "Datum ↓";
      }

      if (type === "alpha") {
        btn.textContent = state.sort.dir === "asc" ? "A–Z" : "Z–A";
      }

      render();
    });
  });

  // ---------------------------
  // Load Data
  // ---------------------------
  state.all = await fetchCryptoNews();
  state.filtered = state.all;

  render();

  // ---------------------------
  // Search
  // ---------------------------
  input.addEventListener("input", () => {
    state.searchTerm = input.value.trim().toLowerCase();
    state.visibleCount = 50;

    state.filtered = state.all.filter(n =>
      n.title.toLowerCase().includes(state.searchTerm)
    );

    render();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    input.dispatchEvent(new Event("input"));
  });

  // ---------------------------
  // Accordion
  // ---------------------------
  listEl.addEventListener("click", e => {
    const title = e.target.closest(".news-title");
    if (!title) return;
    title.closest(".news-item").classList.toggle("open");
  });

  // ---------------------------
  // Lazy Loading (Scroll)
  // ---------------------------
  panelRoot.addEventListener("scroll", () => {
    if (
      panelRoot.scrollTop + panelRoot.clientHeight >=
      panelRoot.scrollHeight - 40
    ) {
      state.visibleCount += 50;
      render();
    }
  });

  // ---------------------------
  // Sortieren
  // ---------------------------
  function sortItems(items, sort) {
    const sorted = [...items];

    if (sort.by === "date") {
      sorted.sort((a, b) => {
        const da = new Date(a.pubDate).getTime();
        const db = new Date(b.pubDate).getTime();
        return sort.dir === "asc" ? da - db : db - da;
      });
    }

    if (sort.by === "alpha") {
      sorted.sort((a, b) => {
        const ta = a.title.toLowerCase();
        const tb = b.title.toLowerCase();
        return sort.dir === "asc"
          ? ta.localeCompare(tb)
          : tb.localeCompare(ta);
      });
    }

    return sorted;
  }

  // ---------------------------
  // Render
  // ---------------------------
  function render() {
    const sorted = sortItems(state.filtered, state.sort);
    const visible = sorted.slice(0, state.visibleCount);

    renderNewsList(listEl, visible);

    loader.style.display =
      state.visibleCount < sorted.length ? "block" : "none";
  }

}
