/**
 * Shared motion preference used by every animated surface of the portfolio
 * (hero entrance, scroll reveals, the pinned project strip, Lenis and the 3D
 * character).
 *
 * Read lazily on every call so a preference changed while the page is open is
 * honoured, and so every consumer agrees on the same definition of
 * "reduced motion".
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
