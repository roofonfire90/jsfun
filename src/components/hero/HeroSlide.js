/* Initialisiert die Slide-Icons.
 *
 * @param {Function} onClick Callback mit contentId
 */
export const initHeroSlides = (onClick) => {
  document.querySelectorAll(".hero-icon").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slideEl = btn.closest(".hero-slide");
      if (!slideEl) return;

      const contentId = slideEl.dataset.slide;
      if (contentId && onClick) {
        onClick(contentId);
      }
    });
  });
};

