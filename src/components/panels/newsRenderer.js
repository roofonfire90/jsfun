function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export function renderNewsList(listEl, items) {
  listEl.innerHTML = "";

  items.forEach(item => {
    const dateLabel = formatDate(item.pubDate);

    const li = document.createElement("li");
    li.className = "news-item";

    // Datum maschinenlesbar ablegen (für spätere Filter)
    if (item.pubDate) {
      li.dataset.date = item.pubDate;
    }

    li.innerHTML = `
      <button class="news-title">

        <span class="news-thumb">
          <span class="news-thumb-placeholder"></span>
        </span>

        <span class="news-title-main">
          <span class="news-title-text">
            ${item.title}
          </span>

          <span class="news-date">
            ${dateLabel}
          </span>
        </span>

      </button>

      <div class="news-content">
        <p>${item.description || ""}</p>
        ${
          item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener">
                 Quelle öffnen
               </a>`
            : ""
        }
      </div>
    `;

    listEl.appendChild(li);
  });
}
