import { STATES } from '../config/variables.js'
import { progressRange } from './math.js'

export function stateProgress(progress, stateName) {
  const state = STATES[stateName]
  if (!state) return 0
  return progressRange(progress, state.start, state.end)
}

export function resolveState(progress) {
  for (const [name, range] of Object.entries(STATES)) {
    if (progress >= range.start && progress <= range.end) {
      return name
    }
  }
  return 'IDLE'
}

export function inState(progress, stateName) {
  const state = STATES[stateName]
  if (!state) return false
  return progress >= state.start && progress <= state.end
}
