import type { Variants } from 'motion/react';

export const EASING = [0.16, 1, 0.3, 1] as const; // Smooth Deceleration (Power4 Out)

export const slideTransition = {
  duration: 1.2,
  ease: EASING,
};

export const bgVariants: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 1.5, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.8, ease: 'easeIn' } 
  }
};

export const slideMotionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.75, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    scale: 1.01, 
    transition: { duration: 0.4, ease: 'easeIn' } 
  }
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.18,
      delayChildren: 0.25
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const titleRevealVariants: Variants = {
  hidden: { 
    y: 28,
    opacity: 0 
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { duration: 0.95, ease: EASING } 
  }
};

export const itemFadeUpVariants: Variants = {
  hidden: { y: 22, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.75, ease: EASING } 
  }
};

export const pointSlideInVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: EASING } 
  }
};

export const imageEntranceVariants: Variants = {
  hidden: { x: 50, opacity: 0, scale: 0.88 },
  visible: { 
    x: 0, 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.05, delay: 0.3, ease: EASING } 
  }
};

export const floatVariants: Variants = {
  animate: {
    y: [-6, 6, -6],
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};
