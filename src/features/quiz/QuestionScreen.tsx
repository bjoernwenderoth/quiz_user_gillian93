import { useEffect } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { AnimatedButton, ProgressIndicator, ScreenTransition } from '../../components/ui'
import { calmSpring, press, storyTiming, wrongNudge } from '../../design/motion'
import { assetUrl, questions, type Question } from './content'

export function QuestionScreen({ question, index, selected, onAnswer, onNext }: { question: Question; index: number; selected: number | null; onAnswer: (option: number) => void; onNext: () => void }) {
  const reduced = useReducedMotion()
  const correct = selected === question.correctAnswer
  const finalKey = index === questions.length - 1
  useEffect(() => {
    if (!finalKey || !correct) return
    const timer = window.setTimeout(onNext, reduced ? 450 : storyTiming.finalAnswer)
    return () => clearTimeout(timer)
  }, [correct, finalKey, onNext, reduced])
  return <ScreenTransition className={`question-screen ${correct ? 'is-resolved' : ''} ${finalKey ? 'final-question' : ''}`}>
    <div className="question-progress"><span>LEVEL <strong>{String(index + 1).padStart(2, '0')}</strong><span className="muted"> / 10</span></span><span className="category">{question.category}</span></div>
    <ProgressIndicator completed={index + Number(correct)} total={questions.length} />
    <div className="question-layout">
      <div className="question-image">
        <img src={assetUrl('images/questions/' + question.image)} alt={question.imageAlt} style={{ objectPosition: question.imagePosition }} width="1200" height="900" fetchPriority="high" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
        <div className="image-overlay" />
        <span className="image-category">{question.category}</span>
        <span className="image-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="question-content">
        <h1 tabIndex={-1}>{question.question}</h1>
        <p className="question-instruction">{finalKey ? 'Der letzte Schlüssel. Vertraue deinem Gefühl.' : index >= 5 ? 'Dein Ziel rückt näher. Ein Schlüssel nach dem anderen.' : 'Vier Möglichkeiten. Ein Schlüssel.'}</p>
        <div className="answers" role="group" aria-label="Antwortmöglichkeiten">
          {question.answers.map((answer, option) => {
            const chosen = selected === option
            return <motion.button key={answer} type="button" className={`answer-option ${chosen ? correct ? 'is-correct' : 'is-wrong' : ''}`} aria-disabled={correct} aria-pressed={chosen} onClick={() => { if (!correct) onAnswer(option) }} whileTap={correct || reduced ? undefined : { scale: press.card }} animate={chosen && !correct && !reduced ? wrongNudge : { x: 0 }} transition={calmSpring} aria-label={`${String.fromCharCode(65 + option)}: ${answer}`}>
              <span className="answer-letter" aria-hidden="true">{chosen ? correct ? <Check size={18} /> : <X size={18} /> : String.fromCharCode(65 + option)}</span>
              <span className="answer-text">{answer}</span>
              {chosen && <span className="answer-status">{correct ? 'Richtig' : 'Erneut versuchen'}</span>}
            </motion.button>
          })}
        </div>
        <div className="question-bottom">
          <p role="status" aria-live="polite" aria-atomic="true" className={selected === null ? 'muted' : correct ? 'feedback-correct' : 'feedback-wrong'}>{selected === null ? 'Wähle eine Antwort, um fortzufahren.' : correct ? 'Schlüssel akzeptiert. Genau richtig.' : 'Noch nicht der richtige Schlüssel. Versuch es noch einmal.'}</p>
          {correct && !finalKey && <AnimatedButton onClick={onNext}>{index === 9 ? 'CHALLENGE ABSCHLIESSEN' : 'NÄCHSTE FRAGE'}<ArrowRight size={17} /></AnimatedButton>}
        </div>
      </div>
    </div>
  </ScreenTransition>
}

