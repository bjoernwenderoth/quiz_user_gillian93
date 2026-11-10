import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { watchDeviceTilt } from './deviceMotion'

/** The heartbeat line from the Berlin lebt logo: flat, three beats, flat. viewBox 0 0 1000 200. */
export const ekgPath = 'M0 100 L290 100 L305 100 L315 84 L325 100 L338 100 L350 34 L364 168 L376 100 L520 100 L532 100 L542 84 L552 100 L564 100 L576 30 L590 172 L602 100 L742 100 L754 100 L764 80 L774 100 L786 100 L800 14 L816 188 L830 100 L1000 100'

/**
 * Timeline of the heartbeat before the trailer (seconds). The beats come faster and harder; from the
 * third beat on the signal starts to break up (glitch 1 = flicker, 2 = tearing). The sweep reaches the
 * right edge exactly when the full glitch starts. scripts/heartbeat.py uses the same numbers for the sound.
 */
export const pulseTimeline = {
  sweep: 7.2,
  glitch: 1.0,
  beats: [
    { t: 1.8, amp: 0.55, glitch: 0 },
    { t: 3.6, amp: 0.7, glitch: 0 },
    { t: 5.1, amp: 0.85, glitch: 1 },
    { t: 6.3, amp: 1, glitch: 2 },
  ],
} as const

/** EKG offsets (x, y) around a beat: small P wave, then the sharp QRS spike. */
const spike = [[-46, 0], [-36, 0], [-28, -16], [-20, 0], [-8, 0], [4, -66], [18, 68], [30, 0]] as const

/** Flat line with one spike per beat; the x position equals the beat time on a linear sweep. */
export const ekgSweepPath = pulseTimeline.beats.reduce((d, beat) => {
  const x = (beat.t / pulseTimeline.sweep) * 1000
  const scale = 0.7 + beat.amp * 0.45
  return d + spike.map(([dx, dy]) => ` L${(x + dx).toFixed(1)} ${(100 + dy * scale).toFixed(1)}`).join('')
}, 'M0 100') + ' L1000 100'

/**
 * Pointer/touch tilt for 3D cards. The card eases towards the pointer frame by frame (no CSS transition
 * restarts), and only composited properties change: an inline transform on the card plus --mx/--my
 * (0–1) for light layers that move via transform. No React re-renders.
 * Horizontal drags tilt; vertical scrolling stays available (touch-action: pan-y in CSS).
 */
export function useTilt(max = 9, disabled = false) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ rx: 0, ry: 0, mx: 0.5, my: 0.3 })
  const current = useRef({ rx: 0, ry: 0, mx: 0.5, my: 0.3 })
  const frame = useRef(0)
  const last = useRef(0)
  const loop = useRef<FrameRequestCallback | null>(null)
  useEffect(() => {
    const step: FrameRequestCallback = (now) => {
      const node = ref.current
      if (!node) { frame.current = 0; return }
      const dt = Math.min(now - (last.current || now - 16), 64)
      last.current = now
      const ease = 1 - Math.exp(-dt / 90)
      const c = current.current
      const t = target.current
      let moving = false
      for (const key of ['rx', 'ry', 'mx', 'my'] as const) {
        c[key] += (t[key] - c[key]) * ease
        if (Math.abs(t[key] - c[key]) > (key.startsWith('m') ? 0.001 : 0.01)) moving = true
        else c[key] = t[key]
      }
      node.style.transform = `perspective(1100px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`
      node.style.setProperty('--mx', c.mx.toFixed(3))
      node.style.setProperty('--my', c.my.toFixed(3))
      frame.current = moving ? requestAnimationFrame(step) : 0
      if (!moving) last.current = 0
    }
    loop.current = step
    return () => cancelAnimationFrame(frame.current)
  }, [])
  const aim = useCallback((rx: number, ry: number, mx: number, my: number) => {
    target.current = { rx, ry, mx, my }
    if (!frame.current && loop.current) frame.current = requestAnimationFrame(loop.current)
  }, [])
  // Phones: tilting the device moves the card. Touch drags still work and take over while touching.
  const touching = useRef(false)
  useEffect(() => {
    if (disabled) return
    return watchDeviceTilt((x, y) => { if (!touching.current) aim(-y * max, x * max, 0.5 + x * 0.5, 0.3 + y * 0.4) })
  }, [aim, disabled, max])
  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    const x = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1)
    const y = Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1)
    if (event.pointerType === 'touch') touching.current = true
    aim((0.5 - y) * max * 2, (x - 0.5) * max * 2, x, y)
  }, [aim, disabled, max])
  const onPointerLeave = useCallback(() => { touching.current = false; if (!disabled) aim(0, 0, 0.5, 0.3) }, [aim, disabled])
  return { ref, onPointerMove, onPointerLeave, onPointerCancel: onPointerLeave, onPointerUp: onPointerLeave }
}
