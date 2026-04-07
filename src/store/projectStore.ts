import { create } from 'zustand';
import { PROJECTS } from '@/lib/projectData';
import { type Project } from '@/types/project';

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  modalOpen: boolean;
  openProject: (project: Project) => void;
  closeProject: () => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectStore>()((set) => ({
  projects: PROJECTS,
  activeProject: null,
  modalOpen: false,
  openProject: (activeProject) => set({ activeProject, modalOpen: true }),
  closeProject: () => set({ modalOpen: false }),
  clearProject: () => set({ activeProject: null }),
}));

export const useProjects = () => useProjectStore((state) => state.projects);
export const useActiveProject = () => useProjectStore((state) => state.activeProject);
export const useModalOpen = () => useProjectStore((state) => state.modalOpen);
