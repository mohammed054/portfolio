import { type Project } from '@/types/project';

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'Signal Atlas',
    client: 'Personal',
    year: 2026,
    category: ['AI', 'SYSTEMS', 'WEB'],
    description:
      'A semantic research surface that ingests documents, generates embeddings, and renders clustered relationships in real time.',
    thumbnail: '/projects/project-01.jpg',
    tech: ['Next.js', 'OpenAI', 'TypeScript', 'PostgreSQL', 'Three.js'],
  },
  {
    id: 'project-02',
    title: 'Runtime Grid',
    client: 'Personal',
    year: 2025,
    category: ['WEB', 'DESIGN', 'SYSTEMS'],
    description:
      'A modular interface runtime that composes responsive dashboards from schema-driven layout and interaction primitives.',
    thumbnail: '/projects/project-02.jpg',
    tech: ['React', 'Tailwind', 'Zustand', 'Framer Motion', 'Vercel'],
  },
  {
    id: 'project-03',
    title: 'Kinetic Archive',
    client: 'Personal',
    year: 2025,
    category: ['3D', 'MOTION', 'WEB'],
    description:
      'A browser-based exhibition space that streams optimized media into a camera-authored 3D narrative without frame drops.',
    thumbnail: '/projects/project-03.jpg',
    tech: ['Three.js', 'GSAP', 'GLSL', 'React Three Fiber', 'Blender'],
  },
  {
    id: 'project-04',
    title: 'Prompt Foundry',
    client: 'Personal',
    year: 2024,
    category: ['AI', 'WEB', 'SYSTEMS'],
    description:
      'A tooling layer for prompt evaluation that versions prompts, scores outputs, and exposes regression deltas across model runs.',
    thumbnail: '/projects/project-04.jpg',
    tech: ['Next.js', 'Python', 'OpenAI', 'SQLite', 'Docker'],
  },
];
