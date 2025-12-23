import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { Instrument, InstrumentGroup } from '@/types';

interface CanvasStore {
  nodes: Node[];
  edges: Edge[];
  selectedNodeIds: string[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeIds: (ids: string[]) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  syncWithInstruments: (instruments: Instrument[]) => void;
  syncWithGroups: (groups: InstrumentGroup[]) => void;
  getConnectedNodeIds: (nodeId: string) => string[];
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setSelectedNodeIds: (ids) => {
    set({ selectedNodeIds: ids });
  },

  updateNodePosition: (id, position) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      ),
    });
  },

  syncWithInstruments: (instruments) => {
    const nodes: Node[] = instruments.map((inst) => ({
      id: inst.id,
      type: 'instrument',
      position: inst.position,
      data: { instrument: inst },
    }));

    const edges: Edge[] = [];
    instruments.forEach((inst) => {
      inst.pairings.forEach((pairId) => {
        // Only create edge once (avoid duplicates)
        if (inst.id < pairId) {
          edges.push({
            id: `e${inst.id}-${pairId}`,
            source: inst.id,
            target: pairId,
            type: 'smoothstep',
            animated: false,
          });
        }
      });
    });

    set({ nodes, edges });
  },

  syncWithGroups: (groups) => {
    const groupNodes: Node[] = groups.map((group) => ({
      id: group.id,
      type: 'group',
      position: group.position,
      data: { group },
    }));

    set((state) => {
      const instrumentNodes = state.nodes.filter((n) => n.type === 'instrument');
      return { nodes: [...instrumentNodes, ...groupNodes] };
    });
  },

  getConnectedNodeIds: (nodeId) => {
    const edges = get().edges;
    const connected: string[] = [];

    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        connected.push(edge.target);
      } else if (edge.target === nodeId) {
        connected.push(edge.source);
      }
    });

    return connected;
  },
}));

