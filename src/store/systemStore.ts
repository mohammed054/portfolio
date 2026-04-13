import { create } from 'zustand';
import { resolveSystemState } from '@/lib/systemStates';
import { type CursorContext, type SystemStatus } from '@/types/system';

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));
const clampCursor = (value: number) => Math.max(-1, Math.min(1, value));

interface SystemStore {
  progress: number;
  status: SystemStatus;
  isLoaded: boolean;
  loaderProgress: number;
  audioEnabled: boolean;
  cursor: { x: number; y: number };
  cursorContext: CursorContext;
  reducedMotion: boolean;
  setProgress: (progress: number) => void;
  setCursor: (x: number, y: number) => void;
  setCursorContext: (context: CursorContext) => void;
  setLoaded: (loaded: boolean) => void;
  setLoaderProgress: (progress: number) => void;
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
}

export const useSystemStore = create<SystemStore>()((set) => ({
  progress: 0,
  status: resolveSystemState(0),
  isLoaded: false,
  loaderProgress: 0,
  audioEnabled: false,
  cursor: { x: 0, y: 0 },
  cursorContext: 'default',
  reducedMotion: false,
  setProgress: (progress) => {
    const next = clampProgress(progress);
    set({
      progress: next,
      status: resolveSystemState(next),
    });
  },
  setCursor: (x, y) => {
    set({
      cursor: {
        x: clampCursor(x),
        y: clampCursor(y),
      },
    });
  },
  setCursorContext: (cursorContext) => set({ cursorContext }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setLoaderProgress: (loaderProgress) =>
    set({ loaderProgress: clampProgress(loaderProgress) }),
  toggleAudio: () =>
    set((state) => ({
      audioEnabled: state.reducedMotion ? false : !state.audioEnabled,
    })),
  setAudioEnabled: (audioEnabled) =>
    set((state) => ({
      audioEnabled: state.reducedMotion ? false : audioEnabled,
    })),
  setReducedMotion: (reducedMotion) =>
    set((state) => ({
      reducedMotion,
      audioEnabled: reducedMotion ? false : state.audioEnabled,
    })),
}));

export const useProgress = () => useSystemStore((state) => state.progress);
export const useSystemStatus = () => useSystemStore((state) => state.status);
export const useSystemState = () => useSystemStore((state) => state.status.state);
export const useLocalProgress = () => useSystemStore((state) => state.status.local);
export const useIsLoaded = () => useSystemStore((state) => state.isLoaded);
export const useLoaderProgress = () => useSystemStore((state) => state.loaderProgress);
export const useAudioEnabled = () => useSystemStore((state) => state.audioEnabled);
export const useCursorPos = () => useSystemStore((state) => state.cursor);
export const useCursorContext = () => useSystemStore((state) => state.cursorContext);
export const useReducedMotion = () => useSystemStore((state) => state.reducedMotion);
