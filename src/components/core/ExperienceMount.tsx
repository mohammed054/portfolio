'use client';

import dynamic from 'next/dynamic';

export const ExperienceMount = dynamic(
  () => import('./Experience').then((module) => module.Experience),
  {
    ssr: false,
  }
);
