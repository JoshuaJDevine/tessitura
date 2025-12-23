import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { InstrumentGroup } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGroupStore } from '@/store/groupStore';

interface GroupNodeData {
  group: InstrumentGroup;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export const GroupNode = memo(({ data, selected }: NodeProps<GroupNodeData>) => {
  const { group, isHighlighted } = data;
  const { toggleGroupCollapse } = useGroupStore();

  return (
    <div
      className={cn(
        'min-w-[300px] rounded-lg border-2 bg-card/50 p-4 shadow-lg backdrop-blur-sm transition-all',
        selected && 'ring-2 ring-primary ring-offset-2',
        isHighlighted && 'ring-2 ring-yellow-500 ring-offset-2',
        !selected && !isHighlighted && 'border-border'
      )}
      style={{ borderColor: group.color, backgroundColor: `${group.color}20` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleGroupCollapse(group.id)}
            className="hover:bg-accent rounded p-1"
          >
            {group.collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <h3 className="font-semibold text-base">{group.name}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {group.instruments.length} instruments
        </Badge>
      </div>
      
      {!group.collapsed && group.description && (
        <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
      )}
    </div>
  );
});

GroupNode.displayName = 'GroupNode';

