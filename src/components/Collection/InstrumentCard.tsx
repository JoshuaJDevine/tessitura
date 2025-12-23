import { useState, useCallback } from 'react';
import { Instrument } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRarityTier } from '@/lib/rarity';
import { InstrumentCardContextMenu } from './InstrumentCardContextMenu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Star, Check } from 'lucide-react';
import styles from './InstrumentCard.module.css';

interface InstrumentCardProps {
  instrument: Instrument;
  isSelected: boolean;
  viewDensity: 'compact' | 'spacious';
  onSelect: (id: string) => void;
  onMarkAsUsed?: (id: string) => void;
  showUsageBadge?: boolean;
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
  onMarkAsUsed,
  showUsageBadge = false,
}: InstrumentCardProps) {
  const gradientClass = gradientMap[instrument.category] || styles.gradientOther;
  const isCompact = viewDensity === 'compact';
  const rarity = getRarityTier(instrument.metadata.usageCount);
  const rarityClassMap: Record<string, string> = {
    common: (styles as Record<string, string>).rarityCommon || '',
    rare: (styles as Record<string, string>).rarityRare || '',
    epic: (styles as Record<string, string>).rarityEpic || '',
    legendary: (styles as Record<string, string>).rarityLegendary || '',
  };
  const rarityClass = rarityClassMap[rarity] || '';
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isMarkingAsUsed, setIsMarkingAsUsed] = useState(false);

  const handleMarkAsUsed = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onMarkAsUsed) {
        setIsMarkingAsUsed(true);
        onMarkAsUsed(instrument.id);
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setIsMarkingAsUsed(false);
        }, 400);
      }
    },
    [onMarkAsUsed, instrument.id]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <InstrumentCardContextMenu
      instrumentId={instrument.id}
      instrumentName={instrument.name}
      onMarkAsUsed={() => {
        if (onMarkAsUsed) {
          onMarkAsUsed(instrument.id);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            styles.card,
            gradientClass,
            rarityClass,
            'relative rounded-xl border border-white/10 p-6 flex flex-col justify-between',
            isCompact ? 'w-[200px] h-[280px]' : 'w-[250px] h-[350px]',
            isSelected && styles.cardSelected,
            showSuccessAnimation && ((styles as Record<string, string>).markAsUsedSuccess || '')
          )}
          onClick={() => onSelect(instrument.id)}
          onContextMenu={handleContextMenu}
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
          {/* Quick Action Button - Top Right */}
          {onMarkAsUsed && (
            <button
              className={(styles as Record<string, string>).quickActionButton || ''}
              onClick={handleMarkAsUsed}
              aria-label="Mark as used"
              title="Mark as used"
            >
              {isMarkingAsUsed ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <Star className="h-4 w-4 text-white" />
              )}
            </button>
          )}

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
          <div className="flex-1 flex flex-col justify-center mt-2 relative z-0">
            <h3 className={cn('font-bold text-white mb-2', isCompact ? 'text-lg' : 'text-xl')}>
              {instrument.name}
            </h3>
            <p className={cn('text-white/80', isCompact ? 'text-sm' : 'text-base')}>
              {instrument.developer}
            </p>
          </div>

          {/* Host Badge - Bottom Left */}
          <div className="flex justify-start mt-4 relative z-0">
            <Badge variant="outline" className="text-xs bg-black/20 text-white/90 border-white/20">
              {instrument.host}
            </Badge>
          </div>

          {/* Usage Count Badge - Bottom Right */}
          {showUsageBadge && instrument.metadata.usageCount > 0 && (
            <div className={(styles as Record<string, string>).usageBadge || ''}>
              {instrument.metadata.usageCount}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
    </InstrumentCardContextMenu>
  );
}
