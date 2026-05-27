import { create } from 'zustand'
import { PR } from '@/types/pr'

interface PRStore {
  prs: PR[]
  selectedPRNumber: number | null
  filters: { state: string; label: string; author: string }
  connectedRepo: string | null
  setPRs: (prs: PR[]) => void
  addPR: (pr: PR) => void
  updatePR: (pr: PR) => void
  removePR: (number: number) => void
  selectPR: (number: number) => void
  setFilter: (key: string, value: string) => void
  setRepo: (repo: string) => void
}

export const usePRStore = create<PRStore>((set) => ({
  prs: [],
  selectedPRNumber: null,
  filters: { state: 'open', label: '', author: '' },
  connectedRepo: null,
  setPRs: (prs) => set({ prs }),
  addPR: (pr) => set((state) => ({ prs: [pr, ...state.prs] })),
  updatePR: (updatedPR) => set((state) => ({
    prs: state.prs.map((pr) => pr.number === updatedPR.number ? updatedPR : pr)
  })),
  removePR: (number) => set((state) => ({
    prs: state.prs.filter((pr) => pr.number !== number)
  })),
  selectPR: (number) => set({ selectedPRNumber: number }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  setRepo: (repo) => set({ connectedRepo: repo })
}))
