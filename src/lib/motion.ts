/**
 * FlowForge AI — Centralized Motion System & Animation Constants
 */

// Custom Easing Curves
export const EASINGS = {
  blueprintEase: [0.23, 1, 0.32, 1] as const, // Smooth technical deceleration
  compileSpring: { type: "spring", stiffness: 350, damping: 28, mass: 0.8 },
  nodeEntranceSpring: { type: "spring", stiffness: 400, damping: 30 },
  cursorSpring: { stiffness: 500, damping: 45, mass: 0.5 },
  smoothInOut: [0.65, 0, 0.35, 1] as const,
};

// Animation Durations (Seconds)
export const DURATIONS = {
  fast: 0.2,
  medium: 0.4,
  slow: 0.8,
  heroSequence: {
    canvasFade: 0.6,
    promptTypewriter: 1.2,
    decryptParse: 0.4,
    nodeDraw: 1.2,
    headlineResolve: 0.6,
  },
};

// Decrypt Scramble Characters
export const DECRYPT_CHARACTERS = "010101#@$%&*!=+~/<>FLOWFORGE_AST_SCHEMATIC_COMPILE_2026";

/**
 * Helper to check reduced motion preference in browser environments
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
