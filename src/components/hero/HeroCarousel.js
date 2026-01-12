import { initHeroSlides } from "./HeroSlide.js";
import { initHeroDots, setActiveDot } from "./HeroDots.js";
import { openHeroModal } from "./HeroModal.js";

/**
 * Initialisiert das Hero-Carousel.
 *
 * - Auto-Slide (infinite)
 * - Pause bei Hover
 * - Timer-Reset bei Dot-Klick
 * - Modal-Öffnung delegiert
 */
export const initHeroCarousel = () => {
  const carousel = document.querySelector(".hero-carousel");
  const track = document.querySelector(".hero-track");
  const slides = document.querySelectorAll(".hero-slide");

  if (!carousel || !track || slides.length === 0) return;

  let currentIndex = 0;
  let intervalId = null;

  const slideCount = slides.length;
  const intervalMs = 6000;

  // ----------------------------------------------------------
  // Core helpers
  // ----------------------------------------------------------

  const updateSlide = (index) => {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    setActiveDot(index);
  };

  const nextSlide = () => {
    updateSlide((currentIndex + 1) % slideCount);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalId = setInterval(nextSlide, intervalMs);
  };

  const stopAutoSlide = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // ----------------------------------------------------------
  // Slide Icons (Modal)
  // ----------------------------------------------------------

  initHeroSlides((contentId) => {
    stopAutoSlide();
    openHeroModal(contentId, startAutoSlide);
  });

  // ----------------------------------------------------------
  // Navigation Dots (Timer reset)
  // ----------------------------------------------------------

  initHeroDots((index) => {
    updateSlide(index);
    startAutoSlide(); // Timer reset
  });

  // ----------------------------------------------------------
  // Hover Pause
  // ----------------------------------------------------------

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  // ----------------------------------------------------------
  // Initial state
  // ----------------------------------------------------------

  updateSlide(0);
  startAutoSlide();
};
