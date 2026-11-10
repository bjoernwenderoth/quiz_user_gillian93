import { useState } from 'react'
import { Music2, Play, X } from 'lucide-react'
import { music } from './content'

export function MusicPlayer({ activated, onActivate }: { activated: boolean; onActivate: () => void }) {
  const [closed, setClosed] = useState(false)
  const videoId = music.youtubeVideoId
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return <p className="music-placeholder"><Music2 size={15} />Dein Moment. Auch ohne Soundtrack.</p>
  if (!activated || closed) return <button className="text-button music-start" onClick={() => { setClosed(false); onActivate() }}><Play size={16} />MUSIK STARTEN</button>
  return <aside className="music-player" aria-label="Offizieller Soundtrack">
    <div><span><Music2 size={15} />Dein Soundtrack</span><button className="text-button" onClick={() => setClosed(true)} aria-label="Musik stoppen und Player schließen"><X size={18} /></button></div>
    <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`} title="Offizieller Konzert-Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    <p>Falls die Musik stumm bleibt, starte sie direkt im Player.</p>
  </aside>
}

