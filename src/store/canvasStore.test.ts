import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCanvasStore } from './canvasStore';
import type { Instrument, InstrumentGroup } from '@/types';

// Mock React Flow utilities
vi.mock('reactflow', () => ({
  applyNodeChanges: vi.fn((_changes, nodes) => nodes),
  applyEdgeChanges: vi.fn((_changes, edges) => edges),
  addEdge: vi.fn((connection, edges) => {
    const newEdge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: 'default',
    };
    return [...edges, newEdge];
  }),
}));

// Import the mocked functions
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

describe('canvasStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      selectedNodeIds: [],
    });
    vi.clearAllMocks();
  });

  describe('onNodesChange', () => {
    it('should call applyNodeChanges with changes', () => {
      const store = useCanvasStore.getState();

      const changes = [{ id: 'node-1', type: 'position', position: { x: 100, y: 200 } }];
      store.onNodesChange(changes as any);

      expect(applyNodeChanges).toHaveBeenCalledWith(changes, []);
    });

    it('should update nodes state', () => {
      (applyNodeChanges as ReturnType<typeof vi.fn>).mockReturnValueOnce([
        { id: 'node-1', position: { x: 100, y: 200 }, data: {} },
      ]);

      const store = useCanvasStore.getState();
      const changes = [{ id: 'node-1', type: 'position', position: { x: 100, y: 200 } }];
      store.onNodesChange(changes as any);

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(1);
    });
  });

  describe('onEdgesChange', () => {
    it('should call applyEdgeChanges with changes', () => {
      const store = useCanvasStore.getState();

      const changes = [{ id: 'edge-1', type: 'remove' }];
      store.onEdgesChange(changes as any);

      expect(applyEdgeChanges).toHaveBeenCalledWith(changes, []);
    });

    it('should update edges state', () => {
      (applyEdgeChanges as ReturnType<typeof vi.fn>).mockReturnValueOnce([
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
      ]);

      const store = useCanvasStore.getState();
      const changes = [{ id: 'edge-1', type: 'add' }];
      store.onEdgesChange(changes as any);

      const edges = useCanvasStore.getState().edges;
      expect(edges).toHaveLength(1);
    });
  });

  describe('onConnect', () => {
    it('should call addEdge with connection', () => {
      const store = useCanvasStore.getState();

      const connection = {
        source: 'node-1',
        target: 'node-2',
        sourceHandle: null,
        targetHandle: null,
      };
      store.onConnect(connection);

      expect(addEdge).toHaveBeenCalledWith(connection, []);
    });

    it('should add new edge to state', () => {
      (addEdge as ReturnType<typeof vi.fn>).mockReturnValueOnce([
        { id: 'enode-1-node-2', source: 'node-1', target: 'node-2' },
      ]);

      const store = useCanvasStore.getState();
      const connection = {
        source: 'node-1',
        target: 'node-2',
        sourceHandle: null,
        targetHandle: null,
      };
      store.onConnect(connection);

      const edges = useCanvasStore.getState().edges;
      expect(edges).toHaveLength(1);
      expect(edges[0].source).toBe('node-1');
      expect(edges[0].target).toBe('node-2');
    });
  });

  describe('setSelectedNodeIds', () => {
    it('should set selected node IDs', () => {
      const store = useCanvasStore.getState();

      store.setSelectedNodeIds(['node-1', 'node-2']);

      const selectedIds = useCanvasStore.getState().selectedNodeIds;
      expect(selectedIds).toEqual(['node-1', 'node-2']);
    });

    it('should replace previous selection', () => {
      const store = useCanvasStore.getState();

      store.setSelectedNodeIds(['node-1']);
      store.setSelectedNodeIds(['node-2', 'node-3']);

      const selectedIds = useCanvasStore.getState().selectedNodeIds;
      expect(selectedIds).toEqual(['node-2', 'node-3']);
    });

    it('should accept empty array', () => {
      const store = useCanvasStore.getState();

      store.setSelectedNodeIds(['node-1']);
      store.setSelectedNodeIds([]);

      const selectedIds = useCanvasStore.getState().selectedNodeIds;
      expect(selectedIds).toEqual([]);
    });
  });

  describe('updateNodePosition', () => {
    it('should update node position', () => {
      useCanvasStore.setState({
        nodes: [
          { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
          { id: 'node-2', position: { x: 100, y: 100 }, data: {} },
        ],
      });

      const store = useCanvasStore.getState();
      store.updateNodePosition('node-1', { x: 200, y: 300 });

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes[0].position).toEqual({ x: 200, y: 300 });
      expect(nodes[1].position).toEqual({ x: 100, y: 100 }); // Unchanged
    });

    it('should not modify other nodes', () => {
      useCanvasStore.setState({
        nodes: [
          { id: 'node-1', position: { x: 0, y: 0 }, data: { value: 'first' } },
          { id: 'node-2', position: { x: 100, y: 100 }, data: { value: 'second' } },
        ],
      });

      const store = useCanvasStore.getState();
      store.updateNodePosition('node-1', { x: 200, y: 300 });

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes[0].data.value).toBe('first');
      expect(nodes[1].data.value).toBe('second');
    });

    it('should handle updating non-existent node gracefully', () => {
      useCanvasStore.setState({
        nodes: [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }],
      });

      const store = useCanvasStore.getState();
      store.updateNodePosition('non-existent', { x: 200, y: 300 });

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].position).toEqual({ x: 0, y: 0 });
    });
  });

  describe('syncWithInstruments', () => {
    it('should create nodes from instruments', () => {
      const instruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Test Synth',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 100, y: 200 },
          pairings: [],
          color: '#8b5cf6',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
        {
          id: 'inst-2',
          name: 'Test Drums',
          developer: 'Acme',
          host: 'VST3',
          category: 'Drums',
          tags: [],
          notes: '',
          position: { x: 300, y: 400 },
          pairings: [],
          color: '#ef4444',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithInstruments(instruments);

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(2);
      expect(nodes[0].id).toBe('inst-1');
      expect(nodes[0].type).toBe('instrument');
      expect(nodes[0].position).toEqual({ x: 100, y: 200 });
      expect(nodes[0].data.instrument).toEqual(instruments[0]);
      expect(nodes[1].id).toBe('inst-2');
    });

    it('should create edges from pairings', () => {
      const instruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Test Synth',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 100, y: 200 },
          pairings: ['inst-2'],
          color: '#8b5cf6',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
        {
          id: 'inst-2',
          name: 'Test Drums',
          developer: 'Acme',
          host: 'VST3',
          category: 'Drums',
          tags: [],
          notes: '',
          position: { x: 300, y: 400 },
          pairings: ['inst-1'],
          color: '#ef4444',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithInstruments(instruments);

      const edges = useCanvasStore.getState().edges;
      expect(edges).toHaveLength(1);
      expect(edges[0].source).toBe('inst-1');
      expect(edges[0].target).toBe('inst-2');
      expect(edges[0].type).toBe('smoothstep');
    });

    it('should avoid duplicate edges for bidirectional pairings', () => {
      const instruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Test Synth',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 100, y: 200 },
          pairings: ['inst-2', 'inst-3'],
          color: '#8b5cf6',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
        {
          id: 'inst-2',
          name: 'Test Drums',
          developer: 'Acme',
          host: 'VST3',
          category: 'Drums',
          tags: [],
          notes: '',
          position: { x: 300, y: 400 },
          pairings: ['inst-1'],
          color: '#ef4444',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
        {
          id: 'inst-3',
          name: 'Test Keys',
          developer: 'Acme',
          host: 'VST3',
          category: 'Keys',
          tags: [],
          notes: '',
          position: { x: 500, y: 600 },
          pairings: ['inst-1'],
          color: '#f59e0b',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithInstruments(instruments);

      const edges = useCanvasStore.getState().edges;
      // Should have 2 edges: inst-1 to inst-2, inst-1 to inst-3
      // Not 4 edges (no duplicates for bidirectional pairings)
      expect(edges).toHaveLength(2);
    });

    it('should handle instruments with no pairings', () => {
      const instruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Test Synth',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 100, y: 200 },
          pairings: [],
          color: '#8b5cf6',
          metadata: { createdAt: new Date(), usageCount: 0 },
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithInstruments(instruments);

      const edges = useCanvasStore.getState().edges;
      expect(edges).toHaveLength(0);
    });

    it('should handle empty instruments array', () => {
      const store = useCanvasStore.getState();
      store.syncWithInstruments([]);

      const nodes = useCanvasStore.getState().nodes;
      const edges = useCanvasStore.getState().edges;
      expect(nodes).toHaveLength(0);
      expect(edges).toHaveLength(0);
    });
  });

  describe('syncWithGroups', () => {
    it('should create group nodes', () => {
      const groups: InstrumentGroup[] = [
        {
          id: 'group-1',
          name: 'Test Group',
          description: 'A test group',
          instruments: ['inst-1', 'inst-2'],
          position: { x: 100, y: 200 },
          color: '#ff0000',
          collapsed: false,
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithGroups(groups);

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].id).toBe('group-1');
      expect(nodes[0].type).toBe('group');
      expect(nodes[0].position).toEqual({ x: 100, y: 200 });
      expect(nodes[0].data.group).toEqual(groups[0]);
    });

    it('should preserve instrument nodes when syncing groups', () => {
      // First add instrument nodes
      useCanvasStore.setState({
        nodes: [
          { id: 'inst-1', type: 'instrument', position: { x: 0, y: 0 }, data: {} },
          { id: 'inst-2', type: 'instrument', position: { x: 100, y: 100 }, data: {} },
        ],
      });

      const groups: InstrumentGroup[] = [
        {
          id: 'group-1',
          name: 'Test Group',
          description: 'Test',
          instruments: [],
          position: { x: 200, y: 200 },
          color: '#ff0000',
          collapsed: false,
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithGroups(groups);

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(3); // 2 instruments + 1 group
      expect(nodes.filter((n) => n.type === 'instrument')).toHaveLength(2);
      expect(nodes.filter((n) => n.type === 'group')).toHaveLength(1);
    });

    it('should handle multiple groups', () => {
      const groups: InstrumentGroup[] = [
        {
          id: 'group-1',
          name: 'Group 1',
          description: 'First',
          instruments: [],
          position: { x: 0, y: 0 },
          color: '#ff0000',
          collapsed: false,
        },
        {
          id: 'group-2',
          name: 'Group 2',
          description: 'Second',
          instruments: [],
          position: { x: 200, y: 200 },
          color: '#00ff00',
          collapsed: false,
        },
      ];

      const store = useCanvasStore.getState();
      store.syncWithGroups(groups);

      const nodes = useCanvasStore.getState().nodes;
      const groupNodes = nodes.filter((n) => n.type === 'group');
      expect(groupNodes).toHaveLength(2);
    });

    it('should handle empty groups array', () => {
      // Start with some instrument nodes
      useCanvasStore.setState({
        nodes: [{ id: 'inst-1', type: 'instrument', position: { x: 0, y: 0 }, data: {} }],
      });

      const store = useCanvasStore.getState();
      store.syncWithGroups([]);

      const nodes = useCanvasStore.getState().nodes;
      expect(nodes).toHaveLength(1); // Only instrument node remains
      expect(nodes[0].type).toBe('instrument');
    });
  });

  describe('getConnectedNodeIds', () => {
    it('should return connected node IDs for a given node', () => {
      useCanvasStore.setState({
        edges: [
          { id: 'e1', source: 'node-1', target: 'node-2', type: 'default' },
          { id: 'e2', source: 'node-1', target: 'node-3', type: 'default' },
          { id: 'e3', source: 'node-4', target: 'node-5', type: 'default' },
        ],
      });

      const store = useCanvasStore.getState();
      const connected = store.getConnectedNodeIds('node-1');

      expect(connected).toHaveLength(2);
      expect(connected).toContain('node-2');
      expect(connected).toContain('node-3');
      expect(connected).not.toContain('node-4');
    });

    it('should return connected nodes for target edges', () => {
      useCanvasStore.setState({
        edges: [
          { id: 'e1', source: 'node-1', target: 'node-2', type: 'default' },
          { id: 'e2', source: 'node-3', target: 'node-2', type: 'default' },
        ],
      });

      const store = useCanvasStore.getState();
      const connected = store.getConnectedNodeIds('node-2');

      expect(connected).toHaveLength(2);
      expect(connected).toContain('node-1');
      expect(connected).toContain('node-3');
    });

    it('should return empty array for node with no connections', () => {
      useCanvasStore.setState({
        edges: [{ id: 'e1', source: 'node-1', target: 'node-2', type: 'default' }],
      });

      const store = useCanvasStore.getState();
      const connected = store.getConnectedNodeIds('node-3');

      expect(connected).toEqual([]);
    });

    it('should handle bidirectional connections', () => {
      useCanvasStore.setState({
        edges: [
          { id: 'e1', source: 'node-1', target: 'node-2', type: 'default' },
          { id: 'e2', source: 'node-2', target: 'node-1', type: 'default' },
        ],
      });

      const store = useCanvasStore.getState();
      const connected = store.getConnectedNodeIds('node-1');

      // Should return node-2 twice (once as target, once as source)
      expect(connected).toHaveLength(2);
      expect(connected.filter((id) => id === 'node-2')).toHaveLength(2);
    });

    it('should handle empty edges array', () => {
      useCanvasStore.setState({ edges: [] });

      const store = useCanvasStore.getState();
      const connected = store.getConnectedNodeIds('node-1');

      expect(connected).toEqual([]);
    });
  });
});
