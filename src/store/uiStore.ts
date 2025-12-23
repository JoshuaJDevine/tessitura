import { create } from 'zustand';
import { Category, Host } from '@/types';

interface CollectionViewState {
  sortBy: 'name' | 'recent' | 'category' | 'developer';
  viewDensity: 'compact' | 'spacious';
  selectedCardIds: string[];
}

interface UIStore {
  searchQuery: string;
  selectedTags: string[];
  selectedCategories: Category[];
  selectedHosts: Host[];
  isAddInstrumentOpen: boolean;
  isEditInstrumentOpen: boolean;
  editingInstrumentId: string | null;
  suggestedInstrumentId: string | null;
  collectionView: CollectionViewState;
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
  setCollectionSort: (sortBy: CollectionViewState['sortBy']) => void;
  setViewDensity: (density: CollectionViewState['viewDensity']) => void;
  toggleCardSelection: (id: string) => void;
  clearSelection: () => void;
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
  collectionView: {
    sortBy: 'name',
    viewDensity: 'spacious',
    selectedCardIds: [],
  },

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

  openEditInstrument: (id) => set({ isEditInstrumentOpen: true, editingInstrumentId: id }),
  closeEditInstrument: () => set({ isEditInstrumentOpen: false, editingInstrumentId: null }),

  setSuggestedInstrument: (id) => set({ suggestedInstrumentId: id }),

  setCollectionSort: (sortBy) =>
    set((state) => ({
      collectionView: { ...state.collectionView, sortBy },
    })),

  setViewDensity: (density) =>
    set((state) => ({
      collectionView: { ...state.collectionView, viewDensity: density },
    })),

  toggleCardSelection: (id) =>
    set((state) => {
      const selectedCardIds = state.collectionView.selectedCardIds.includes(id)
        ? state.collectionView.selectedCardIds.filter((cardId) => cardId !== id)
        : [...state.collectionView.selectedCardIds, id];
      return {
        collectionView: { ...state.collectionView, selectedCardIds },
      };
    }),

  clearSelection: () =>
    set((state) => ({
      collectionView: { ...state.collectionView, selectedCardIds: [] },
    })),
}));
