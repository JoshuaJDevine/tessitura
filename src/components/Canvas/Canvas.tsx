import { useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { InstrumentNode } from './InstrumentNode';
import { GroupNode } from './GroupNode';
import { useCanvasStore } from '@/store/canvasStore';
import { useInstrumentStore } from '@/store/instrumentStore';
import { useGroupStore } from '@/store/groupStore';
import { useUIStore } from '@/store/uiStore';
import { Instrument } from '@/types';

const nodeTypes: NodeTypes = {
  instrument: InstrumentNode,
  group: GroupNode,
};

function CanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    syncWithInstruments,
    getConnectedNodeIds,
    setSelectedNodeIds,
  } = useCanvasStore();
  
  const { instruments } = useInstrumentStore();
  const { groups } = useGroupStore();
  const { searchQuery, selectedTags, selectedCategories, selectedHosts, suggestedInstrumentId } = useUIStore();
  const { syncWithGroups } = useCanvasStore();

  // Sync canvas with instruments
  useEffect(() => {
    syncWithInstruments(instruments);
  }, [instruments, syncWithInstruments]);

  // Sync canvas with groups
  useEffect(() => {
    syncWithGroups(groups);
  }, [groups, syncWithGroups]);

  // Filter nodes based on search and filters
  const filteredNodes = nodes.map((node) => {
    const instrument = node.data.instrument as Instrument;
    const matchesSearch =
      !searchQuery ||
      instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => instrument.tags.includes(tag));

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(instrument.category);

    const matchesHost =
      selectedHosts.length === 0 || selectedHosts.includes(instrument.host);

    const isVisible =
      matchesSearch && matchesTags && matchesCategory && matchesHost;

    const isHighlighted = suggestedInstrumentId === instrument.id;
    const connectedIds = getConnectedNodeIds(instrument.id);
    const isConnectedHighlighted =
      suggestedInstrumentId && connectedIds.includes(suggestedInstrumentId);

    return {
      ...node,
      hidden: !isVisible,
      data: {
        ...node.data,
        isHighlighted: isHighlighted || isConnectedHighlighted,
      },
    };
  });

  // Update instrument position when node is dragged
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: any) => {
      const instrument = node.data.instrument as Instrument;
      useInstrumentStore.getState().updateInstrument(instrument.id, {
        position: node.position,
      });
    },
    []
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      const instrument = node.data.instrument as Instrument;
      const connectedIds = getConnectedNodeIds(instrument.id);
      setSelectedNodeIds([instrument.id, ...connectedIds]);
    },
    [getConnectedNodeIds, setSelectedNodeIds]
  );

  // Highlight connected nodes
  const highlightedEdges = useMemo(() => {
    const selectedIds = new Set(
      nodes.filter((n) => n.selected).map((n) => n.id)
    );
    
    return edges.map((edge) => {
      const sourceSelected = selectedIds.has(edge.source);
      const targetSelected = selectedIds.has(edge.target);
      
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: sourceSelected || targetSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          strokeWidth: sourceSelected || targetSelected ? 3 : 2,
        },
      };
    });
  }, [edges, nodes]);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={filteredNodes}
        edges={highlightedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="hsl(var(--muted))" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const instrument = node.data?.instrument as Instrument;
            return instrument?.color || 'hsl(var(--muted))';
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

