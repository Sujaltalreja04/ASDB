import { create } from 'zustand';
import { initTheme, setThemeClass } from '../lib/theme';

interface AppState {
  theme: 'dark' | 'light';
  activeWorkspace: string;
  sidebarExpanded: boolean;
  activeModule: string;
  notificationsOpen: boolean;
  copilotOpen: boolean;
  commandPaletteOpen: boolean;
  toggleTheme: () => void;
  setActiveWorkspace: (id: string) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setActiveModule: (id: string) => void;
  setNotificationsOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: initTheme(),
  activeWorkspace: 'mussafah',
  sidebarExpanded: true,
  activeModule: 'programme-command',
  notificationsOpen: false,
  copilotOpen: false,
  commandPaletteOpen: false,
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    setThemeClass(nextTheme);
    return { theme: nextTheme };
  }),
  setActiveWorkspace: (id) => set({ activeWorkspace: id }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setActiveModule: (id) => set({ activeModule: id }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
