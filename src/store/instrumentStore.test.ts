import { describe, it, expect, beforeEach } from 'vitest';
import { useInstrumentStore } from './instrumentStore';

describe('instrumentStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useInstrumentStore.setState({ instruments: [] });
  });

  describe('addInstrument', () => {
    it('should add instrument with generated ID and defaults', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test Synth',
        developer: 'Acme',
        host: 'VST3',
        category: 'Synth',
        tags: ['analog', 'warm'],
        notes: 'Great sound',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments).toHaveLength(1);

      const instrument = instruments[0];
      expect(instrument.id).toBe('test-uuid-1');
      expect(instrument.name).toBe('Test Synth');
      expect(instrument.developer).toBe('Acme');
      expect(instrument.host).toBe('VST3');
      expect(instrument.category).toBe('Synth');
      expect(instrument.tags).toEqual(['analog', 'warm']);
      expect(instrument.notes).toBe('Great sound');
      expect(instrument.color).toBe('#8b5cf6'); // Synth color
      expect(instrument.pairings).toEqual([]);
      expect(instrument.position).toBeDefined();
      expect(instrument.metadata.usageCount).toBe(0);
      expect(instrument.metadata.createdAt).toBeInstanceOf(Date);
    });

    it('should assign default color for unknown category', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Other',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instrument = useInstrumentStore.getState().instruments[0];
      expect(instrument.color).toBe('#6b7280'); // Other color
    });

    it('should assign correct colors for different categories', () => {
      const store = useInstrumentStore.getState();
      const categories = [
        { category: 'Orchestral' as const, color: '#3b82f6' },
        { category: 'Drums' as const, color: '#ef4444' },
        { category: 'Effects' as const, color: '#10b981' },
        { category: 'Keys' as const, color: '#f59e0b' },
        { category: 'World' as const, color: '#ec4899' },
        { category: 'Vocal' as const, color: '#06b6d4' },
      ];

      categories.forEach(({ category, color }) => {
        useInstrumentStore.setState({ instruments: [] });
        store.addInstrument({
          name: 'Test',
          developer: 'Test',
          host: 'VST3',
          category,
          tags: [],
          notes: '',
          color,
          pairings: [],
        });
        const instrument = useInstrumentStore.getState().instruments[0];
        expect(instrument.color).toBe(color);
      });
    });

    it('should generate random positions within bounds', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instrument = useInstrumentStore.getState().instruments[0];
      expect(instrument.position.x).toBeGreaterThanOrEqual(0);
      expect(instrument.position.x).toBeLessThanOrEqual(800);
      expect(instrument.position.y).toBeGreaterThanOrEqual(0);
      expect(instrument.position.y).toBeLessThanOrEqual(600);
    });
  });

  describe('updateInstrument', () => {
    it('should update instrument with partial data', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;

      store.updateInstrument(id, {
        name: 'Updated Name',
        notes: 'Updated notes',
      });

      const updated = useInstrumentStore.getState().instruments[0];
      expect(updated.name).toBe('Updated Name');
      expect(updated.notes).toBe('Updated notes');
      expect(updated.developer).toBe('Test'); // Unchanged
    });

    it('should not modify other instruments', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const firstId = useInstrumentStore.getState().instruments[0].id;

      store.updateInstrument(firstId, { name: 'Updated' });

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments[0].name).toBe('Updated');
      expect(instruments[1].name).toBe('Second');
    });

    it('should handle updating non-existent instrument gracefully', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.updateInstrument('non-existent-id', { name: 'Updated' });

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments).toHaveLength(1);
      expect(instruments[0].name).toBe('Test');
    });
  });

  describe('deleteInstrument', () => {
    it('should delete instrument by id', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;
      store.deleteInstrument(id);

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments).toHaveLength(0);
    });

    it('should remove pairings when deleting instrument', () => {
      const store = useInstrumentStore.getState();

      // Add two instruments
      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      const id1 = instruments[0].id;
      const id2 = instruments[1].id;

      // Create pairing
      store.createPairing(id1, id2);

      // Verify pairing exists
      let updatedInstruments = useInstrumentStore.getState().instruments;
      expect(updatedInstruments[0].pairings).toContain(id2);
      expect(updatedInstruments[1].pairings).toContain(id1);

      // Delete first instrument
      store.deleteInstrument(id1);

      // Verify second instrument's pairing is cleaned up
      updatedInstruments = useInstrumentStore.getState().instruments;
      expect(updatedInstruments).toHaveLength(1);
      expect(updatedInstruments[0].pairings).not.toContain(id1);
      expect(updatedInstruments[0].pairings).toHaveLength(0);
    });

    it('should handle deleting non-existent instrument', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.deleteInstrument('non-existent-id');

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments).toHaveLength(1);
    });
  });

  describe('getInstrument', () => {
    it('should retrieve instrument by id', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;
      const instrument = store.getInstrument(id);

      expect(instrument).toBeDefined();
      expect(instrument?.name).toBe('Test');
    });

    it('should return undefined for non-existent id', () => {
      const store = useInstrumentStore.getState();
      const instrument = store.getInstrument('non-existent-id');
      expect(instrument).toBeUndefined();
    });
  });

  describe('createPairing', () => {
    it('should create bidirectional pairing between two instruments', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      const id1 = instruments[0].id;
      const id2 = instruments[1].id;

      store.createPairing(id1, id2);

      const updated = useInstrumentStore.getState().instruments;
      expect(updated[0].pairings).toContain(id2);
      expect(updated[1].pairings).toContain(id1);
    });

    it('should prevent self-pairing', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;
      store.createPairing(id, id);

      const instrument = useInstrumentStore.getState().instruments[0];
      expect(instrument.pairings).toHaveLength(0);
    });

    it('should prevent duplicate pairings', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      const id1 = instruments[0].id;
      const id2 = instruments[1].id;

      store.createPairing(id1, id2);
      store.createPairing(id1, id2); // Attempt duplicate

      const updated = useInstrumentStore.getState().instruments;
      expect(updated[0].pairings).toHaveLength(1);
      expect(updated[1].pairings).toHaveLength(1);
    });
  });

  describe('removePairing', () => {
    it('should remove bidirectional pairing', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      const id1 = instruments[0].id;
      const id2 = instruments[1].id;

      store.createPairing(id1, id2);
      store.removePairing(id1, id2);

      const updated = useInstrumentStore.getState().instruments;
      expect(updated[0].pairings).not.toContain(id2);
      expect(updated[1].pairings).not.toContain(id1);
    });

    it('should handle removing non-existent pairing', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const instruments = useInstrumentStore.getState().instruments;
      const id1 = instruments[0].id;
      const id2 = instruments[1].id;

      store.removePairing(id1, id2); // No pairing exists

      const updated = useInstrumentStore.getState().instruments;
      expect(updated[0].pairings).toHaveLength(0);
      expect(updated[1].pairings).toHaveLength(0);
    });
  });

  describe('markAsUsed', () => {
    it('should increment usage count and set lastUsed timestamp', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;

      const beforeUsage = new Date();
      store.markAsUsed(id);
      const afterUsage = new Date();

      const instrument = useInstrumentStore.getState().instruments[0];
      expect(instrument.metadata.usageCount).toBe(1);
      expect(instrument.metadata.lastUsed).toBeInstanceOf(Date);
      expect(instrument.metadata.lastUsed!.getTime()).toBeGreaterThanOrEqual(beforeUsage.getTime());
      expect(instrument.metadata.lastUsed!.getTime()).toBeLessThanOrEqual(afterUsage.getTime());
    });

    it('should increment usage count on multiple calls', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const id = useInstrumentStore.getState().instruments[0].id;

      store.markAsUsed(id);
      store.markAsUsed(id);
      store.markAsUsed(id);

      const instrument = useInstrumentStore.getState().instruments[0];
      expect(instrument.metadata.usageCount).toBe(3);
    });

    it('should not modify other instruments', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'First',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      store.addInstrument({
        name: 'Second',
        developer: 'Test',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      const firstId = useInstrumentStore.getState().instruments[0].id;

      store.markAsUsed(firstId);

      const instruments = useInstrumentStore.getState().instruments;
      expect(instruments[0].metadata.usageCount).toBe(1);
      expect(instruments[1].metadata.usageCount).toBe(0);
      expect(instruments[1].metadata.lastUsed).toBeUndefined();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist instruments to localStorage on add', () => {
      const store = useInstrumentStore.getState();

      store.addInstrument({
        name: 'Test',
        developer: 'Test',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        color: '#3B82F6',
        pairings: [],
      });

      // Zustand persist middleware handles serialization
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
