# Analytics

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Displays usage analytics and statistics about the instrument library including total counts, most/least used instruments, and category breakdowns. Helps users discover underutilized instruments and understand their library composition.

## Dependencies

- `@/store/instrumentStore` - Instrument data and usage metadata
- `@/components/ui/card` - Card component for stat display
- `@/components/ui/badge` - Badge component for counts
- `lucide-react` - Icons (BarChart3, Clock, TrendingUp)
- `react` - useMemo for performance optimization

## Props/API

No props - component is self-contained.

## Usage Example

```tsx
import { Analytics } from '@/components/Sidebar/Analytics';

<Sidebar>
  <FilterPanel />
  <TemplateLibrary />
  <Analytics />
</Sidebar>
```

## State Management

No internal state. Computes statistics from `useInstrumentStore` data using `useMemo` for performance.

**Computed Statistics:**
- `total` - Total number of instruments
- `used` - Instruments with usage count > 0
- `neverUsed` - Instruments never marked as used
- `mostUsed` - Top 5 instruments by usage count
- `leastUsed` - Top 5 instruments by time since last use
- `byCategory` - Instrument count per category

## Related Components

- `Sidebar` - Parent container
- `instrumentStore` - Data source for analytics
- `InstrumentNode` - Can mark instruments as used

## Future Enhancements

- [ ] Usage over time charts
- [ ] Export analytics reports
- [ ] Customizable time ranges
- [ ] Filter analytics by category/host
- [ ] Recommendations based on usage patterns
- [ ] Comparison with previous periods

