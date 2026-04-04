import { create } from 'zustand'
import { resolveState } from '../utils/ranges.js'

export const useSystemStore = create((set, get) => ({
  progress: 0,
  state: 'IDLE',
  mouse: { x: 0, y: 0 },

  setProgress(progress) {
    const clampedProgress = Math.min(1, Math.max(0, progress))
    const state = resolveState(clampedProgress)
    console.log('[ExperienceProvider] setProgress called:', { progress: clampedProgress, state })
    set({ progress: clampedProgress, state })
  },

  setMouse(x, y) {
    set({ mouse: { x, y } })
  },
}))

export function useProgress() {
  return useSystemStore((s) => s.progress)
}

export function useSystemState() {
  return useSystemStore((s) => s.state)
}

export const useExperience = () => useSystemStore()
export const useExperienceStore = useSystemStore
