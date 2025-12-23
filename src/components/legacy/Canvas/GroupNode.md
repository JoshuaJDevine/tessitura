# GroupNode

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Custom React Flow node component that renders visual group containers on the canvas. Groups can contain multiple instruments and can be collapsed/expanded to manage canvas organization.

## Dependencies

- `reactflow` - React Flow node component and types
- `@/types` - InstrumentGroup type definition
- `@/store/groupStore` - Group state management
- `@/components/ui/badge` - Badge component for instrument count
- `lucide-react` - Icons for collapse/expand
- `@/lib/utils` - cn utility for class names

## Props/API

```typescript
interface GroupNodeData {
  /** The group data to display */
  group: InstrumentGroup;
  /** Whether the group is highlighted (e.g., from search) */
  isHighlighted?: boolean;
  /** Whether the group is selected */
  isSelected?: boolean;
}

// Receives NodeProps from React Flow
type GroupNodeProps = NodeProps<GroupNodeData>;
```

## Usage Example

```tsx
// Used automatically by React Flow when rendering group nodes
import { GroupNode } from '@/components/Canvas/GroupNode';

// Register as custom node type in Canvas
const nodeTypes = {
  group: GroupNode,
  instrument: InstrumentNode,
};

<ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} />
```

## State Management

**No internal state.** Reads from:
- `useGroupStore` - For toggle collapse action

**Visual state** (highlighting, selection) comes from props passed by React Flow.

## Related Components

- `Canvas` - Parent component that renders groups
- `InstrumentNode` - Sibling node type for instruments
- `groupStore` - Manages group data and operations

## Future Enhancements

- [ ] Drag to resize group boundaries
- [ ] Visual indication of contained instruments
- [ ] Group nesting support
- [ ] Custom group icons

