/**
 * Media for the final reveal: the Berlin lebt 3 trailer, its soundtrack and the tour poster.
 *
 * Browsers only allow sound after a real user action. The elements are therefore created once and
 * "primed" synchronously inside the unlock click. Later calls to play() are then allowed, even after
 * the heartbeat intro has run (Safari/iOS bind this permission to the element).
 */
const base = import.meta.env.BASE_URL

export const finaleMedia = {
  trailer: `${base}media/berlin-lebt-3-trailer.mp4`,
  track: `${base}media/berlin-lebt-3.mp3`,
  poster: `${base}media/berlin-lebt-3.jpg`,
  /** Second at which the trailer stops and the MP3 continues at the same position (before the presale cards). */
  cut: 46,
  /** Volume of the soundtrack after the trailer. iOS ignores this value; the mute button still works. */
  trackVolume: 0.55,
} as const

let trailer: HTMLVideoElement | null = null
let track: HTMLAudioElement | null = null

export function getTrailer() {
  if (!trailer) {
    trailer = document.createElement('video')
    trailer.className = 'trailer-video'
    trailer.playsInline = true
    trailer.setAttribute('playsinline', '')
    trailer.preload = 'auto'
    trailer.src = finaleMedia.trailer
  }
  return trailer
}

export function getTrack() {
  if (!track) {
    track = new Audio(finaleMedia.track)
    track.loop = true
    track.preload = 'auto'
    track.volume = finaleMedia.trackVolume
  }
  return track
}

/** Call synchronously inside the unlock click handler. */
export function primeFinaleMedia() {
  for (const element of [getTrailer(), getTrack()]) {
    try {
      const pending = element.play()
      element.pause()
      element.currentTime = 0
      void pending?.catch(() => undefined)
    } catch { /* Playback unavailable: the reveal works without media. */ }
  }
}

export function stopFinaleMedia() {
  trailer?.pause()
  if (track) { track.pause(); track.currentTime = 0 }
}
