import { useEffect, useReducer } from 'react'
import { initialState, quizReducer, restoreProgress, storageKey } from './state'

function readSession() {
  try { return restoreProgress(sessionStorage.getItem(storageKey)) } catch { return initialState }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, undefined, readSession)
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)) } catch { /* Works with storage blocked. */ }
  }, [state])
  return { state, dispatch }
}

