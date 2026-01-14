export default `
<section class="panel news-panel">

  <!-- Loading Indicator -->
  <div class="news-loading hidden">
    <div class="loading-spinner"></div>
    <div class="loading-text">
      <span data-i18n="news-loading">News werden geladen</span>
      <span class="loading-dots"></span>
    </div>
  </div>

  <!-- Search + Sort -->
  <div class="news-search">

    <div class="news-sort">
      <button
        class="sort-btn"
        data-sort="date">
        Datum ↓
      </button>

      <button
        class="sort-btn"
        data-sort="alpha">
        A–Z
      </button>
    </div>

    <div class="search-input-wrapper">
      <input
        type="text"
        data-i18n="news-search-placeholder"
        placeholder="Suchtext eingeben …"
        aria-label="News durchsuchen"
      />
      <button
        class="clear-search"
        data-i18n="news-clear-label"
        aria-label="Suche leeren"
        title="Suche leeren">
        ✕
      </button>
    </div>

  </div>

  <!-- News List -->
  <ul class="news-list"></ul>

  <!-- Lazy Loading Indicator -->
  <div class="news-loader" data-i18n="news-loader">
    Weitere Einträge werden geladen …
  </div>

</section>
`;
