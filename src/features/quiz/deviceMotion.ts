/**
 * Device tilt for the 3D cards on phones. iOS only delivers orientation events after
 * DeviceOrientationEvent.requestPermission() was called inside a user tap; Android and others
 * deliver them without asking. The request runs in the login tap (see LoginScreen).
 */
type PermissionApi = { requestPermission?: () => Promise<'granted' | 'denied'> }

export function requestMotionPermission() {
  try {
    const api = (globalThis as { DeviceOrientationEvent?: PermissionApi }).DeviceOrientationEvent
    // Must be called synchronously in the tap; the answer arrives later and is not needed here.
    if (typeof api?.requestPermission === 'function') void api.requestPermission().catch(() => undefined)
  } catch { /* Not available: cards still tilt by touch. */ }
}

/**
 * Subscribes to device orientation and reports the tilt relative to how the phone is held.
 * The neutral position follows slowly, so a changed posture re-centres itself.
 * Returns an unsubscribe function.
 */
export function watchDeviceTilt(onTilt: (x: number, y: number) => void) {
  let neutral: { a: number; b: number } | null = null
  const handle = (event: DeviceOrientationEvent) => {
    if (event.beta == null || event.gamma == null) return
    const angle = screen.orientation?.angle ?? 0
    // In landscape the axes swap.
    const a = angle === 90 ? -event.gamma : angle === 270 || angle === -90 ? event.gamma : event.beta
    const b = angle === 90 ? event.beta : angle === 270 || angle === -90 ? -event.beta : event.gamma
    if (!neutral) neutral = { a, b }
    neutral.a += (a - neutral.a) * 0.015
    neutral.b += (b - neutral.b) * 0.015
    // ±20° of tilt covers the full effect; values are -1..1.
    const clamp = (value: number) => Math.max(-1, Math.min(1, value / 20))
    onTilt(clamp(b - neutral.b), clamp(a - neutral.a))
  }
  window.addEventListener('deviceorientation', handle)
  return () => window.removeEventListener('deviceorientation', handle)
}
