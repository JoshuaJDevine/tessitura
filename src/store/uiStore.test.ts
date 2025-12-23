import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      searchQuery: '',
      selectedTags: [],
      selectedCategories: [],
      selectedHosts: [],
      isAddInstrumentOpen: false,
      isEditInstrumentOpen: false,
      editingInstrumentId: null,
      suggestedInstrumentId: null,
    });
  });

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('test search');

      const query = useUIStore.getState().searchQuery;
      expect(query).toBe('test search');
    });

    it('should update search query', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('first query');
      store.setSearchQuery('second query');

      const query = useUIStore.getState().searchQuery;
      expect(query).toBe('second query');
    });

    it('should accept empty string', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('test');
      store.setSearchQuery('');

      const query = useUIStore.getState().searchQuery;
      expect(query).toBe('');
    });
  });

  describe('toggleTag', () => {
    it('should add tag when not present', () => {
      const store = useUIStore.getState();

      store.toggleTag('orchestral');

      const tags = useUIStore.getState().selectedTags;
      expect(tags).toContain('orchestral');
      expect(tags).toHaveLength(1);
    });

    it('should remove tag when present', () => {
      const store = useUIStore.getState();

      store.toggleTag('orchestral');
      store.toggleTag('orchestral');

      const tags = useUIStore.getState().selectedTags;
      expect(tags).not.toContain('orchestral');
      expect(tags).toHaveLength(0);
    });

    it('should add multiple tags', () => {
      const store = useUIStore.getState();

      store.toggleTag('orchestral');
      store.toggleTag('strings');
      store.toggleTag('brass');

      const tags = useUIStore.getState().selectedTags;
      expect(tags).toEqual(['orchestral', 'strings', 'brass']);
    });

    it('should remove specific tag without affecting others', () => {
      const store = useUIStore.getState();

      store.toggleTag('orchestral');
      store.toggleTag('strings');
      store.toggleTag('brass');
      store.toggleTag('strings'); // Remove strings

      const tags = useUIStore.getState().selectedTags;
      expect(tags).toEqual(['orchestral', 'brass']);
    });
  });

  describe('toggleCategory', () => {
    it('should add category when not present', () => {
      const store = useUIStore.getState();

      store.toggleCategory('Synth');

      const categories = useUIStore.getState().selectedCategories;
      expect(categories).toContain('Synth');
      expect(categories).toHaveLength(1);
    });

    it('should remove category when present', () => {
      const store = useUIStore.getState();

      store.toggleCategory('Synth');
      store.toggleCategory('Synth');

      const categories = useUIStore.getState().selectedCategories;
      expect(categories).not.toContain('Synth');
      expect(categories).toHaveLength(0);
    });

    it('should add multiple categories', () => {
      const store = useUIStore.getState();

      store.toggleCategory('Synth');
      store.toggleCategory('Drums');
      store.toggleCategory('Orchestral');

      const categories = useUIStore.getState().selectedCategories;
      expect(categories).toEqual(['Synth', 'Drums', 'Orchestral']);
    });

    it('should remove specific category without affecting others', () => {
      const store = useUIStore.getState();

      store.toggleCategory('Synth');
      store.toggleCategory('Drums');
      store.toggleCategory('Orchestral');
      store.toggleCategory('Drums'); // Remove Drums

      const categories = useUIStore.getState().selectedCategories;
      expect(categories).toEqual(['Synth', 'Orchestral']);
    });
  });

  describe('toggleHost', () => {
    it('should add host when not present', () => {
      const store = useUIStore.getState();

      store.toggleHost('VST3');

      const hosts = useUIStore.getState().selectedHosts;
      expect(hosts).toContain('VST3');
      expect(hosts).toHaveLength(1);
    });

    it('should remove host when present', () => {
      const store = useUIStore.getState();

      store.toggleHost('VST3');
      store.toggleHost('VST3');

      const hosts = useUIStore.getState().selectedHosts;
      expect(hosts).not.toContain('VST3');
      expect(hosts).toHaveLength(0);
    });

    it('should add multiple hosts', () => {
      const store = useUIStore.getState();

      store.toggleHost('VST3');
      store.toggleHost('Kontakt');
      store.toggleHost('AU');

      const hosts = useUIStore.getState().selectedHosts;
      expect(hosts).toEqual(['VST3', 'Kontakt', 'AU']);
    });

    it('should remove specific host without affecting others', () => {
      const store = useUIStore.getState();

      store.toggleHost('VST3');
      store.toggleHost('Kontakt');
      store.toggleHost('AU');
      store.toggleHost('Kontakt'); // Remove Kontakt

      const hosts = useUIStore.getState().selectedHosts;
      expect(hosts).toEqual(['VST3', 'AU']);
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      const store = useUIStore.getState();

      // Set various filters
      store.setSearchQuery('test');
      store.toggleTag('orchestral');
      store.toggleCategory('Synth');
      store.toggleHost('VST3');

      // Clear all
      store.clearFilters();

      const state = useUIStore.getState();
      expect(state.searchQuery).toBe('');
      expect(state.selectedTags).toEqual([]);
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedHosts).toEqual([]);
    });

    it('should work when no filters are set', () => {
      const store = useUIStore.getState();

      store.clearFilters();

      const state = useUIStore.getState();
      expect(state.searchQuery).toBe('');
      expect(state.selectedTags).toEqual([]);
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedHosts).toEqual([]);
    });

    it('should not affect dialog states', () => {
      const store = useUIStore.getState();

      store.openAddInstrument();
      store.clearFilters();

      const state = useUIStore.getState();
      expect(state.isAddInstrumentOpen).toBe(true);
    });
  });

  describe('openAddInstrument / closeAddInstrument', () => {
    it('should open add instrument dialog', () => {
      const store = useUIStore.getState();

      store.openAddInstrument();

      const isOpen = useUIStore.getState().isAddInstrumentOpen;
      expect(isOpen).toBe(true);
    });

    it('should close add instrument dialog', () => {
      const store = useUIStore.getState();

      store.openAddInstrument();
      store.closeAddInstrument();

      const isOpen = useUIStore.getState().isAddInstrumentOpen;
      expect(isOpen).toBe(false);
    });

    it('should toggle dialog state', () => {
      const store = useUIStore.getState();

      expect(useUIStore.getState().isAddInstrumentOpen).toBe(false);

      store.openAddInstrument();
      expect(useUIStore.getState().isAddInstrumentOpen).toBe(true);

      store.closeAddInstrument();
      expect(useUIStore.getState().isAddInstrumentOpen).toBe(false);
    });
  });

  describe('openEditInstrument / closeEditInstrument', () => {
    it('should open edit instrument dialog with ID', () => {
      const store = useUIStore.getState();

      store.openEditInstrument('inst-123');

      const state = useUIStore.getState();
      expect(state.isEditInstrumentOpen).toBe(true);
      expect(state.editingInstrumentId).toBe('inst-123');
    });

    it('should close edit instrument dialog and clear ID', () => {
      const store = useUIStore.getState();

      store.openEditInstrument('inst-123');
      store.closeEditInstrument();

      const state = useUIStore.getState();
      expect(state.isEditInstrumentOpen).toBe(false);
      expect(state.editingInstrumentId).toBeNull();
    });

    it('should update editing ID when opening with different ID', () => {
      const store = useUIStore.getState();

      store.openEditInstrument('inst-123');
      store.openEditInstrument('inst-456');

      const state = useUIStore.getState();
      expect(state.isEditInstrumentOpen).toBe(true);
      expect(state.editingInstrumentId).toBe('inst-456');
    });

    it('should toggle dialog state', () => {
      const store = useUIStore.getState();

      expect(useUIStore.getState().isEditInstrumentOpen).toBe(false);
      expect(useUIStore.getState().editingInstrumentId).toBeNull();

      store.openEditInstrument('inst-123');
      expect(useUIStore.getState().isEditInstrumentOpen).toBe(true);
      expect(useUIStore.getState().editingInstrumentId).toBe('inst-123');

      store.closeEditInstrument();
      expect(useUIStore.getState().isEditInstrumentOpen).toBe(false);
      expect(useUIStore.getState().editingInstrumentId).toBeNull();
    });
  });

  describe('setSuggestedInstrument', () => {
    it('should set suggested instrument ID', () => {
      const store = useUIStore.getState();

      store.setSuggestedInstrument('inst-123');

      const suggestedId = useUIStore.getState().suggestedInstrumentId;
      expect(suggestedId).toBe('inst-123');
    });

    it('should update suggested instrument ID', () => {
      const store = useUIStore.getState();

      store.setSuggestedInstrument('inst-123');
      store.setSuggestedInstrument('inst-456');

      const suggestedId = useUIStore.getState().suggestedInstrumentId;
      expect(suggestedId).toBe('inst-456');
    });

    it('should set suggested instrument ID to null', () => {
      const store = useUIStore.getState();

      store.setSuggestedInstrument('inst-123');
      store.setSuggestedInstrument(null);

      const suggestedId = useUIStore.getState().suggestedInstrumentId;
      expect(suggestedId).toBeNull();
    });

    it('should not affect other state', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('test');
      store.setSuggestedInstrument('inst-123');

      const state = useUIStore.getState();
      expect(state.searchQuery).toBe('test');
      expect(state.suggestedInstrumentId).toBe('inst-123');
    });
  });

  describe('dialog state independence', () => {
    it('should allow both dialogs to be open simultaneously', () => {
      const store = useUIStore.getState();

      store.openAddInstrument();
      store.openEditInstrument('inst-123');

      const state = useUIStore.getState();
      expect(state.isAddInstrumentOpen).toBe(true);
      expect(state.isEditInstrumentOpen).toBe(true);
    });

    it('should close dialogs independently', () => {
      const store = useUIStore.getState();

      store.openAddInstrument();
      store.openEditInstrument('inst-123');
      store.closeAddInstrument();

      const state = useUIStore.getState();
      expect(state.isAddInstrumentOpen).toBe(false);
      expect(state.isEditInstrumentOpen).toBe(true);
      expect(state.editingInstrumentId).toBe('inst-123');
    });
  });

  describe('combined filter operations', () => {
    it('should handle multiple filter types simultaneously', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('reverb');
      store.toggleTag('orchestral');
      store.toggleTag('strings');
      store.toggleCategory('Effects');
      store.toggleCategory('Synth');
      store.toggleHost('VST3');

      const state = useUIStore.getState();
      expect(state.searchQuery).toBe('reverb');
      expect(state.selectedTags).toEqual(['orchestral', 'strings']);
      expect(state.selectedCategories).toEqual(['Effects', 'Synth']);
      expect(state.selectedHosts).toEqual(['VST3']);
    });

    it('should clear all filters regardless of count', () => {
      const store = useUIStore.getState();

      store.setSearchQuery('reverb');
      store.toggleTag('orchestral');
      store.toggleTag('strings');
      store.toggleTag('brass');
      store.toggleCategory('Effects');
      store.toggleCategory('Synth');
      store.toggleCategory('Drums');
      store.toggleHost('VST3');
      store.toggleHost('Kontakt');

      store.clearFilters();

      const state = useUIStore.getState();
      expect(state.searchQuery).toBe('');
      expect(state.selectedTags).toHaveLength(0);
      expect(state.selectedCategories).toHaveLength(0);
      expect(state.selectedHosts).toHaveLength(0);
    });
  });
});
