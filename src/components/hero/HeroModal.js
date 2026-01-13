let modal = null;
let backdrop = null;
let closeBtn = null;
let titleEl = null;
let contentEl = null;

const modalContentMap = {
  analysis: {
    title: "Analyse",
    content: `
      <p>
        Analysefunktionen zur strukturierten Auswertung von Marktdaten.
      </p>
    `,
  },
  news: {
    title: "News",
    content: `
      <p>
        Aktuelle Krypto-News und Marktbewegungen.
      </p>
    `,
  },
  about: {
    title: "About",
    content: `
      <p>
        Informationen über dieses Projekt.
      </p>
    `,
  },
};

/**
 * Initialisiert das Modal lazy.
 * Gibt false zurück, wenn es nicht existiert.
 */
const ensureModal = () => {
  if (modal) return true;

  modal = document.querySelector("#hero-modal");
  if (!modal) return false;

  backdrop  = modal.querySelector(".modal-backdrop");
  closeBtn  = modal.querySelector(".modal-close");
  titleEl   = modal.querySelector(".modal-title");
  contentEl = modal.querySelector(".modal-content");

  return !!(backdrop && closeBtn && titleEl && contentEl);
};

/**
 * Öffnet das Hero-Modal, falls vorhanden.
 */
export const openHeroModal = (contentId, onClose) => {
  if (!ensureModal()) return;

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
