/**
 * Global Application Store
 *
 * - Expliziter In-Memory-State
 * - Keine Frameworks
 * - Deterministisches Verhalten
 */

const NEWS_CACHE_KEY = "crypto-news-cache";
const NEWS_CACHE_TTL = 10 * 60 * 1000; // 10 Minuten

/* ======================================================
   NEWS STATE
   ====================================================== */

const newsState = {
  all: [],           // alle geladenen Artikel
  filtered: [],      // gefilterte / sortierte Ansicht
  searchTerm: "",
  sort: {
    field: "date",   // "date" | "alpha"
    direction: "desc"
  },
  visibleCount: 50,
  lastFetchedAt: null,
};

/* ======================================================
   NEWS CACHE (localStorage)
   ====================================================== */

function loadNewsFromCache() {
  try {
    const raw = localStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return null;

    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > NEWS_CACHE_TTL) {
      localStorage.removeItem(NEWS_CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function saveNewsToCache(data) {
  try {
    localStorage.setItem(
      NEWS_CACHE_KEY,
      JSON.stringify({
        data,
        ts: Date.now(),
      })
    );
  } catch {
    // bewusst ignorieren (Quota, Private Mode, etc.)
  }
}

/* ======================================================
   NEWS STORE API
   ====================================================== */

export const newsStore = {

  /* ---------- Init / Load ---------- */

  hydrateFromCache() {
    const cached = loadNewsFromCache();
    if (!cached) return false;

    newsState.all = cached;
    newsState.filtered = cached;
    newsState.lastFetchedAt = Date.now();
    return true;
  },

  setNews(articles) {
    // Filter out articles with titles starting with special characters
    const filtered = articles.filter(article => {
      if (!article.title) return false;
      const firstChar = article.title.trim()[0];
      // Allow only letters (any language) and numbers at the start
      return /^[\p{L}\p{N}]/u.test(firstChar);
    });

    newsState.all = filtered;
    newsState.filtered = filtered;
    newsState.visibleCount = 50;
    newsState.lastFetchedAt = Date.now();
    saveNewsToCache(filtered);
  },

  /* ---------- Query ---------- */

  getVisible() {
    return newsState.filtered.slice(0, newsState.visibleCount);
  },

  hasMore() {
    return newsState.visibleCount < newsState.filtered.length;
  },

  /* ---------- Mutations ---------- */

  setSearchTerm(term) {
    newsState.searchTerm = term.toLowerCase();
    newsState.visibleCount = 50;
    this.applyFilters();
  },

  setSort(field, direction) {
    newsState.sort = { field, direction };
    this.applyFilters();
  },

  loadMore(step = 50) {
    newsState.visibleCount += step;
  },

  /* ---------- Internal ---------- */

  applyFilters() {
    let result = [...newsState.all];

    // Search
    if (newsState.searchTerm) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(newsState.searchTerm)
      );
    }

    // Sort
    const { field, direction } = newsState.sort;

    result.sort((a, b) => {
      let v1, v2;

      if (field === "alpha") {
        v1 = a.title.toLowerCase();
        v2 = b.title.toLowerCase();
        
        // String-Vergleich: localeCompare
        if (direction === "asc") {
          return v1.localeCompare(v2);
        } else {
          return v2.localeCompare(v1);
        }
      } else {
        // Datum: numerischer Vergleich
        v1 = new Date(a.pubDate).getTime();
        v2 = new Date(b.pubDate).getTime();
        
        return direction === "asc" ? v1 - v2 : v2 - v1;
      }
    });

    newsState.filtered = result;
  },

  /* ---------- Debug / Info ---------- */

  getMeta() {
    return {
      total: newsState.all.length,
      filtered: newsState.filtered.length,
      visible: Math.min(newsState.visibleCount, newsState.filtered.length),
      lastFetchedAt: newsState.lastFetchedAt,
      sort: newsState.sort,
    };
  }
};
