# InstrumentCard

**Last Updated:** 2025-12-24 - Added interactive features: rarity system, context menu, quick actions

## Purpose

Displays an instrument as a visually appealing card with gradient background, category badge, host badge, hover effects, and interactive features. Designed to make browsing plugins feel fun and engaging, inspired by card collection interfaces like Hearthstone. Cards now include usage-based visual rarity, right-click context menu, and quick "Mark as Used" action.

## Dependencies

- `@/types` - Instrument type definition
- `@/components/ui/badge` - Badge components for category and host
- `@/components/ui/dropdown-menu` - DropdownMenuTrigger for context menu
- `@/lib/utils` - cn utility for className merging
- `@/lib/rarity` - `getRarityTier` function for usage-based rarity calculation
- `./InstrumentCardContextMenu` - Context menu component for card actions
- `lucide-react` - Icons (Star, Check)
- `./InstrumentCard.module.css` - CSS module for gradient backgrounds, animations, and rarity styles

## Props/API

```typescript
interface InstrumentCardProps {
  instrument: Instrument;        // Instrument data to display
  isSelected: boolean;           // Whether this card is selected
  viewDensity: 'compact' | 'spacious';  // Card size variant
  onSelect: (id: string) => void; // Callback when card is clicked
  onMarkAsUsed?: (id: string) => void; // Optional callback when marking as used
  showUsageBadge?: boolean;      // Optional: show usage count badge (default: false)
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
- Hover: Scale to 1.03, increased shadow (200ms transition), quick action button appears
- Click: Toggles selection state
- Right-click: Opens context menu (Mark as Used, Edit, Delete)
- Quick Action Button: Hover button in top-right corner to mark as used
- Keyboard: Enter/Space key support for accessibility
- Selected: Outline highlight with primary color

**Rarity Visual Effects:**
- **Common** (0-4 uses): Standard appearance, no special effects
- **Rare** (5-19 uses): Blue border highlight (#3b82f6)
- **Epic** (20-49 uses): Purple border with glow effect, pulse animation
- **Legendary** (50+ uses): Gold border with shimmer animation and subtle glow

**Visual Feedback:**
- Success animation when marking as used (scale pulse, 400ms)
- Quick action button shows checkmark icon when marking
- Rarity updates immediately if usage count crosses tier threshold

## Accessibility

The component follows ARIA best practices for interactive elements:

- **Role**: `role="button"` - Indicates the card is clickable
- **Tab Index**: `tabIndex={0}` - Makes card keyboard focusable
- **ARIA Label**: Descriptive label in format `"{instrument name} by {developer}"`
- **ARIA Selected**: `aria-selected` attribute reflects selection state
- **Keyboard Support**: 
  - `Enter` key triggers selection
  - `Space` key triggers selection
  - Both prevent default browser behavior

**Screen Reader Support:**
- Card announces as button with descriptive label
- Selection state is announced via `aria-selected`
- Keyboard navigation follows tab order

## State Management

This component is **presentational** - it doesn't manage any state itself. All state comes from props:
- Selection state from `uiStore.collectionView.selectedCardIds`
- View density from `uiStore.collectionView.viewDensity`
- Instrument data from `instrumentStore`

## Related Components

- `CollectionView` - Parent component that renders multiple cards in a grid
- `CollectionHeader` - Controls view density setting
- `uiStore` - Manages selection and view state

## Rarity System

Cards display visual rarity based on usage count from `instrument.metadata.usageCount`:

- Calculated using `getRarityTier()` utility function
- Visual effects applied via CSS classes
- Updates immediately when usage count changes
- Legendary cards have animated shimmer effect (3s infinite)
- Epic cards have pulsing glow effect (2s infinite)

## Context Menu

Right-click on any card to access:
- **Mark as Used** - Increments usage count and updates rarity
- **Edit** - Opens edit dialog for the instrument
- **Delete** - Shows confirmation dialog, then deletes instrument

The context menu uses shadcn/ui DropdownMenu for accessibility and consistent styling.

## Quick Action Button

A hover-overlay button appears in the top-right corner of cards:
- Only visible on hover (smooth fade-in)
- Click to mark instrument as used
- Shows checkmark icon when marking
- Triggers success animation on completion

## Usage Badge

Optional usage count badge (bottom-right corner):
- Only visible if `showUsageBadge={true}` prop is set
- Shows current usage count number
- Hidden by default (can be enabled in future settings)

## Testing

- **Coverage:** 85.18% (45 tests)
- **Test file:** `src/components/Collection/InstrumentCard.test.tsx`
- **Key test cases:**
  - Rarity class applied correctly for all tiers (common, rare, epic, legendary)
  - Rarity updates immediately when usage count crosses threshold
  - Usage badge hidden by default (showUsageBadge=false)
  - Usage badge renders when showUsageBadge=true and usageCount > 0
  - Usage badge does not render when showUsageBadge=true but usageCount is 0
  - Quick action button renders when onMarkAsUsed is provided
  - Quick action button does not render when onMarkAsUsed is not provided
  - Quick action button calls onMarkAsUsed when clicked
  - Quick action button prevents event propagation (doesn't trigger card selection)
  - Context menu prevents default behavior on right-click
  - Card selection works via click and keyboard (Enter/Space)
  - Visual feedback animations work correctly

## Future Enhancements

- Flip animation on hover (Phase 2.1)
- Custom card images/thumbnails
- Quick preview modal on hover
- Drag-to-deck functionality
- Time-based decay effects (instruments get "dusty" if unused)
- Per-category rarity tiers

