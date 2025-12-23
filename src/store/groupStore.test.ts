import { describe, it, expect, beforeEach } from 'vitest';
import { useGroupStore } from './groupStore';

describe('groupStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGroupStore.setState({ groups: [] });
  });

  describe('addGroup', () => {
    it('should add group with generated ID and defaults', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'A test group',
        instruments: ['inst-1', 'inst-2'],
        position: { x: 100, y: 200 },
        color: '#ff0000',
        collapsed: false,
      });

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(1);

      const group = groups[0];
      expect(group.id).toBe('test-uuid-1');
      expect(group.name).toBe('Test Group');
      expect(group.description).toBe('A test group');
      expect(group.instruments).toEqual(['inst-1', 'inst-2']);
      expect(group.position).toEqual({ x: 100, y: 200 });
      expect(group.color).toBe('#ff0000');
      expect(group.collapsed).toBe(false);
    });

    it('should add multiple groups with unique IDs', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First group',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second group',
        instruments: [],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(2);
      expect(groups[0].id).toBe('test-uuid-1');
      expect(groups[1].id).toBe('test-uuid-2');
    });

    it('should add group with empty instruments array', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Empty Group',
        description: 'No instruments',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual([]);
    });
  });

  describe('updateGroup', () => {
    it('should update group with partial data', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Original description',
        instruments: ['inst-1'],
        position: { x: 100, y: 200 },
        color: '#ff0000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;

      store.updateGroup(id, {
        name: 'Updated Group',
        description: 'Updated description',
      });

      const updated = useGroupStore.getState().groups[0];
      expect(updated.name).toBe('Updated Group');
      expect(updated.description).toBe('Updated description');
      expect(updated.color).toBe('#ff0000'); // Unchanged
      expect(updated.position).toEqual({ x: 100, y: 200 }); // Unchanged
    });

    it('should update position', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;

      store.updateGroup(id, {
        position: { x: 500, y: 300 },
      });

      const updated = useGroupStore.getState().groups[0];
      expect(updated.position).toEqual({ x: 500, y: 300 });
    });

    it('should not modify other groups', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second',
        instruments: [],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      const firstId = useGroupStore.getState().groups[0].id;

      store.updateGroup(firstId, { name: 'Updated' });

      const groups = useGroupStore.getState().groups;
      expect(groups[0].name).toBe('Updated');
      expect(groups[1].name).toBe('Group 2');
    });

    it('should handle updating non-existent group gracefully', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      store.updateGroup('non-existent-id', { name: 'Updated' });

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(1);
      expect(groups[0].name).toBe('Test Group');
    });
  });

  describe('deleteGroup', () => {
    it('should delete group by id', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;
      store.deleteGroup(id);

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(0);
    });

    it('should delete specific group without affecting others', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second',
        instruments: [],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 3',
        description: 'Third',
        instruments: [],
        position: { x: 200, y: 200 },
        color: '#0000ff',
        collapsed: false,
      });

      const secondId = useGroupStore.getState().groups[1].id;
      store.deleteGroup(secondId);

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(2);
      expect(groups[0].name).toBe('Group 1');
      expect(groups[1].name).toBe('Group 3');
    });

    it('should handle deleting non-existent group', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      store.deleteGroup('non-existent-id');

      const groups = useGroupStore.getState().groups;
      expect(groups).toHaveLength(1);
    });
  });

  describe('getGroup', () => {
    it('should retrieve group by id', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: ['inst-1'],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;
      const group = store.getGroup(id);

      expect(group).toBeDefined();
      expect(group?.name).toBe('Test Group');
      expect(group?.instruments).toEqual(['inst-1']);
    });

    it('should return undefined for non-existent id', () => {
      const store = useGroupStore.getState();
      const group = store.getGroup('non-existent-id');
      expect(group).toBeUndefined();
    });
  });

  describe('toggleGroupCollapse', () => {
    it('should toggle collapsed state from false to true', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;

      expect(useGroupStore.getState().groups[0].collapsed).toBe(false);

      store.toggleGroupCollapse(id);

      expect(useGroupStore.getState().groups[0].collapsed).toBe(true);
    });

    it('should toggle collapsed state from true to false', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const id = useGroupStore.getState().groups[0].id;

      store.toggleGroupCollapse(id);
      store.toggleGroupCollapse(id);

      expect(useGroupStore.getState().groups[0].collapsed).toBe(false);
    });

    it('should only toggle specified group', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second',
        instruments: [],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      const firstId = useGroupStore.getState().groups[0].id;

      store.toggleGroupCollapse(firstId);

      const groups = useGroupStore.getState().groups;
      expect(groups[0].collapsed).toBe(true);
      expect(groups[1].collapsed).toBe(false);
    });
  });

  describe('addInstrumentToGroup', () => {
    it('should add instrument to group', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.addInstrumentToGroup(groupId, 'inst-1');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toContain('inst-1');
      expect(group.instruments).toHaveLength(1);
    });

    it('should add multiple instruments to group', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.addInstrumentToGroup(groupId, 'inst-1');
      store.addInstrumentToGroup(groupId, 'inst-2');
      store.addInstrumentToGroup(groupId, 'inst-3');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual(['inst-1', 'inst-2', 'inst-3']);
    });

    it('should prevent duplicate instruments', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: ['inst-1'],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.addInstrumentToGroup(groupId, 'inst-1');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual(['inst-1']);
      expect(group.instruments).toHaveLength(1);
    });

    it('should not modify other groups', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second',
        instruments: [],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      const firstId = useGroupStore.getState().groups[0].id;

      store.addInstrumentToGroup(firstId, 'inst-1');

      const groups = useGroupStore.getState().groups;
      expect(groups[0].instruments).toContain('inst-1');
      expect(groups[1].instruments).toHaveLength(0);
    });

    it('should handle adding to non-existent group gracefully', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      store.addInstrumentToGroup('non-existent-id', 'inst-1');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toHaveLength(0);
    });
  });

  describe('removeInstrumentFromGroup', () => {
    it('should remove instrument from group', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: ['inst-1', 'inst-2', 'inst-3'],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.removeInstrumentFromGroup(groupId, 'inst-2');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual(['inst-1', 'inst-3']);
      expect(group.instruments).not.toContain('inst-2');
    });

    it('should handle removing non-existent instrument', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: ['inst-1', 'inst-2'],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.removeInstrumentFromGroup(groupId, 'inst-3');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual(['inst-1', 'inst-2']);
    });

    it('should handle removing from empty instruments array', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      const groupId = useGroupStore.getState().groups[0].id;

      store.removeInstrumentFromGroup(groupId, 'inst-1');

      const group = useGroupStore.getState().groups[0];
      expect(group.instruments).toEqual([]);
    });

    it('should not modify other groups', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Group 1',
        description: 'First',
        instruments: ['inst-1', 'inst-2'],
        position: { x: 0, y: 0 },
        color: '#ff0000',
        collapsed: false,
      });

      store.addGroup({
        name: 'Group 2',
        description: 'Second',
        instruments: ['inst-1', 'inst-2'],
        position: { x: 100, y: 100 },
        color: '#00ff00',
        collapsed: false,
      });

      const firstId = useGroupStore.getState().groups[0].id;

      store.removeInstrumentFromGroup(firstId, 'inst-1');

      const groups = useGroupStore.getState().groups;
      expect(groups[0].instruments).toEqual(['inst-2']);
      expect(groups[1].instruments).toEqual(['inst-1', 'inst-2']);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist groups to localStorage on add', () => {
      const store = useGroupStore.getState();

      store.addGroup({
        name: 'Test Group',
        description: 'Test',
        instruments: [],
        position: { x: 0, y: 0 },
        color: '#000000',
        collapsed: false,
      });

      // Zustand persist middleware handles serialization
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
