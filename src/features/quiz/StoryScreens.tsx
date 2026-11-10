import { useEffect, useState } from 'react'
import { Check, ArrowRight, Fingerprint, LockKeyhole } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { AnimatedButton, ScreenTransition } from '../../components/ui'
import { ease, storyTiming } from '../../design/motion'

const identitySteps = ['Identität wird überprüft …', 'Teilnehmerprofil gefunden', 'Zugriffsrechte bestätigt', 'Willkommen, Gillian.']

export function IdentityScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    const timers = [1, 2, 3].map((next) => window.setTimeout(() => setStep(next), next * (reduced ? 350 : 850)))
    const done = window.setTimeout(onComplete, reduced ? 1800 : 3800)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [onComplete, reduced])
  return <ScreenTransition className="story-screen identity-screen">
    <div className="story-symbol scan-symbol"><Fingerprint size={42} /></div>
    <h1>IDENTITY CHECK</h1>
    <div className="identity-steps" role="status" aria-live="polite" aria-atomic="true">{identitySteps.slice(0, step + 1).map((text, index) => <p className={index === step ? 'current' : ''} key={text}><Check size={16} />{text}</p>)}</div>
  </ScreenTransition>
}

export function HalfwayScreen({ onContinue }: { onContinue: () => void }) {
  return <ScreenTransition className="story-screen halfway-screen">
    <div className="halfway-mark" aria-hidden="true"><span /><span /><span /><span /><span /><i /><i /><i /><i /><i /></div>
    <h1><span className="gold">50 %</span><br />FREIGESCHALTET</h1>
    <p className="story-lead">Du bist näher dran, als du denkst.</p>
    <p className="story-copy">Fünf Schlüssel gefunden. Fünf warten noch auf dich.</p>
    <AnimatedButton onClick={onContinue}>FORTSETZEN <ArrowRight size={17} /></AnimatedButton>
  </ScreenTransition>
}

export function CompletionScreen({ onUnlock }: { onUnlock: () => void }) {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const accepted = window.setTimeout(() => setStage(1), reduced ? 200 : storyTiming.keyAccepted)
    const ready = window.setTimeout(() => setStage(2), reduced ? 400 : storyTiming.keyReady)
    return () => { clearTimeout(accepted); clearTimeout(ready) }
  }, [reduced])
  return <ScreenTransition className="story-screen completion-screen">
    <div className="key-line" aria-hidden="true" />
    <motion.h1 initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.1 : 0.9, ease }}>BERLIN<br /><span className="gold">LEBT.</span></motion.h1>
    <div className="key-confirmation" role="status" aria-live="polite">
      <motion.p className="accepted-key" initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 1 : 0 }}><Check size={15} />{stage >= 1 ? 'LETZTER SCHLÜSSEL AKZEPTIERT' : ''}</motion.p>
    </div>
    <motion.div className="unlock-content" initial={{ opacity: 0 }} animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ duration: reduced ? 0.1 : 0.5 }}>
      <p className="completion-count">10 / 10 Level abgeschlossen</p>
      <p className="story-copy">Du hast alle Schlüssel gefunden.</p>
      <AnimatedButton disabled={stage < 2} onClick={onUnlock}>GEWINN FREISCHALTEN <ArrowRight size={17} /></AnimatedButton>
    </motion.div>
  </ScreenTransition>
}

export function DecryptScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduced ? 800 : storyTiming.decrypt)
    return () => clearTimeout(timer)
  }, [onComplete, reduced])
  return <ScreenTransition className="story-screen decrypt-screen">
    <motion.div className="decrypt-pulse" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: reduced ? 0.4 : [0, 0.7, 0.2] }} transition={{ duration: reduced ? 0.1 : 2.6 }} /><div className="story-symbol"><LockKeyhole size={32} /></div>
    <h1>DEIN GEWINN<br /><span className="gold">WIRD ENTSCHLÜSSELT.</span></h1>
    <p className="story-lead" role="status">Einen Moment noch.</p>
    <div className="decrypt-track" aria-hidden="true"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0.1 : 2.5, ease }} /></div>
  </ScreenTransition>
}

