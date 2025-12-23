# InstrumentCard

**Last Updated:** 2025-12-23 - Created for card collection interface

## Purpose

Displays an instrument as a visually appealing card with gradient background, category badge, host badge, and hover effects. Designed to make browsing plugins feel fun and engaging, inspired by card collection interfaces like Hearthstone.

## Dependencies

- `@/types` - Instrument type definition
- `@/components/ui/badge` - Badge components for category and host
- `@/lib/utils` - cn utility for className merging
- `./InstrumentCard.module.css` - CSS module for gradient backgrounds and animations

## Props/API

```typescript
interface InstrumentCardProps {
  instrument: Instrument;        // Instrument data to display
  isSelected: boolean;           // Whether this card is selected
  viewDensity: 'compact' | 'spacious';  // Card size variant
  onSelect: (id: string) => void; // Callback when card is clicked
}
```

## Usage Example

```tsx
import { InstrumentCard } from '@/components/Collection/InstrumentCard';
import { useUIStore } from '@/store/uiStore';

function MyComponent() {
  const { collectionView, toggleCardSelection } = useUIStore();
  
  return (
    <InstrumentCard
      instrument={myInstrument}
      isSelected={collectionView.selectedCardIds.includes(myInstrument.id)}
      viewDensity={collectionView.viewDensity}
      onSelect={toggleCardSelection}
    />
  );
}
```

## Visual Design

**Card Dimensions:**
- Spacious: 250px × 350px
- Compact: 200px × 280px

**Layout:**
```
┌─────────────────────┐
│   [Category Badge]  │ ← Top-right
│                     │
│    Instrument       │ ← Large, bold
│       Name          │
│                     │
│    Developer        │ ← Smaller, muted
│                     │
│   [Host Badge]      │ ← Bottom-left
└─────────────────────┘
```

**Gradient Backgrounds:**
- Synth: Blue-purple gradient (#667eea → #764ba2)
- Effects: Green gradient (#0ba360 → #3cba92)
- Orchestral: Pink-red gradient (#f093fb → #f5576c)
- Drums: Pink-yellow gradient (#fa709a → #fee140)
- Keys: Orange-red gradient (#f59e0b → #ef4444)
- World: Pink-cyan gradient (#ec4899 → #06b6d4)
- Vocal: Cyan-blue gradient (#06b6d4 → #3b82f6)
- Other: Blue-cyan gradient (#4facfe → #00f2fe)

**Interactions:**
- Hover: Scale to 1.03, increased shadow (200ms transition)
- Click: Toggles selection state
- Keyboard: Enter/Space key support for accessibility
- Selected: Outline highlight with primary color

## State Management

This component is **presentational** - it doesn't manage any state itself. All state comes from props:
- Selection state from `uiStore.collectionView.selectedCardIds`
- View density from `uiStore.collectionView.viewDensity`
- Instrument data from `instrumentStore`

## Related Components

- `CollectionView` - Parent component that renders multiple cards in a grid
- `CollectionHeader` - Controls view density setting
- `uiStore` - Manages selection and view state

## Future Enhancements

- Flip animation on hover (Phase 2)
- Rarity effects (legendary/epic/rare/common) (Phase 2)
- Usage count indicator
- Custom card images/thumbnails
- Quick preview modal on hover
- Drag-to-deck functionality

