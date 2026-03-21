import { create } from 'zustand';

interface SceneState {
  // Loader
  isLoaded: boolean;
  loadProgress: number;
  setLoaded: (v: boolean) => void;
  setLoadProgress: (v: number) => void;

  // Hero interaction
  heroTextVisible: boolean;
  mhClicked: boolean;
  setHeroTextVisible: (v: boolean) => void;
  setMhClicked: (v: boolean) => void;

  // Scroll progress (0–1 per section)
  scrollProgress: number;
  activeSection: string;
  setScrollProgress: (v: number) => void;
  setActiveSection: (v: string) => void;

  // Cursor position (normalized -1 to 1)
  cursorX: number;
  cursorY: number;
  setCursor: (x: number, y: number) => void;

  // UI hover state
  isHovering: boolean;
  setHovering: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  isLoaded: false,
  loadProgress: 0,
  setLoaded: (v) => set({ isLoaded: v }),
  setLoadProgress: (v) => set({ loadProgress: v }),

  heroTextVisible: false,
  mhClicked: false,
  setHeroTextVisible: (v) => set({ heroTextVisible: v }),
  setMhClicked: (v) => set({ mhClicked: v }),

  scrollProgress: 0,
  activeSection: 'hero',
  setScrollProgress: (v) => set({ scrollProgress: v }),
  setActiveSection: (v) => set({ activeSection: v }),

  cursorX: 0,
  cursorY: 0,
  setCursor: (x, y) => set({ cursorX: x, cursorY: y }),

  isHovering: false,
  setHovering: (v) => set({ isHovering: v }),
}));
