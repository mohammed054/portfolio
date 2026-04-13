'use client';

import { useEffect, useRef } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';
import {
  destroyAudio,
  initAudio,
  isAudioInitialized,
  playResolveChime,
  startTickRhythm,
  stopTickRhythm,
  updateAudio,
} from '@/lib/audioEngine';

export const useAudio = () => {
  const audioEnabled = useSystemStore((state) => state.audioEnabled);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const status = useSystemStore((state) => state.status);
  const previousState = useRef<SystemState>(status.state);

  useEffect(() => {
    if (reducedMotion) {
      stopTickRhythm();
      destroyAudio();
      return;
    }

    if (!audioEnabled) {
      stopTickRhythm();
      destroyAudio();
      return;
    }

    void initAudio();
  }, [audioEnabled, reducedMotion]);

  useEffect(() => {
    if (!audioEnabled || reducedMotion || !isAudioInitialized()) {
      previousState.current = status.state;
      return;
    }

    const currentState = status.state;
    const lastState = previousState.current;

    if (currentState !== lastState) {
      if (currentState === SystemState.Identifying) {
        startTickRhythm();
      }

      if (lastState === SystemState.Identifying && currentState !== SystemState.Identifying) {
        stopTickRhythm();
      }

      if (currentState === SystemState.Resolved && lastState !== SystemState.Resolved) {
        void playResolveChime();
      }

      previousState.current = currentState;
    }
  }, [audioEnabled, reducedMotion, status.state]);

  return {
    update: (progress: number, state: SystemState) => {
      if (!audioEnabled || reducedMotion || !isAudioInitialized()) {
        return;
      }

      updateAudio(progress, state);
    },
  };
};
