import { Transition, Variants } from 'framer-motion';

/**
 * Reusable Motion System
 * Inspired by Apple, Arc Browser, Linear, Figma, and Raycast.
 *
 * Principles:
 * 1. Physical groundings: Critically-damped springs with ZERO overshoot/bouncing.
 * 2. Meaningful motion: Every animation communicates a concrete state change.
 * 3. Never decorate or distract: Restrained micro-displacements (2-6px) and subtle opacity ramps.
 * 4. Full accessibility: Complete adherence to `prefers-reduced-motion`.
 */

// ==========================================
// 1. SPRING PHYSICS PRESETS (Zero Bouncing)
// ==========================================
export const springs = {
  /**
   * Fast, crisp, critically damped spring for micro-interactions:
   * button presses, toggle clicks, icon state changes.
   */
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 32,
    mass: 0.8,
  } as Transition,

  /**
   * Smooth, fluid spring for floating elements:
   * modals, dropdown menus, flyout popovers, toasts.
   */
  smooth: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.9,
  } as Transition,

  /**
   * Quiet, soft spring for larger layout changes and page entries.
   */
  gentle: {
    type: 'spring',
    stiffness: 220,
    damping: 28,
    mass: 1.0,
  } as Transition,

  /**
   * Sliding pill indicator for navigation and segmented controls (like macOS / Raycast).
   */
  pill: {
    type: 'spring',
    stiffness: 380,
    damping: 34,
    mass: 0.85,
  } as Transition,

  /**
   * Language swap rotation spring (180deg flip with clean deceleration).
   */
  swap: {
    type: 'spring',
    stiffness: 320,
    damping: 28,
    mass: 0.9,
  } as Transition,

  /**
   * 140ms Sidebar spring for navigation items (sliding pill & item translate).
   */
  sidebar: {
    type: 'spring',
    stiffness: 450,
    damping: 34,
    mass: 0.65,
  } as Transition,
};

// ==========================================
// 2. EASING CURVES & TIMED TRANSITIONS
// ==========================================
export const easings = {
  // Apple standard deceleration curve
  apple: [0.16, 1, 0.3, 1] as const,
  standard: [0.2, 0, 0, 1] as const,
};

export const transitions = {
  fade: {
    duration: 0.16,
    ease: easings.apple,
  } as Transition,

  fadeQuick: {
    duration: 0.12,
    ease: easings.apple,
  } as Transition,

  instant: {
    duration: 0.001,
  } as Transition,
};

// ==========================================
// 3. SHARED ANIMATION VARIANTS
// ==========================================

/**
 * Premium Page route transition:
 * Seamless handoff with Fade, Slide (translateY 12px → 0), Scale (1 → 0.99 on exit),
 * and very subtle blur (blur(2px) → blur(0px)) timed at 180–240ms.
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 1,
    filter: 'blur(2px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.22, // 220ms (within 180–240ms)
      ease: [0.16, 1, 0.3, 1], // Apple/Linear spring easing curve
    },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    filter: 'blur(1.5px)',
    transition: {
      duration: 0.19, // 190ms (within 180–240ms)
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Modal backdrop: clean opacity wash without scale distortion.
 */
export const modalBackdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.fade,
  },
  exit: {
    opacity: 0,
    transition: transitions.fadeQuick,
  },
};

/**
 * Modal panel: subtle elevation rise from 6px and 0.98 scale (Linear / Figma sheet style).
 */
export const modalPanelVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: transitions.fadeQuick,
  },
};

/**
 * Dropdown list: unfolds gracefully from origin top with micro translation.
 */
export const dropdownMenuVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transformOrigin: 'top left',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -3,
    transition: transitions.fadeQuick,
  },
};

/**
 * Toast / HUD notification: slides up subtly and glides away.
 */
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    transition: transitions.fadeQuick,
  },
};

/**
 * Staggered container for card feeds (speech cards, session records).
 */
export const staggerFeedVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/**
 * Single card entry (turns, messages, session history item).
 */
export const cardEntryVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.fadeQuick,
  },
};

/**
 * Subdued fade without positional displacement (useful for inline chips, text state changes).
 */
export const quietFadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.fade,
  },
  exit: {
    opacity: 0,
    transition: transitions.fadeQuick,
  },
};

// ==========================================
// 4. MICRO-INTERACTION PRESETS
// ==========================================

export const microInteractions = {
  /**
   * Tactile button compression (Apple iOS / macOS HIG style).
   */
  buttonTap: {
    scale: 0.985,
    transition: springs.snappy,
  },

  /**
   * Subtle icon button tap.
   */
  iconTap: {
    scale: 0.94,
    transition: springs.snappy,
  },

  /**
   * Quiet hover elevation (1-2px, no loud jumping).
   */
  cardHover: {
    y: -2,
    transition: springs.snappy,
  },
};

// ==========================================
// 5. PREFERS-REDUCED-MOTION SUPPORT
// ==========================================

/**
 * Strips positional and scaling transforms if the user prefers reduced motion,
 * preserving clean, instantaneous or minimal opacity transitions.
 */
export function getMotionSafeVariants<T extends Variants>(variants: T, shouldReduceMotion: boolean): T {
  if (!shouldReduceMotion) return variants;

  const safe: Record<string, any> = {};

  for (const [key, val] of Object.entries(variants)) {
    if (typeof val === 'object' && val !== null) {
      safe[key] = {
        opacity: (val as any).opacity !== undefined ? (val as any).opacity : 1,
        filter: 'none',
        transition: transitions.instant,
      };
    } else {
      safe[key] = val;
    }
  }

  return safe as T;
}
