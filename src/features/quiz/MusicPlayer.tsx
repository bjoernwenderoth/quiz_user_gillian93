import { useEffect, useState } from 'react'
import { Music2, Volume2, VolumeX } from 'lucide-react'
import { getTrack } from './finaleMedia'

/**
 * Sound control for the reveal and tickets. The Berlin lebt 3 soundtrack normally already runs
 * (taken over from the trailer). After a reload it can only start through this button.
 */
export function MusicPlayer() {
  const [playing, setPlaying] = useState(() => !getTrack().paused)
  const [muted, setMuted] = useState(() => getTrack().muted)
  useEffect(() => {
    const track = getTrack()
    const sync = () => { setPlaying(!track.paused); setMuted(track.muted) }
    for (const name of ['play', 'pause', 'volumechange']) track.addEventListener(name, sync)
    return () => { for (const name of ['play', 'pause', 'volumechange']) track.removeEventListener(name, sync) }
  }, [])
  if (!playing) return <button type="button" className="sound-toggle" onClick={() => { const track = getTrack(); track.muted = false; void track.play().catch(() => undefined) }}><Music2 size={15} />Musik starten</button>
  return <button type="button" className="sound-toggle" onClick={() => { const track = getTrack(); track.muted = !track.muted }} aria-pressed={!muted}>
    {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}{muted ? 'Ton an' : 'Ton aus'}
  </button>
}
