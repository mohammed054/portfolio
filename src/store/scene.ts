import { create } from 'zustand';

interface SceneState {
  isLoaded: boolean;
  loadProgress: number;
  setLoaded: (v: boolean) => void;
  setLoadProgress: (v: number) => void;

  heroTextVisible: boolean;
  mhClicked: boolean;
  setHeroTextVisible: (v: boolean) => void;
  setMhClicked: (v: boolean) => void;

  scrollProgress: number;
  activeSection: string;
  setScrollProgress: (v: number) => void;
  setActiveSection: (v: string) => void;

  cursorX: number;
  cursorY: number;
  setCursor: (x: number, y: number) => void;

  isHovering: boolean;
  setHovering: (v: boolean) => void;

  // Hero completion — used by page to reveal post-hero content
  heroExited: boolean;
  setHeroExited: (v: boolean) => void;
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

  heroExited: false,
  setHeroExited: (v) => set({ heroExited: v }),
}));