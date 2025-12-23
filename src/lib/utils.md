# utils

**Last Updated:** 2024-12-22 - Initial documentation

## Purpose

Utility functions for the application. Currently contains the `cn` function for merging Tailwind CSS classes intelligently using `clsx` and `tailwind-merge`.

## Dependencies

- `clsx` - For conditional class name construction
- `tailwind-merge` - For merging Tailwind classes without conflicts

## API

### cn(...inputs: ClassValue[])

Merges class names intelligently, resolving Tailwind CSS conflicts.

```typescript
function cn(...inputs: ClassValue[]): string
```

**Parameters:**
- `inputs` - Any number of class values (strings, objects, arrays)

**Returns:**
- Merged class string with Tailwind conflicts resolved

## Usage Example

```typescript
import { cn } from '@/lib/utils';

// Basic usage
cn('px-4', 'py-2', 'bg-blue-500')
// => 'px-4 py-2 bg-blue-500'

// Conditional classes
cn('base-class', isActive && 'active-class', isPending && 'pending-class')

// Tailwind conflict resolution
cn('p-4', 'p-6')
// => 'p-6' (later padding wins)

cn('bg-red-500', 'bg-blue-500')
// => 'bg-blue-500' (later background wins)

// In components
<div className={cn(
  'rounded-lg border p-4',
  variant === 'primary' && 'bg-primary text-white',
  variant === 'secondary' && 'bg-secondary text-black',
  className // Allow prop override
)} />
```

## State Management

No state - pure utility function.

## Related Components

Used throughout the application by all components that need class name merging.

## Testing

Comprehensive test coverage in `utils.test.ts`:
- Class name merging
- Conditional classes
- Tailwind conflict resolution

## Future Enhancements

- [ ] Additional utility functions as needed
- [ ] Type-safe class name builder

