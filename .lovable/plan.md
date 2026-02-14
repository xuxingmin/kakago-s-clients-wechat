

# Pixel-Perfect Address Card Grid Alignment

## Current Issue
The address cards in the picker are close to the reference design but need pixel-level alignment tweaks to ensure uniform sizing, consistent spacing, and crisp text positioning across all 13+ cards.

## Changes (single file: `src/components/AddressPicker.tsx`)

### 1. Uniform Card Height
- Add `min-h-[56px]` to each card button so all cards share the same height regardless of content length
- Use `justify-center` for vertical centering within the fixed-height card

### 2. Grid Gap and Padding
- Adjust grid gap from `gap-1.5` to `gap-2` for cleaner visual separation matching the reference
- Standardize card internal padding to `px-3 py-2` for consistent whitespace

### 3. Icon + Text Row Alignment
- Keep the 20px icon (`w-5 h-5`) + `gap-1.5` pattern but add `min-w-0` on the text span to ensure `truncate` works correctly on both columns
- Ensure the landmark text uses `flex-1 min-w-0 truncate` to prevent overflow pushing the "默认" badge off-screen

### 4. Second Row (District + Name) Alignment
- Change `pl-[26px]` to `ml-[26px]` for more predictable alignment relative to the icon
- Add `min-w-0` to the row container so truncation works properly in narrow columns

### 5. Default Badge Positioning
- Adjust badge from `absolute top-1.5 right-2` to `absolute top-1 right-1.5` for tighter placement matching the reference image

## Technical Detail
All changes are CSS-only within the existing component structure -- no logic or data changes needed.

