# Rarity Utility

**Last Updated:** 2025-12-24 - Created for interactive cards with usage-based rarity

## Purpose

Pure utility function that calculates visual rarity tiers for instrument cards based on usage count. This enables the card collection interface to provide visual feedback about which instruments are frequently used vs. forgotten gems.

## Dependencies

None - this is a pure function with no dependencies.

## API

```typescript
export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

export function getRarityTier(usageCount: number): RarityTier
```

### Parameters

- `usageCount: number` - The number of times the instrument has been marked as used (from `instrument.metadata.usageCount`)

### Returns

- `RarityTier` - One of: `'common'`, `'rare'`, `'epic'`, or `'legendary'`

## Rarity Tiers

| Tier | Usage Count | Visual Effect |
|------|-------------|---------------|
| **Common** | 0-4 | Standard appearance (no special effects) |
| **Rare** | 5-19 | Blue border highlight |
| **Epic** | 20-49 | Purple glow effect with pulse animation |
| **Legendary** | 50+ | Gold shimmer animation, gold border, subtle glow |

## Usage Example

```typescript
import { getRarityTier } from '@/lib/rarity';
import { useInstrumentStore } from '@/store/instrumentStore';

function MyComponent() {
  const instrument = useInstrumentStore((state) => 
    state.getInstrument('some-id')
  );
  
  const rarity = getRarityTier(instrument?.metadata.usageCount || 0);
  
  // rarity will be 'common', 'rare', 'epic', or 'legendary'
  return <div className={`card rarity${rarity}`}>...</div>;
}
```

## Implementation Details

- **Pure Function**: No side effects, no state, easily testable
- **Threshold-Based**: Simple if/else logic for performance
- **Type-Safe**: TypeScript ensures only valid tier strings are returned
- **Synchronous**: No async operations, instant calculation

## Testing

The function should be tested with:
- Edge cases: 0, 4, 5, 19, 20, 49, 50, 100+
- Negative numbers (should default to 'common')
- Very large numbers (should return 'legendary')

## Related Components

- `InstrumentCard` - Uses this function to determine visual styling
- `InstrumentCard.module.css` - Contains CSS classes for each rarity tier
- `instrumentStore.markAsUsed()` - Updates usage count that feeds into this function

## Future Enhancements

- Time-based decay (instruments unused for 6+ months get "dusty")
- Per-category rarity (separate tiers for different categories)
- Context-aware rarity (per-genre or per-project-type usage)

