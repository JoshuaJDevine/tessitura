import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Instrument } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ContextMenu } from '@/components/ContextMenu';
import { cn } from '@/lib/utils';

interface InstrumentNodeData {
  instrument: Instrument;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

const hostColors: Record<string, string> = {
  Kontakt: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Standalone: 'bg-green-500/20 text-green-400 border-green-500/50',
  VST3: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  AU: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  Soundbox: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  SINE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  Opus: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

export const InstrumentNode = memo(({ data, selected }: NodeProps<InstrumentNodeData>) => {
  const { instrument, isHighlighted } = data;
  const hostColorClass = hostColors[instrument.host] || hostColors.Other;

  return (
    <ContextMenu instrumentId={instrument.id}>
      <div
        className={cn(
          'min-w-[200px] rounded-lg border-2 bg-card p-3 shadow-lg transition-all cursor-pointer animate-fade-in',
          'hover:shadow-xl hover:scale-105',
          selected && 'ring-2 ring-primary ring-offset-2',
          isHighlighted && 'ring-2 ring-yellow-500 ring-offset-2 animate-pulse',
          !selected && !isHighlighted && 'border-border'
        )}
        style={{ borderColor: instrument.color }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Handle type="target" position={Position.Top} />
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className={cn('text-xs', hostColorClass)}>
              {instrument.host}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-sm leading-tight">{instrument.name}</h3>
          
          <p className="text-xs text-muted-foreground">{instrument.developer}</p>
          
          {instrument.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {instrument.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {instrument.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{instrument.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <Handle type="source" position={Position.Bottom} />
      </div>
    </ContextMenu>
  );
});

InstrumentNode.displayName = 'InstrumentNode';

