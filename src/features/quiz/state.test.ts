import { describe, expect, it } from 'vitest'
import { initialState, quizReducer, restoreProgress, type QuizState } from './state'
import { questions } from './content'

function start() {
  return quizReducer(quizReducer(quizReducer(initialState, { type: 'login' }), { type: 'verified' }), { type: 'start' })
}

describe('PROJECT X progression', () => {
  it('requires identity verification before starting and rejects premature reveals', () => {
    expect(quizReducer(initialState, { type: 'start' })).toBe(initialState)
    expect(quizReducer(initialState, { type: 'unlock' })).toBe(initialState)
    expect(quizReducer(start(), { type: 'revealed' }).screen).toBe('question')
  })
  it('keeps wrong answers retryable, locks correct answers and ignores stale events', () => {
    const state = start()
    const wrong = quizReducer(state, { type: 'answer', option: 0, questionIndex: 0 })
    expect(quizReducer(wrong, { type: 'next', questionIndex: 0 })).toBe(wrong)
    expect(quizReducer(wrong, { type: 'answer', option: 1, questionIndex: 0 }).selected).toBe(1)
    for (const option of [-1, 4, 1.5, NaN]) expect(quizReducer(wrong, { type: 'answer', option, questionIndex: 0 })).toBe(wrong)
    expect(quizReducer(wrong, { type: 'answer', option: 2, questionIndex: 1 })).toBe(wrong)
    const right = quizReducer(wrong, { type: 'answer', option: 2, questionIndex: 0 })
    expect(quizReducer(right, { type: 'answer', option: 0, questionIndex: 0 })).toBe(right)
    const next = quizReducer(right, { type: 'next', questionIndex: 0 })
    expect(next.index).toBe(1)
    expect(quizReducer(next, { type: 'next', questionIndex: 0 })).toBe(next)
    expect(quizReducer(next, { type: 'answer', option: 2, questionIndex: 0 })).toBe(next)
  })
  it('pauses at halfway and requires an explicit unlock before the reveal', () => {
    let state: QuizState = start()
    questions.forEach((question, index) => {
      state = quizReducer(state, { type: 'answer', option: question.correctAnswer, questionIndex: index })
      state = quizReducer(state, { type: 'next', questionIndex: index })
      if (index === 4) {
        expect(state.screen).toBe('halfway')
        expect(quizReducer(state, { type: 'answer', option: 0, questionIndex: 5 })).toBe(state)
        state = quizReducer(state, { type: 'continue' })
      }
    })
    expect(state.screen).toBe('complete')
    expect(quizReducer(state, { type: 'tickets' })).toBe(state)
    state = quizReducer(state, { type: 'unlock' })
    expect(state.screen).toBe('decrypt')
    state = quizReducer(state, { type: 'revealed' })
    expect(state.screen).toBe('reveal')
    state = quizReducer(state, { type: 'tickets' })
    expect(state.screen).toBe('tickets')
    expect(quizReducer(state, { type: 'restart' })).toBe(initialState)
  })
  it('restores valid progress and safely discards corrupt or inconsistent sessions', () => {
    const state = { screen: 'question', index: 3, selected: 1 }
    expect(restoreProgress(JSON.stringify(state))).toEqual(state)
    for (const raw of [null, '', '{', 'null', '[]', '{"screen":"question","index":99,"selected":null}', '{"screen":"halfway","index":2,"selected":null}', '{"screen":"reveal","index":0,"selected":null}', '{"screen":"question","index":2,"selected":7}']) expect(restoreProgress(raw)).toEqual(initialState)
    expect(restoreProgress('{"screen":"decrypt","index":9,"selected":null}').screen).toBe('complete')
    expect(restoreProgress('{"screen":"tickets","index":9,"selected":null}').screen).toBe('tickets')
  })
  it('provides ten distinct four-answer questions and the requested solutions', () => {
    expect(questions).toHaveLength(10)
    expect(new Set(questions.map((question) => question.id)).size).toBe(10)
    expect(questions.map((q) => q.answers[q.correctAnswer])).toEqual(['Einstand', 'Maske', '14', 'Orgrimmar', 'Guanciale', 'Papaplatte', 'Aykut Anhan', 'Albatross', 'Wrath of the Lich King', 'Berlin lebt'])
    questions.forEach((q) => { expect(new Set(q.answers).size).toBe(4); expect(q.image).toMatch(/\.jpg$/) })
  })
})

