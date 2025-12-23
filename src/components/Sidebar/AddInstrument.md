# AddInstrument Component

**Last Updated:** 2024-12-19

## Purpose

Dialog component for adding new instruments or editing existing ones. Provides a form with all instrument metadata fields.

## Dependencies

- `@/store/instrumentStore` - Add/update instrument actions
- `@/store/uiStore` - Dialog open/close state
- `@/components/ui/dialog` - Dialog container
- `@/components/ui/input` - Text inputs
- `@/components/ui/select` - Dropdown selects
- `@/components/ui/checkbox` - Tag checkboxes
- `@/components/ui/textarea` - Notes field
- `@/types` - Host and Category types

## Usage

Opened via `uiStore.openAddInstrument()` or `uiStore.openEditInstrument(id)`.

## State

### Local State
```typescript
{
  name: string
  developer: string
  host: Host
  category: Category
  tags: string[]
  notes: string
}
```

### External State (from stores)
- `isAddInstrumentOpen` - Dialog visibility (add mode)
- `isEditInstrumentOpen` - Dialog visibility (edit mode)
- `editingInstrumentId` - ID of instrument being edited

## Form Fields

1. **Name** (required) - Instrument/plugin name
2. **Developer** (required) - Company/developer name
3. **Host** - Plugin host (dropdown)
4. **Category** - Instrument category (dropdown)
5. **Tags** - Checkboxes for common tags (GO-TO, Hidden Gem, etc.)
6. **Notes** - Free-form text field

## Behavior

### Add Mode
- Form starts empty
- On submit: calls `addInstrument()`
- Closes dialog and resets form

### Edit Mode
- Form pre-filled with instrument data
- On submit: calls `updateInstrument()`
- Closes dialog and resets form

### Form Reset
Form resets to defaults after submit or cancel:
- Empty strings for text fields
- 'Other' for host and category
- Empty array for tags

## Validation

- Name and Developer are required (HTML5 required attribute)
- Other fields are optional

## Common Tags

Predefined tag options:
- GO-TO
- Hidden Gem
- Specialty
- Lo-Fi
- Experimental
- Cinematic
- Ambient

## Future Enhancements

- Custom tag input (add new tags)
- Color picker for custom colors
- Image upload for instrument thumbnails
- Validation feedback
- Duplicate detection

