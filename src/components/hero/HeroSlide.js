/**
 * Initialisiert die Slide-Icons.
 *
 * @param {Function} onClick Callback mit contentId
 */
export const initHeroSlides = (onClick) => {
  document.querySelectorAll(".hero-icon").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contentId = btn.dataset.slide;
      if (contentId && onClick) {
        onClick(contentId);
      }
    });
  });
};
