let dots = [];

/**
 * Initialisiert die Navigation Dots.
 *
 * @param {Function} onSelect Callback mit Index
 */
export const initHeroDots = (onSelect) => {
  dots = Array.from(document.querySelectorAll(".hero-dots .dot"));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (onSelect) onSelect(index);
    });
  });
};

/**
 * Setzt den aktiven Dot.
 *
 * @param {number} index
 */
export const setActiveDot = (index) => {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
};
