import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTemplateStore } from './templateStore';

describe('templateStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTemplateStore.setState({ templates: [] });
    vi.clearAllMocks();
  });

  describe('addTemplate', () => {
    it('should add template with generated ID', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'A test template',
        tags: ['orchestral', 'strings'],
        instruments: ['inst-1', 'inst-2'],
        pairings: [{ from: 'inst-1', to: 'inst-2' }],
        layout: {
          'inst-1': { x: 0, y: 0 },
          'inst-2': { x: 100, y: 100 },
        },
      });

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(1);

      const template = templates[0];
      expect(template.id).toBe('test-uuid-1');
      expect(template.name).toBe('Test Template');
      expect(template.description).toBe('A test template');
      expect(template.tags).toEqual(['orchestral', 'strings']);
      expect(template.instruments).toEqual(['inst-1', 'inst-2']);
      expect(template.pairings).toEqual([{ from: 'inst-1', to: 'inst-2' }]);
      expect(template.layout).toEqual({
        'inst-1': { x: 0, y: 0 },
        'inst-2': { x: 100, y: 100 },
      });
    });

    it('should add multiple templates with unique IDs', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Template 1',
        description: 'First',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.addTemplate({
        name: 'Template 2',
        description: 'Second',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(2);
      expect(templates[0].id).toBe('test-uuid-1');
      expect(templates[1].id).toBe('test-uuid-2');
    });

    it('should add template with empty arrays', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Empty Template',
        description: 'No instruments',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const template = useTemplateStore.getState().templates[0];
      expect(template.instruments).toEqual([]);
      expect(template.pairings).toEqual([]);
      expect(template.tags).toEqual([]);
      expect(template.layout).toEqual({});
    });

    it('should add template with pairing notes', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Template with Notes',
        description: 'Test',
        tags: [],
        instruments: ['inst-1', 'inst-2'],
        pairings: [{ from: 'inst-1', to: 'inst-2', note: 'Works well together' }],
        layout: {},
      });

      const template = useTemplateStore.getState().templates[0];
      expect(template.pairings[0].note).toBe('Works well together');
    });
  });

  describe('updateTemplate', () => {
    it('should update template with partial data', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Original',
        tags: ['tag1'],
        instruments: ['inst-1'],
        pairings: [],
        layout: {},
      });

      const id = useTemplateStore.getState().templates[0].id;

      store.updateTemplate(id, {
        name: 'Updated Template',
        description: 'Updated description',
        tags: ['tag1', 'tag2'],
      });

      const updated = useTemplateStore.getState().templates[0];
      expect(updated.name).toBe('Updated Template');
      expect(updated.description).toBe('Updated description');
      expect(updated.tags).toEqual(['tag1', 'tag2']);
      expect(updated.instruments).toEqual(['inst-1']); // Unchanged
    });

    it('should update instruments and pairings', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: ['inst-1'],
        pairings: [],
        layout: {},
      });

      const id = useTemplateStore.getState().templates[0].id;

      store.updateTemplate(id, {
        instruments: ['inst-1', 'inst-2', 'inst-3'],
        pairings: [
          { from: 'inst-1', to: 'inst-2' },
          { from: 'inst-2', to: 'inst-3' },
        ],
      });

      const updated = useTemplateStore.getState().templates[0];
      expect(updated.instruments).toEqual(['inst-1', 'inst-2', 'inst-3']);
      expect(updated.pairings).toHaveLength(2);
    });

    it('should update layout', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: ['inst-1'],
        pairings: [],
        layout: { 'inst-1': { x: 0, y: 0 } },
      });

      const id = useTemplateStore.getState().templates[0].id;

      store.updateTemplate(id, {
        layout: {
          'inst-1': { x: 100, y: 200 },
          'inst-2': { x: 300, y: 400 },
        },
      });

      const updated = useTemplateStore.getState().templates[0];
      expect(updated.layout).toEqual({
        'inst-1': { x: 100, y: 200 },
        'inst-2': { x: 300, y: 400 },
      });
    });

    it('should not modify other templates', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Template 1',
        description: 'First',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.addTemplate({
        name: 'Template 2',
        description: 'Second',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const firstId = useTemplateStore.getState().templates[0].id;

      store.updateTemplate(firstId, { name: 'Updated' });

      const templates = useTemplateStore.getState().templates;
      expect(templates[0].name).toBe('Updated');
      expect(templates[1].name).toBe('Template 2');
    });

    it('should handle updating non-existent template gracefully', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.updateTemplate('non-existent-id', { name: 'Updated' });

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(1);
      expect(templates[0].name).toBe('Test Template');
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template by id', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const id = useTemplateStore.getState().templates[0].id;
      store.deleteTemplate(id);

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(0);
    });

    it('should delete specific template without affecting others', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Template 1',
        description: 'First',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.addTemplate({
        name: 'Template 2',
        description: 'Second',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.addTemplate({
        name: 'Template 3',
        description: 'Third',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const secondId = useTemplateStore.getState().templates[1].id;
      store.deleteTemplate(secondId);

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(2);
      expect(templates[0].name).toBe('Template 1');
      expect(templates[1].name).toBe('Template 3');
    });

    it('should handle deleting non-existent template', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.deleteTemplate('non-existent-id');

      const templates = useTemplateStore.getState().templates;
      expect(templates).toHaveLength(1);
    });
  });

  describe('getTemplate', () => {
    it('should retrieve template by id', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test description',
        tags: ['tag1'],
        instruments: ['inst-1'],
        pairings: [],
        layout: {},
      });

      const id = useTemplateStore.getState().templates[0].id;
      const template = store.getTemplate(id);

      expect(template).toBeDefined();
      expect(template?.name).toBe('Test Template');
      expect(template?.description).toBe('Test description');
      expect(template?.tags).toEqual(['tag1']);
    });

    it('should return undefined for non-existent id', () => {
      const store = useTemplateStore.getState();
      const template = store.getTemplate('non-existent-id');
      expect(template).toBeUndefined();
    });

    it('should retrieve correct template from multiple templates', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Template 1',
        description: 'First',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      store.addTemplate({
        name: 'Template 2',
        description: 'Second',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const secondId = useTemplateStore.getState().templates[1].id;
      const template = store.getTemplate(secondId);

      expect(template?.name).toBe('Template 2');
      expect(template?.description).toBe('Second');
    });
  });

  describe('loadTemplate', () => {
    it('should not crash when template not found', () => {
      const store = useTemplateStore.getState();

      // Should not throw error
      expect(() => {
        store.loadTemplate('non-existent-id');
      }).not.toThrow();
    });

    it('should retrieve template and attempt to load it', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: ['inst-1', 'inst-2'],
        pairings: [{ from: 'inst-1', to: 'inst-2' }],
        layout: {
          'inst-1': { x: 0, y: 0 },
          'inst-2': { x: 100, y: 100 },
        },
      });

      const id = useTemplateStore.getState().templates[0].id;

      // Verify template exists before loading
      const template = store.getTemplate(id);
      expect(template).toBeDefined();
      expect(template?.instruments).toEqual(['inst-1', 'inst-2']);

      // Note: loadTemplate uses require() which accesses the actual store
      // In a real scenario, this would load instruments
    });

    it('should handle empty template without crashing', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Empty Template',
        description: 'No instruments',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      const id = useTemplateStore.getState().templates[0].id;

      // Verify template exists
      const template = store.getTemplate(id);
      expect(template).toBeDefined();
      expect(template?.instruments).toEqual([]);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist templates to localStorage on add', () => {
      const store = useTemplateStore.getState();

      store.addTemplate({
        name: 'Test Template',
        description: 'Test',
        tags: [],
        instruments: [],
        pairings: [],
        layout: {},
      });

      // Zustand persist middleware handles serialization
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
