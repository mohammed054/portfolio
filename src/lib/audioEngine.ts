import { SystemState } from '@/types/system';

type ToneModule = typeof import('tone/build/esm/index.js');
type ToneFilter = import('tone/build/esm/index.js').Filter;
type ToneOscillator = import('tone/build/esm/index.js').Oscillator;

let tonePromise: Promise<ToneModule> | null = null;
let toneModule: ToneModule | null = null;
let hum: ToneOscillator | null = null;
let filter: ToneFilter | null = null;
let isInitialized = false;
let tickInterval: number | null = null;

const loadTone = async (): Promise<ToneModule> => {
  if (!tonePromise) {
    tonePromise = import('tone/build/esm/index.js');
  }

  toneModule = await tonePromise;
  return toneModule;
};

export const initAudio = async (): Promise<void> => {
  if (typeof window === 'undefined' || isInitialized) {
    return;
  }

  const Tone = await loadTone();
  await Tone.start();

  filter = new Tone.Filter({
    frequency: 220,
    type: 'lowpass',
    rolloff: -24,
  }).toDestination();

  hum = new Tone.Oscillator({
    frequency: 42,
    type: 'sawtooth',
    volume: -22,
  }).connect(filter);

  Tone.getDestination().volume.value = -48;
  hum.start();
  isInitialized = true;
};

export const destroyAudio = (): void => {
  stopTickRhythm();
  hum?.stop();
  hum?.dispose();
  filter?.dispose();
  hum = null;
  filter = null;
  isInitialized = false;
};

export const updateAudio = (progress: number, state: SystemState): void => {
  if (!isInitialized || !hum || !filter || !toneModule) {
    return;
  }

  const destination = toneModule.getDestination();
  const baseFrequency = 40 + progress * 78;
  const cutoff = 120 + progress * 1400;
  const targetVolume = state === SystemState.Resolved ? -40 : -48 + progress * 24;

  hum.frequency.rampTo(baseFrequency, 0.2);
  filter.frequency.rampTo(cutoff, 0.24);
  destination.volume.rampTo(targetVolume, 0.18);
};

export const playTick = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  const Tone = toneModule ?? (await loadTone());
  const synth = new Tone.MetalSynth({
    envelope: {
      attack: 0.001,
      decay: 0.08,
      release: 0.02,
    },
    harmonicity: 4.2,
    modulationIndex: 18,
    resonance: 2600,
    octaves: 1.2,
    volume: -18,
  }).toDestination();

  synth.triggerAttackRelease('C6', '32n');
  window.setTimeout(() => synth.dispose(), 500);
};

export const startTickRhythm = (): void => {
  if (!isInitialized || tickInterval) {
    return;
  }

  tickInterval = window.setInterval(() => {
    void playTick();
  }, 500);
};

export const stopTickRhythm = (): void => {
  if (!tickInterval) {
    return;
  }

  clearInterval(tickInterval);
  tickInterval = null;
};

export const playResolveChime = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  const Tone = toneModule ?? (await loadTone());
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.15,
      release: 1.4,
    },
    volume: -12,
  }).toDestination();

  synth.triggerAttackRelease('C5', '2n');
  window.setTimeout(() => synth.dispose(), 2500);
};

export const isAudioInitialized = (): boolean => isInitialized;
