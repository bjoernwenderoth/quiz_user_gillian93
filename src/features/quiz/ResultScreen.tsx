import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { AnimatedButton, ScreenTransition } from '../../components/ui'
import { gift } from './content'
import { revealTiming } from '../../design/motion'
import { EkgDivider } from './berlinUi'
import { useTilt } from './berlin'
import { finaleMedia } from './finaleMedia'

export function ResultScreen({ onTickets }: { onTickets: () => void }) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const tilt = useTilt(7, !!reduced)
  // Essential navigation must also unlock when the browser suppresses animations.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), reduced ? 100 : revealTiming.ready)
    return () => clearTimeout(timer)
  }, [reduced])
  // Lines "slam" in like the trailer titles: slightly oversized and blurred, then sharp.
  const slam: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, scale: 1.14, filter: 'blur(10px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: reduced ? 0.1 : 0.55, ease: [0.16, 1, 0.3, 1] } },
  }
  return <ScreenTransition className="reveal-screen">
    <motion.div className="reveal-content" initial="hidden" animate="visible" transition={{ delayChildren: reduced ? 0 : 0.15, staggerChildren: reduced ? 0 : 0.32 }}>
      <motion.div className="poster-scene" variants={{ hidden: reduced ? { opacity: 0 } : { opacity: 0, rotateX: 24, y: 40, scale: 0.92 }, visible: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: { duration: reduced ? 0.1 : 1.1, ease: [0.16, 1, 0.3, 1] } } }}>
        <div className="poster-card" {...tilt}>
          <img src={finaleMedia.poster} alt="Tourplakat Berlin lebt 3 mit Capital Bra und Samra" width="2048" height="904" />
          <span className="poster-sheen" aria-hidden="true" />
        </div>
      </motion.div>
      <motion.h1 variants={slam} className="slam-title">HAPPY BIRTHDAY,<br /><span className="accent">{gift.recipient.toUpperCase()}!</span></motion.h1>
      <motion.div variants={slam} className="reveal-prize">
        <p className="reveal-won">DU HAST GEWONNEN!</p>
        <p className="reveal-count">2 KONZERTTICKETS</p>
      </motion.div>
      <motion.div variants={slam} className="reveal-event">
        <EkgDivider />
        <h2>{gift.artists.toUpperCase()}</h2>
        <p className="reveal-tour">{gift.show.toUpperCase()}</p>
        <div className="reveal-details"><p><CalendarDays size={17} /><span>{gift.date}</span></p><p><MapPin size={17} /><span>{gift.venue.toUpperCase()}</span></p></div>
      </motion.div>
      <motion.div variants={slam} className="personal-message">
        <p>Die echten Tickets sind leider noch nicht rechtzeitig gelandet – typisch VIP-Status mit etwas Verspätung. 😄</p>
        <p><strong>Aber eins ist sicher: Du bist dabei!</strong></p>
        <p>{gift.message}</p>
      </motion.div>
      <motion.div variants={slam} className="reveal-action"><AnimatedButton disabled={!ready} onClick={onTickets}>DEINE GESCHENKTICKETS <ArrowRight size={17} /></AnimatedButton></motion.div>
    </motion.div>
  </ScreenTransition>
}
