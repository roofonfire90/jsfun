const modal = document.querySelector("#hero-modal");
const backdrop = modal.querySelector(".modal-backdrop");
const closeBtn = modal.querySelector(".modal-close");
const titleEl = modal.querySelector(".modal-title");
const contentEl = modal.querySelector(".modal-content");

/**
 * Statische Inhalte pro Slide.
 * Später problemlos austauschbar (HTML, Fetch, Components).
 */
const modalContentMap = {
  analysis: {
    title: "Analyse",
    content: `
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Analysefunktionen zur strukturierten Auswertung von Marktdaten.
      </p>
    `,
  },
  comparison: {
    title: "Vergleich",
    content: `
      <p>
        Lorem ipsum dolor sit amet.
        Vergleich von Bitcoin und MSCI World über Zeit.
      </p>
    `,
  },
  insights: {
    title: "Insights",
    content: `
      <p>
        Lorem ipsum dolor sit amet.
        Zusammenfassende Erkenntnisse und Interpretation.
      </p>
    `,
  },
};

/**
 * Öffnet das Modal für den angegebenen Content.
 *
 * @param {string} contentId
 * @param {Function} onClose Callback nach dem Schließen
 */
export const openHeroModal = (contentId, onClose) => {
  const entry = modalContentMap[contentId];
  if (!entry) return;

  titleEl.textContent = entry.title;
  contentEl.innerHTML = entry.content;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const close = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    backdrop.removeEventListener("click", close);
    closeBtn.removeEventListener("click", close);
    if (onClose) onClose();
  };

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
};
