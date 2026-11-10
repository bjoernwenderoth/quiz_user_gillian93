import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, Play, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { ScreenTransition } from '../../components/ui'
import { ekgSweepPath, pulseTimeline } from './berlin'
import { finaleMedia, getHeartbeat, getTrack, getTrailer } from './finaleMedia'

type Phase = 'pulse' | 'glitch' | 'trailer' | 'handoff'

/** Phase durations (ms). The pulse follows `pulseTimeline` in berlin.ts. */
const timing = { pulse: pulseTimeline.sweep * 1000, glitch: pulseTimeline.glitch * 1000, handoff: 900, reducedPulse: 900 }
const caption = 'DEIN GEWINN WIRD ENTSCHLÜSSELT.'
const noise = '!<>-_/\\[]{}=+*^?#01%&'

/**
 * The switch from quiz to gift: flatline → four heartbeats, faster and harder, the signal breaking up
 * from the third beat → full glitch into the black/red Berlin lebt world → the trailer flies in as a 3D screen. At `finaleMedia.cut` (or on skip) the MP3 takes over
 * at the same position and the reveal follows.
 */
export function FinaleSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('pulse')
  useEffect(() => {
    if (phase === 'pulse') {
      const timer = window.setTimeout(() => setPhase(reduced ? 'trailer' : 'glitch'), reduced ? timing.reducedPulse : timing.pulse)
      return () => clearTimeout(timer)
    }
    if (phase === 'glitch') {
      const timer = window.setTimeout(() => setPhase('trailer'), timing.glitch)
      return () => clearTimeout(timer)
    }
    if (phase === 'handoff') {
      const timer = window.setTimeout(onComplete, reduced ? 200 : timing.handoff)
      return () => clearTimeout(timer)
    }
  }, [phase, reduced, onComplete])
  // The heartbeat file is cut to `pulseTimeline` (four beats, stutter on 3 and 4, impact when the glitch starts).
  useEffect(() => {
    if (reduced) return
    const sound = getHeartbeat()
    sound.currentTime = 0
    void sound.play().catch(() => undefined)
    return () => sound.pause()
  }, [reduced])
  const handOff = useCallback(() => setPhase('handoff'), [])

  // The stage is portalled to <body>: the screen transition transforms its section, which would trap position: fixed.
  return <ScreenTransition className="finale-screen">
    <h1 className="sr-only">DEIN GEWINN WIRD ENTSCHLÜSSELT.</h1>
    {createPortal(<div className={`finale-stage phase-${phase}`}>
      {(phase === 'pulse' || phase === 'glitch') && <Heartbeat reduced={!!reduced} glitch={phase === 'glitch'} />}
      {(phase === 'trailer' || phase === 'handoff') && <TrailerStage reduced={!!reduced} leaving={phase === 'handoff'} onDone={handOff} />}
      {phase === 'handoff' && <motion.div className="finale-flash" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: reduced ? 0.2 : 0.9, times: [0, 0.35, 1] }} />}
    </div>, document.body)}
  </ScreenTransition>
}

function Heartbeat({ reduced, glitch }: { reduced: boolean; glitch: boolean }) {
  const [beat, setBeat] = useState(-1)
  const [burst, setBurst] = useState(0)
  useEffect(() => {
    if (reduced) return
    const timers = pulseTimeline.beats.flatMap((entry, index) => {
      const at = entry.t * 1000
      const list = [window.setTimeout(() => { setBeat(index); if (entry.glitch) setBurst(entry.glitch) }, at)]
      if (entry.glitch) list.push(window.setTimeout(() => setBurst(0), at + (entry.glitch === 1 ? 260 : 560)))
      return list
    })
    return () => timers.forEach(clearTimeout)
  }, [reduced])
  const amp = beat >= 0 ? pulseTimeline.beats[beat]!.amp : 0
  const state = glitch ? 'is-glitching' : burst ? `glitch-burst-${burst}` : ''
  return <div className={`heartbeat ${state}`} aria-hidden="true">
    <div className="heartbeat-ambient" style={{ opacity: Math.min((beat + 1) * 0.22, 1) }} />
    {beat >= 0 && <motion.div key={beat} className="heartbeat-flash" initial={{ opacity: amp * 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} />}
    <ScrambleText className="finale-title" text={caption} active={glitch || burst === 2} />
    <motion.div className="heartbeat-monitor" animate={beat >= 0 && !reduced ? { scale: [1 + amp * 0.07, 1] } : { scale: 1 }} transition={{ duration: 0.45, ease: [0.2, 0.9, 0.3, 1] }}>
      <motion.div className="heartbeat-sweep" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: reduced ? 0.6 : pulseTimeline.sweep, ease: 'linear' }}>
        {['red', 'cyan', 'main'].map((layer) => <svg key={layer} className={`heartbeat-line layer-${layer}`} viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d={ekgSweepPath} />
        </svg>)}
      </motion.div>
    </motion.div>
    <p className="heartbeat-caption">Einen Moment noch.</p>
    {(glitch || burst === 2) && <div className="glitch-slices"><span /><span /><span /><span /></div>}
  </div>
}

/** While active, characters flicker into noise; it settles back to the real text when inactive. */
function ScrambleText({ text, active, className }: { text: string; active: boolean; className: string }) {
  const [shown, setShown] = useState(text)
  useEffect(() => {
    if (!active) { const reset = window.setTimeout(() => setShown(text), 0); return () => clearTimeout(reset) }
    const timer = window.setInterval(() => {
      setShown(text.split('').map((char) => char !== ' ' && Math.random() < 0.38 ? noise[Math.floor(Math.random() * noise.length)] : char).join(''))
    }, 55)
    return () => clearInterval(timer)
  }, [active, text])
  return <p className={className}>{shown}</p>
}

function TrailerStage({ reduced, leaving, onDone }: { reduced: boolean; leaving: boolean; onDone: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLSpanElement>(null)
  const finished = useRef(false)
  const [muted, setMuted] = useState(false)
  const [buffering, setBuffering] = useState(true)
  const [needsTap, setNeedsTap] = useState(false)

  // The MP3 is the same soundtrack: it takes over at exactly this position. The picture keeps running
  // muted while the screen zooms out, so the step towards the camera carries into the reveal.
  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    const video = getTrailer()
    const track = getTrack()
    try { track.currentTime = video.currentTime || 0 } catch { /* not loaded yet */ }
    track.muted = video.muted
    void track.play().catch(() => undefined)
    video.muted = true
    const doc = document as Document & { webkitFullscreenElement?: Element }
    if (document.fullscreenElement || doc.webkitFullscreenElement) void document.exitFullscreen?.().catch(() => undefined)
    const legacy = video as HTMLVideoElement & { webkitExitFullscreen?: () => void }
    try { legacy.webkitExitFullscreen?.() } catch { /* not in native fullscreen */ }
    onDone()
  }, [onDone])

  useEffect(() => {
    const video = getTrailer()
    host.current?.append(video)
    const onTime = () => {
      const share = Math.min(video.currentTime / finaleMedia.cut, 1)
      if (progress.current) progress.current.style.transform = `scaleX(${share})`
      if (video.currentTime >= finaleMedia.cut) finish()
    }
    const onPlaying = () => { setBuffering(false); setNeedsTap(false) }
    const onWaiting = () => setBuffering(true)
    const onVolume = () => setMuted(video.muted)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('volumechange', onVolume)
    video.addEventListener('ended', finish)
    video.addEventListener('error', finish)
    if (video.error) finish()
    else {
      video.muted = false
      // Sound was unlocked by the unlock click. If a browser still refuses, start muted with a visible sound button.
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => setNeedsTap(true))
      })
    }
    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('volumechange', onVolume)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      video.pause()
      video.remove()
    }
  }, [finish])

  function toggleSound() { const video = getTrailer(); video.muted = !video.muted }
  function fullscreen() {
    const video = getTrailer() as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    if (video.requestFullscreen) void video.requestFullscreen().catch(() => video.webkitEnterFullscreen?.())
    else video.webkitEnterFullscreen?.()
  }
  function tapToPlay() { const video = getTrailer(); video.muted = false; void video.play().catch(() => undefined) }

  return <motion.div className="trailer-stage"
    initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: 32, y: 80, z: -500, scale: 0.7 }}
    animate={leaving ? { opacity: 0, scale: reduced ? 1 : 1.22 } : { opacity: 1, rotateX: 0, y: 0, z: 0, scale: 1 }}
    transition={leaving ? { duration: reduced ? 0.15 : 0.8, ease: [0.5, 0, 0.9, 0.6] } : { duration: reduced ? 0.2 : 1.3, ease: [0.16, 1, 0.3, 1] }}>
    <div className="trailer-glow" aria-hidden="true" />
    <div className="trailer-frame">
      <div className="trailer-host" ref={host} />
      {buffering && !needsTap && <span className="trailer-loading" role="status">Lädt …</span>}
      {needsTap && <button type="button" className="trailer-play" onClick={tapToPlay}><Play size={30} /><span>Trailer abspielen</span></button>}
      <div className="trailer-progress" aria-hidden="true"><span ref={progress} /></div>
    </div>
    <div className="trailer-controls">
      <button type="button" className="trailer-button" onClick={toggleSound} aria-pressed={!muted}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}<span>{muted ? 'Ton an' : 'Ton aus'}</span></button>
      <button type="button" className="trailer-button" onClick={fullscreen}><Maximize2 size={16} /><span>Vollbild</span></button>
      <button type="button" className="trailer-button is-skip" onClick={finish} aria-label="Trailer überspringen"><span>Überspringen</span><SkipForward size={16} /></button>
    </div>
    <p className="trailer-hint">Tipp: Dreh dein Handy für das volle Bild.</p>
  </motion.div>
}
