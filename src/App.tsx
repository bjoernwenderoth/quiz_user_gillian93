import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowUpRight, HelpCircle, LockKeyhole } from 'lucide-react'
import { IntroScreen } from './features/quiz/IntroScreen'
import { LoginScreen } from './features/quiz/LoginScreen'
import { QuestionScreen } from './features/quiz/QuestionScreen'
import { ResultScreen } from './features/quiz/ResultScreen'
import { TicketScreen } from './features/quiz/TicketScreen'
import { MusicPlayer } from './features/quiz/MusicPlayer'
import { CompletionScreen, DecryptScreen, HalfwayScreen, IdentityScreen } from './features/quiz/StoryScreens'
import { questions } from './features/quiz/content'
import { useQuiz } from './features/quiz/useQuiz'

export function App() {
  const { state, dispatch } = useQuiz()
  const [musicActivated, setMusicActivated] = useState(false)
  const verified = useCallback(() => dispatch({ type: 'verified' }), [dispatch])
  const revealed = useCallback(() => dispatch({ type: 'revealed' }), [dispatch])
  const next = useCallback(() => dispatch({ type: 'next', questionIndex: state.index }), [dispatch, state.index])
  const final = ['decrypt', 'reveal', 'tickets'].includes(state.screen)
  function restart() { setMusicActivated(false); dispatch({ type: 'restart' }) }
  // Questions 8–10 deepen the background a little: tension builds without revealing anything.
  const stage = state.screen !== 'question' ? undefined : state.index === questions.length - 1 ? 'final' : state.index >= 7 ? 'late' : undefined
  return <div className="app-shell" data-screen={state.screen} data-stage={stage}>
    <a className="skip-link" href="#main">Zum Inhalt</a>
    <header className="site-header">
      <div className="wordmark"><span className="brand-symbol" aria-hidden="true">X</span><span>PROJECT X</span></div>
      <span className="header-access"><LockKeyhole size={13} />{state.screen === 'login' ? 'Private Access' : 'Zugang bestätigt'}</span>
    </header>
    <main id="main">
      <AnimatePresence mode="wait" initial={false}>
        {state.screen === 'login' && <LoginScreen key="login" onLogin={() => dispatch({ type: 'login' })} />}
        {state.screen === 'identity' && <IdentityScreen key="identity" onComplete={verified} />}
        {state.screen === 'intro' && <IntroScreen key="intro" onStart={() => dispatch({ type: 'start' })} />}
        {state.screen === 'question' && <QuestionScreen key={state.index} question={questions[state.index]!} index={state.index} selected={state.selected} onAnswer={(option) => dispatch({ type: 'answer', option, questionIndex: state.index })} onNext={next} />}
        {state.screen === 'halfway' && <HalfwayScreen key="halfway" onContinue={() => dispatch({ type: 'continue' })} />}
        {state.screen === 'complete' && <CompletionScreen key="complete" onUnlock={() => { setMusicActivated(true); dispatch({ type: 'unlock' }) }} />}
        {state.screen === 'decrypt' && <DecryptScreen key="decrypt" onComplete={revealed} />}
        {state.screen === 'reveal' && <ResultScreen key="reveal" onTickets={() => dispatch({ type: 'tickets' })} />}
        {state.screen === 'tickets' && <TicketScreen key="tickets" />}
      </AnimatePresence>
    </main>
    {final && <MusicPlayer activated={musicActivated} onActivate={() => setMusicActivated(true)} />}
    <footer className="site-footer"><span>PROJECT X <span className="footer-divider">/</span> {final ? 'Ein Moment, der bleibt.' : 'Das Beste bleibt verborgen.'}</span><div className="footer-right">
      {state.screen === 'tickets' && <button className="text-button" onClick={restart}>Neu beginnen <ArrowUpRight size={14} /></button>}
      <details className="help"><summary aria-label="So funktioniert PROJECT X"><HelpCircle size={17} /><span>Hinweise</span></summary><div className="help-content"><strong>Dein Zugang zu PROJECT X.</strong><p>Der Login gehört zur Inszenierung. Nutze eine beliebige gültige E-Mail-Adresse und ein erfundenes Passwort. Beides wird weder gespeichert noch versendet.</p><p>Zehn Fragen. Kein Zeitlimit. Falsche Antworten kannst du erneut versuchen. Dein Fortschritt bleibt nach Möglichkeit in diesem Browser-Tab erhalten.</p><p>Der Zugang ist simuliert und kein Schutz vertraulicher Inhalte.</p></div></details>
    </div></footer>
  </div>
}

