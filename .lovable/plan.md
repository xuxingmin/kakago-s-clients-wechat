

# Reviewer Feedback Implementation Plan

## Current Issues (Screenshot vs. Brief)

1. **Creative cards same size as standard** -- the reviewer specifically asks for "larger, high-impact product cards" in the Creative section, but currently both sections use identical card sizes.
2. **Color mismatch** -- the brief calls for distinct color tones between sections (Dark Gray #222 for upper, Deep Black / Dark Metallic Silver for lower). Currently both headers use similar white/opacity values.
3. **Serif italic styling** -- the right-side text of the lower section should use a more prominent serif italic style to convey "World Champion elegance". Currently it's applied but may be too subtle.
4. **LAB tags visibility** -- the LAB 07/08/09/10 experiment tags exist but are very faint (white/20). They should be more visible as a key design differentiator.

## Planned Changes

### 1. Section Header Typography Refinement (`Index.tsx`)

- **Upper Section (意式基石系列)**:
  - Left title: slightly larger, bold, `text-white/70` -- keep current as it reads well
  - Right description: lighter weight with wider letter-spacing for a "lab report" feel
  
- **Lower Section (先锋实验系列)**:
  - Left title: bolder, `text-white/80` with a subtle warm tint
  - Right description: increase Playfair Display font size slightly, ensure italic is clearly visible, add a subtle gold/silver shimmer color instead of plain white/40

### 2. Creative Cards -- High-Impact Upgrade (`ProductTile.tsx`)

- Increase creative card inner padding slightly (from `py-2 px-2.5` to `py-2.5 px-3`)
- Make the icon container larger for creative products (from `w-10 h-10` to `w-11 h-11`)
- Boost the LAB tag opacity from `white/20` to `white/35` and slightly larger font
- Add a subtle top-border glow effect on creative cards using `border-t border-primary/25`

### 3. Divider Line Differentiation (`Index.tsx`)

- Upper section: plain `bg-white/10` line (neutral, technical)
- Lower section: gradient line `from-white/15 via-primary/20 to-white/15` (already in place, keep as-is)

### 4. Grid Spacing Adjustment (`Index.tsx`)

- Keep `gap-1.5` for standard grid (compact, uniform)
- Use `gap-2` for creative grid to give cards more breathing room and a "premium" feel

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Adjust header typography colors, creative grid gap |
| `src/components/ProductTile.tsx` | Creative card padding/sizing bump, LAB tag visibility |

### No New Dependencies

All changes are CSS/Tailwind adjustments within existing components. No new packages or fonts needed (Playfair Display already imported).

