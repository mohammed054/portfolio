// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectCategory = 'DESIGN' | 'WEB' | 'MOTION' | '3D' | 'AI' | 'SYSTEMS';

export interface Project {
  id:          string;
  title:       string;
  client:      string;            // real client name or "Personal"
  year:        number;
  category:    ProjectCategory[];
  description: string;            // 1 sentence only — what it DOES, not what it IS
  thumbnail:   string;            // path to /public/projects/
  url?:        string;
  tech:        string[];          // max 5 items
}
