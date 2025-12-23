import { Instrument } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import styles from './InstrumentCard.module.css';

interface InstrumentCardProps {
  instrument: Instrument;
  isSelected: boolean;
  viewDensity: 'compact' | 'spacious';
  onSelect: (id: string) => void;
}

const gradientMap: Record<string, string> = {
  Synth: styles.gradientSynth,
  Effects: styles.gradientEffect,
  Orchestral: styles.gradientOrchestral,
  Drums: styles.gradientDrum,
  Keys: styles.gradientKeys,
  World: styles.gradientWorld,
  Vocal: styles.gradientVocal,
  Other: styles.gradientOther,
};

export function InstrumentCard({
  instrument,
  isSelected,
  viewDensity,
  onSelect,
}: InstrumentCardProps) {
  const gradientClass = gradientMap[instrument.category] || styles.gradientOther;
  const isCompact = viewDensity === 'compact';

  return (
    <div
      className={cn(
        styles.card,
        gradientClass,
        'relative rounded-xl border border-white/10 p-6 flex flex-col justify-between',
        isCompact ? 'w-[200px] h-[280px]' : 'w-[250px] h-[350px]',
        isSelected && styles.cardSelected
      )}
      onClick={() => onSelect(instrument.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(instrument.id);
        }
      }}
      aria-label={`${instrument.name} by ${instrument.developer}`}
      aria-selected={isSelected}
    >
      {/* Category Badge - Top Right */}
      <div className="flex justify-end">
        <Badge
          variant="secondary"
          className="text-xs font-semibold uppercase bg-white/20 text-white border-white/30"
        >
          {instrument.category}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center mt-2">
        <h3 className={cn('font-bold text-white mb-2', isCompact ? 'text-lg' : 'text-xl')}>
          {instrument.name}
        </h3>
        <p className={cn('text-white/80', isCompact ? 'text-sm' : 'text-base')}>
          {instrument.developer}
        </p>
      </div>

      {/* Host Badge - Bottom Left */}
      <div className="flex justify-start mt-4">
        <Badge variant="outline" className="text-xs bg-black/20 text-white/90 border-white/20">
          {instrument.host}
        </Badge>
      </div>
    </div>
  );
}
