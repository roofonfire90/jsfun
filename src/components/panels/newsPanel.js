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
  // Render
  // ---------------------------
  function render() {
    const visible = state.filtered.slice(0, state.visibleCount);
    renderNewsList(listEl, visible);

    loader.style.display =
      state.visibleCount < state.filtered.length ? "block" : "none";
  }
}
