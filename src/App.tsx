import { useCallback } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowUpRight, HelpCircle, LockKeyhole } from 'lucide-react'
import { IntroScreen } from './features/quiz/IntroScreen'
import { LoginScreen } from './features/quiz/LoginScreen'
import { QuestionScreen } from './features/quiz/QuestionScreen'
import { ResultScreen } from './features/quiz/ResultScreen'
import { TicketScreen } from './features/quiz/TicketScreen'
import { MusicPlayer } from './features/quiz/MusicPlayer'
import { CompletionScreen, HalfwayScreen, IdentityScreen } from './features/quiz/StoryScreens'
import { FinaleSequence } from './features/quiz/FinaleSequence'
import { primeFinaleMedia, stopFinaleMedia } from './features/quiz/finaleMedia'
import { questions } from './features/quiz/content'
import { useQuiz } from './features/quiz/useQuiz'

export function App() {
  const { state, dispatch } = useQuiz()
  const verified = useCallback(() => dispatch({ type: 'verified' }), [dispatch])
  const revealed = useCallback(() => dispatch({ type: 'revealed' }), [dispatch])
  const next = useCallback(() => dispatch({ type: 'next', questionIndex: state.index }), [dispatch, state.index])
  const final = ['decrypt', 'reveal', 'tickets'].includes(state.screen)
  const gift = state.screen === 'reveal' || state.screen === 'tickets'
  function restart() { stopFinaleMedia(); dispatch({ type: 'restart' }) }
  // Must stay synchronous inside the click: unlocks trailer sound for the whole finale.
  function unlock() { primeFinaleMedia(); dispatch({ type: 'unlock' }) }
  // Questions 8–10 deepen the background a little: tension builds without revealing anything.
  const stage = state.screen !== 'question' ? undefined : state.index === questions.length - 1 ? 'final' : state.index >= 7 ? 'late' : undefined
  return <div className="app-shell" data-screen={state.screen} data-stage={stage} data-world={final ? 'berlin' : undefined}>
    <a className="skip-link" href="#main">Zum Inhalt</a>
    <header className="site-header">
      <div className="wordmark"><span className="brand-symbol" aria-hidden="true">X</span><span>PROJECT X</span></div>
      {gift ? <MusicPlayer /> : <span className="header-access"><LockKeyhole size={13} />{state.screen === 'login' ? 'Private Access' : 'Zugang bestätigt'}</span>}
    </header>
    <main id="main">
      <AnimatePresence mode="wait" initial={false}>
        {state.screen === 'login' && <LoginScreen key="login" onLogin={() => dispatch({ type: 'login' })} />}
        {state.screen === 'identity' && <IdentityScreen key="identity" onComplete={verified} />}
        {state.screen === 'intro' && <IntroScreen key="intro" onStart={() => dispatch({ type: 'start' })} />}
        {state.screen === 'question' && <QuestionScreen key={state.index} question={questions[state.index]!} index={state.index} selected={state.selected} onAnswer={(option) => dispatch({ type: 'answer', option, questionIndex: state.index })} onNext={next} />}
        {state.screen === 'halfway' && <HalfwayScreen key="halfway" onContinue={() => dispatch({ type: 'continue' })} />}
        {state.screen === 'complete' && <CompletionScreen key="complete" onUnlock={unlock} />}
        {state.screen === 'decrypt' && <FinaleSequence key="decrypt" onComplete={revealed} />}
        {state.screen === 'reveal' && <ResultScreen key="reveal" onTickets={() => dispatch({ type: 'tickets' })} />}
        {state.screen === 'tickets' && <TicketScreen key="tickets" />}
      </AnimatePresence>
    </main>
    {gift && <div className="berlin-smoke" aria-hidden="true"><span /><span /><span /></div>}
    {gift && <p className="finale-tagline">Dein Geschenk. Dein Konzert. Dein Moment.</p>}
    <footer className="site-footer"><span>PROJECT X <span className="footer-divider">/</span> {final ? 'Ein Moment, der bleibt.' : 'Das Beste bleibt verborgen.'}</span><div className="footer-right">
      {state.screen === 'tickets' && <button className="text-button" onClick={restart}>Neu beginnen <ArrowUpRight size={14} /></button>}
      <details className="help"><summary aria-label="So funktioniert PROJECT X"><HelpCircle size={17} /><span>Hinweise</span></summary><div className="help-content"><strong>Dein Zugang zu PROJECT X.</strong><p>Melde dich mit der E-Mail-Adresse und dem Passwort aus deiner persönlichen Einladung an. Der Zugang ist nur für dich bestimmt.</p><p>Zehn Fragen. Kein Zeitlimit. Falsche Antworten kannst du erneut versuchen. Dein Fortschritt wird für diese Sitzung gespeichert.</p><p>Probleme beim Login? Wende dich an die Person, von der du deine Einladung erhalten hast.</p></div></details>
    </div></footer>
  </div>
}

