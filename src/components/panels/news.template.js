export default `
<section class="panel news-panel">

  <!-- Search + Sort -->
  <div class="news-search">

    <div class="news-sort">
      <button
        class="sort-btn"
        data-sort="date"
        title="Nach Datum sortieren">
        Datum ↓
      </button>

      <button
        class="sort-btn"
        data-sort="alpha"
        title="Alphabetisch sortieren">
        A–Z
      </button>
    </div>

    <div class="search-input-wrapper">
      <input
        type="text"
        placeholder="Suchtext eingeben …"
        aria-label="News durchsuchen"
      />
      <button
        class="clear-search"
        aria-label="Suche leeren"
        title="Suche leeren">
        ✕
      </button>
    </div>

  </div>

  <!-- News List -->
  <ul class="news-list"></ul>

  <!-- Lazy Loading Indicator -->
  <div class="news-loader">
    Weitere Einträge werden geladen …
  </div>

</section>
`;
