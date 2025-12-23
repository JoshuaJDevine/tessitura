import { create } from 'zustand';
import { Category, Host } from '@/types';

interface UIStore {
  searchQuery: string;
  selectedTags: string[];
  selectedCategories: Category[];
  selectedHosts: Host[];
  isAddInstrumentOpen: boolean;
  isEditInstrumentOpen: boolean;
  editingInstrumentId: string | null;
  suggestedInstrumentId: string | null;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  toggleCategory: (category: Category) => void;
  toggleHost: (host: Host) => void;
  clearFilters: () => void;
  openAddInstrument: () => void;
  closeAddInstrument: () => void;
  openEditInstrument: (id: string) => void;
  closeEditInstrument: () => void;
  setSuggestedInstrument: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: '',
  selectedTags: [],
  selectedCategories: [],
  selectedHosts: [],
  isAddInstrumentOpen: false,
  isEditInstrumentOpen: false,
  editingInstrumentId: null,
  suggestedInstrumentId: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),

  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),

  toggleHost: (host) =>
    set((state) => ({
      selectedHosts: state.selectedHosts.includes(host)
        ? state.selectedHosts.filter((h) => h !== host)
        : [...state.selectedHosts, host],
    })),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedTags: [],
      selectedCategories: [],
      selectedHosts: [],
    }),

  openAddInstrument: () => set({ isAddInstrumentOpen: true }),
  closeAddInstrument: () => set({ isAddInstrumentOpen: false }),

  openEditInstrument: (id) =>
    set({ isEditInstrumentOpen: true, editingInstrumentId: id }),
  closeEditInstrument: () =>
    set({ isEditInstrumentOpen: false, editingInstrumentId: null }),

  setSuggestedInstrument: (id) => set({ suggestedInstrumentId: id }),
}));

