import { questions } from './content'

export const screens = ['login', 'identity', 'intro', 'question', 'halfway', 'complete', 'decrypt', 'reveal', 'tickets'] as const
export type Screen = typeof screens[number]
export type QuizState = { screen: Screen; index: number; selected: number | null }
export type QuizAction =
  | { type: 'login' | 'verified' | 'start' | 'continue' | 'unlock' | 'revealed' | 'tickets' | 'back' | 'restart' }
  | { type: 'answer'; option: number; questionIndex: number }
  | { type: 'next'; questionIndex: number }

export const initialState: QuizState = { screen: 'login', index: 0, selected: null }
export const storageKey = 'project-x:progress:v1'

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'login': return state.screen === 'login' ? { ...state, screen: 'identity' } : state
    case 'verified': return state.screen === 'identity' ? { ...state, screen: 'intro' } : state
    case 'start': return state.screen === 'intro' ? { ...state, screen: 'question' } : state
    case 'answer': {
      if (state.screen !== 'question' || state.index !== action.questionIndex || state.selected === questions[state.index]?.correctAnswer || !Number.isInteger(action.option) || action.option < 0 || action.option > 3) return state
      return { ...state, selected: action.option }
    }
    case 'next': {
      if (state.screen !== 'question' || action.questionIndex !== state.index || state.selected !== questions[state.index]?.correctAnswer) return state
      if (state.index === 9) return { ...state, screen: 'complete', selected: null }
      return { screen: state.index === 4 ? 'halfway' : 'question', index: state.index + 1, selected: null }
    }
    case 'continue': return state.screen === 'halfway' ? { ...state, screen: 'question' } : state
    case 'unlock': return state.screen === 'complete' ? { ...state, screen: 'decrypt' } : state
    case 'revealed': return state.screen === 'decrypt' ? { ...state, screen: 'reveal' } : state
    case 'tickets': return state.screen === 'reveal' ? { ...state, screen: 'tickets' } : state
    case 'back': return state.screen === 'tickets' ? { ...state, screen: 'reveal' } : state
    case 'restart': return initialState
  }
}

/** Validate untrusted browser storage. Login fields and music playback are never stored. */
export function restoreProgress(raw: string | null): QuizState {
  try {
    const value: unknown = JSON.parse(raw ?? 'null')
    if (typeof value !== 'object' || value === null || !('screen' in value) || !('index' in value) || !('selected' in value)) return initialState
    const { screen, index, selected } = value
    if (!screens.some((entry) => entry === screen) || typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= questions.length || (selected !== null && (typeof selected !== 'number' || !Number.isInteger(selected) || selected < 0 || selected > 3))) return initialState
    if (screen === 'question') return { screen, index, selected }
    if (selected !== null) return initialState
    if (screen === 'halfway' && index === 5) return { screen, index, selected }
    if (['complete', 'decrypt', 'reveal', 'tickets'].includes(String(screen)) && index === 9) {
      // An interrupted reveal requires a fresh unlock click, with no autoplay.
      return { screen: screen === 'decrypt' ? 'complete' : screen as Screen, index, selected }
    }
    if (['login', 'identity', 'intro'].includes(String(screen)) && index === 0) return { screen: screen as Screen, index, selected }
  } catch { /* Ignore malformed or obsolete storage. */ }
  return initialState
}

