# groupStore

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Zustand store managing instrument groups. Groups are visual containers on the canvas that can hold multiple instruments and be collapsed/expanded for organization.

## Dependencies

- `zustand` - State management
- `zustand/middleware` - Persist middleware for localStorage
- `@/types` - InstrumentGroup type definition

## Props/API

```typescript
interface GroupStore {
  /** All groups in the application */
  groups: InstrumentGroup[];
  
  /** Create a new group */
  addGroup: (group: Omit<InstrumentGroup, 'id'>) => void;
  
  /** Update group properties */
  updateGroup: (id: string, updates: Partial<InstrumentGroup>) => void;
  
  /** Delete a group */
  deleteGroup: (id: string) => void;
  
  /** Get a single group by ID */
  getGroup: (id: string) => InstrumentGroup | undefined;
  
  /** Toggle group collapsed state */
  toggleGroupCollapse: (id: string) => void;
  
  /** Add instrument to group */
  addInstrumentToGroup: (groupId: string, instrumentId: string) => void;
  
  /** Remove instrument from group */
  removeInstrumentFromGroup: (groupId: string, instrumentId: string) => void;
}
```

## Usage Example

```tsx
import { useGroupStore } from '@/store/groupStore';

function GroupManager() {
  const { groups, addGroup, toggleGroupCollapse } = useGroupStore();
  
  const handleCreateGroup = () => {
    addGroup({
      name: 'Orchestral',
      description: 'All orchestral instruments',
      color: '#3b82f6',
      instruments: [],
      position: { x: 100, y: 100 },
    });
  };
  
  return (
    <div>
      {groups.map(group => (
        <div key={group.id} onClick={() => toggleGroupCollapse(group.id)}>
          {group.name} ({group.instruments.length} instruments)
        </div>
      ))}
    </div>
  );
}
```

## State Management

**Persistence:** LocalStorage via Zustand persist middleware
**Storage Key:** `group-storage`

**State Structure:**
- `groups` - Array of InstrumentGroup objects
- Each group has unique ID, name, description, color, instruments array, position, and collapsed state

**Operations:**
- CRUD operations for groups
- Group collapse/expand
- Instrument membership management

## Related Components

- `GroupNode` - Renders groups on canvas
- `Canvas` - Displays groups and handles positioning
- `instrumentStore` - Related store for instruments within groups

## Future Enhancements

- [ ] Group nesting (groups within groups)
- [ ] Bulk operations (add multiple instruments at once)
- [ ] Group templates
- [ ] Auto-grouping by category/host
- [ ] Group color themes

