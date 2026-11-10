import { useCallback, useRef, type PointerEvent } from 'react'

/** The heartbeat line from the Berlin lebt logo: flat, three beats, flat. viewBox 0 0 1000 200. */
export const ekgPath = 'M0 100 L290 100 L305 100 L315 84 L325 100 L338 100 L350 34 L364 168 L376 100 L520 100 L532 100 L542 84 L552 100 L564 100 L576 30 L590 172 L602 100 L742 100 L754 100 L764 80 L774 100 L786 100 L800 14 L816 188 L830 100 L1000 100'

/**
 * Pointer/touch tilt for 3D cards. Writes CSS variables only (no React re-renders):
 * --rx/--ry rotate the card, --mx/--my move the light sheen.
 * Horizontal drags tilt; vertical scrolling stays available (touch-action: pan-y in CSS).
 */
export function useTilt(max = 9, disabled = false) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const apply = useCallback((rx: number, ry: number, mx: number, my: number) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const node = ref.current
      if (!node) return
      node.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
      node.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
      node.style.setProperty('--mx', `${(mx * 100).toFixed(1)}%`)
      node.style.setProperty('--my', `${(my * 100).toFixed(1)}%`)
    })
  }, [])
  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    const x = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1)
    const y = Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1)
    apply((0.5 - y) * max * 2, (x - 0.5) * max * 2, x, y)
  }, [apply, disabled, max])
  const onPointerLeave = useCallback(() => apply(0, 0, 0.5, 0.3), [apply])
  return { ref, onPointerMove, onPointerLeave, onPointerCancel: onPointerLeave, onPointerUp: onPointerLeave }
}
