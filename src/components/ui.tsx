import { forwardRef, useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { ease, motionTiming, calmSpring, press } from '../design/motion'

export const AnimatedButton = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(
  function AnimatedButton({ className = '', children, ...props }, ref) {
    const reduced = useReducedMotion()
    return <motion.button ref={ref} whileTap={reduced || props.disabled ? undefined : { scale: press.button }} transition={calmSpring} className={`primary-button ${className}`} {...props}>{children}</motion.button>
  },
)

export function ScreenTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    const heading = section.current?.querySelector('h1')
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  return <motion.section ref={section} className={className} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? motionTiming.reduced : motionTiming.screen, ease }}>{children}</motion.section>
}

export function ProgressIndicator({ completed, total }: { completed: number; total: number }) {
  const reduced = useReducedMotion()
  return <div className="progress-track" role="progressbar" aria-label="Quiz-Fortschritt" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed} aria-valuetext={`${completed} von ${total} Fragen beantwortet`}>
    <motion.div className="progress-fill" animate={{ scaleX: completed / total }} initial={false} transition={{ duration: reduced ? 0 : 0.5, ease }} />
    <div className="progress-ticks" aria-hidden="true">{Array.from({ length: total - 1 }, (_, index) => <span key={index} />)}</div>
  </div>
}
