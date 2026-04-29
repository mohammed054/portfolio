import { prefersReducedMotion } from './motion';

type SceneQuality = 'high' | 'low';

interface NavigatorWithHints extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
}

function getForcedQuality(): null | SceneQuality {
  if (typeof window === 'undefined') {
    return null;
  }

  const quality = new URLSearchParams(window.location.search).get('quality');
  return quality === 'low' || quality === 'high' ? quality : null;
}

function resolveHeroSceneQuality(): SceneQuality {
  const forcedQuality = getForcedQuality();
  if (forcedQuality) {
    return forcedQuality;
  }

  if (typeof navigator === 'undefined') {
    return 'high';
  }

  const hints = navigator as NavigatorWithHints;
  const deviceMemory = hints.deviceMemory ?? Infinity;
  const hardwareConcurrency = navigator.hardwareConcurrency || Infinity;
  const saveData = hints.connection?.saveData ?? false;
  const effectiveType = hints.connection?.effectiveType ?? '';

  if (
    prefersReducedMotion ||
    saveData ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    deviceMemory <= 4 ||
    hardwareConcurrency <= 4
  ) {
    return 'low';
  }

  return 'high';
}

export const heroSceneQuality: SceneQuality = resolveHeroSceneQuality();
export const isLowPerformanceDevice = heroSceneQuality === 'low';
