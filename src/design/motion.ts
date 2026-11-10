import type { TargetAndTransition } from 'motion/react'

/** Shared, deliberately quiet motion. Staged moments run once; controls stay immediate. */
export const ease = [0.22, 1, 0.36, 1] as const
export const motionTiming = { screen: 0.32, reduced: 0.1, press: 0.15, reveal: 0.8 } as const
export const revealTiming = { delay: 0.2, stagger: 0.5, ready: 3000 } as const
export const calmSpring = { type: 'spring', duration: 0.3, bounce: 0 } as const
/** Press feedback: buttons compress slightly, wide answer cards barely. */
export const press = { button: 0.97, card: 0.985 } as const
/** A short, damped horizontal nudge for a wrong answer — noticeable, not alarming. */
export const wrongNudge: TargetAndTransition = { x: [0, -5, 4, -2, 0], transition: { duration: 0.36, ease: 'easeOut' } }
export const storyTiming = {
  finalAnswer: 1100,
  keyReady: 1900,
  decrypt: 3000,
} as const
