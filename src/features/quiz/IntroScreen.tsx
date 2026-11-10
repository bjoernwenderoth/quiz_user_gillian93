import { ArrowRight, Check, KeyRound } from 'lucide-react'
import { AnimatedButton, ScreenTransition } from '../../components/ui'

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return <ScreenTransition className="story-screen intro-screen">
    <div className="story-symbol"><KeyRound size={30} /></div>
    <h1>DU WURDEST<br /><span className="gold">AUSGEWÄHLT.</span></h1>
    <p className="story-lead">Zehn Fragen. Ein verborgenes Ziel.</p>
    <p className="story-copy">Beweise dein Wissen und entschlüssele PROJECT X.<br />Nimm dir Zeit. Jeder richtige Gedanke bringt dich näher.</p>
    <div className="mission-facts"><span><Check size={15} />10 Fragen</span><span><Check size={15} />Kein Zeitlimit</span><span><Check size={15} />Dein Geheimnis</span></div>
    <AnimatedButton onClick={onStart}>CHALLENGE STARTEN <ArrowRight size={17} /></AnimatedButton>
  </ScreenTransition>
}

