import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { AnimatedButton, ScreenTransition } from '../../components/ui'
import { assetUrl, gift } from './content'
import { ease, motionTiming, revealTiming } from '../../design/motion'

export function ResultScreen({ onTickets }: { onTickets: () => void }) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  // Essential navigation must also unlock when the browser suppresses animations.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), reduced ? 100 : revealTiming.ready)
    return () => clearTimeout(timer)
  }, [reduced])
  const arrival: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.1 : motionTiming.reveal, ease } },
  }
  return <ScreenTransition className="reveal-screen">
    <motion.div className="reveal-light" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: reduced ? 0.2 : [0, 0.6, 0.2] }} transition={{ duration: reduced ? 0.1 : 2.5 }} />
    <motion.div className="reveal-content" initial="hidden" animate="visible" transition={{ delayChildren: reduced ? 0 : revealTiming.delay, staggerChildren: reduced ? 0 : revealTiming.stagger }}>
      <motion.div className="concert-art" aria-hidden="true" variants={arrival}>
        <img src={assetUrl('images/questions/city.jpg')} alt="" width="1200" height="900" />
        <div className="concert-art-shade" />
        <span className="concert-three">3</span>
        <div className="concert-art-title"><span>BERLIN</span><span>LEBT.</span></div>
        <div className="concert-art-bottom"><span>SAMRA & CAPITAL BRA</span><span>HAMBURG · 2027</span></div>
      </motion.div>
      <motion.div className="reveal-heading" variants={arrival}>
        <h1>HAPPY BIRTHDAY,<br /><span className="gold">GILLIAN!</span></h1>
        <p className="reveal-won">DU HAST GEWONNEN!</p>
        <p className="reveal-count">2 KONZERTTICKETS</p>
      </motion.div>
      <motion.div className="reveal-event" variants={arrival}>
        <h2>SAMRA <span>&</span><br />CAPITAL BRA</h2>
        <p className="reveal-tour">BERLIN LEBT 3</p>
        <div className="reveal-details"><p><CalendarDays size={17} /><span>{gift.date}</span></p><p><MapPin size={17} /><span>{gift.venue.toUpperCase()}</span></p></div>
      </motion.div>
      <motion.div className="personal-message" variants={arrival}>
        <p>Die echten Tickets sind leider noch nicht rechtzeitig gelandet – typisch VIP-Status mit etwas Verspätung. 😄</p>
        <p><strong>Aber eins ist sicher: Du bist dabei!</strong></p>
        <p>{gift.message}</p>
      </motion.div>
      <motion.div className="reveal-action" variants={arrival}><AnimatedButton disabled={!ready} onClick={onTickets}>DEINE GESCHENKTICKETS <ArrowRight size={17} /></AnimatedButton></motion.div>
    </motion.div>
  </ScreenTransition>
}
