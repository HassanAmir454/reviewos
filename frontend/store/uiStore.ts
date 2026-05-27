import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  activePanel: 'diff' | 'files' | 'history'
  selectedFile: string | null
  setSidebarOpen: (open: boolean) => void
  setActivePanel: (panel: 'diff' | 'files' | 'history') => void
  setSelectedFile: (file: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activePanel: 'diff',
  selectedFile: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSelectedFile: (file) => set({ selectedFile: file })
}))
