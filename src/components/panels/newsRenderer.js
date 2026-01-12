export function renderNewsList(listEl, items) {
  listEl.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "news-item";

    li.innerHTML = `
      <button class="news-title">
        ${item.title}
      </button>
      <div class="news-content">
        <p>${item.description || ""}</p>
        ${item.link ? `<a href="${item.link}" target="_blank">Quelle öffnen</a>` : ""}
      </div>
    `;

    listEl.appendChild(li);
  });
}
