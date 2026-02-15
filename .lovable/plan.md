

# Tactical Boosters: Coupon Section Redesign

## Overview

Replace the current "CouponFlags" (small waving pennant flags) in the BrandBanner with a full-width "Tactical Boosters" strip -- three skewed parallelogram modules that evoke a racing HUD / military ops dashboard.

The new component sits between the BrandBanner header and the product grid, spanning the full width of the screen.

## Architecture

### New Component: `TacticalBoosters.tsx`

A standalone component replacing `CouponFlags`. Three modules in a tight horizontal row:

| Slot | Label | Value | Footer (zh/en) | Color Scheme |
|------|-------|-------|----------------|--------------|
| 01 | RECRUIT | ¥9.9 | 首杯补给 / First Boost | Signal Orange (#FF4500) |
| 02 | SQUAD | 20% OFF | 职场充能 / Squad Power | Deep Charcoal (#222) with silver text |
| 03 | WBC ACCESS | -¥5 | 冠军立减 / Champ Cut | Metallic Silver (#E0E0E0) with black text |

### Visual Construction

- Each module uses `transform: skewX(-15deg)` on the outer container for the speed/forward motion effect
- Inner content uses `transform: skewX(15deg)` to keep text upright
- 1px gap between modules to form a unified "acceleration strip"
- Monospace font (system mono or `font-mono` from Tailwind) for English labels

### Status Bar

A tiny line above the boosters strip:
- Red dot (pulsing) + "LIVE STATUS: SQUAD ASSEMBLING..." in monospace, 8px text
- Adds the "tactical ops" atmosphere

### Micro-Interactions

- Shimmer: A light band sweeps across all three modules every 4 seconds
- Click/Tap: `active:scale-95` press-down effect on each module

## Integration Points

### Files to Modify

1. **New file: `src/components/TacticalBoosters.tsx`**
   - Self-contained component with all three modules
   - Includes shimmer animation via inline `<style>` tag
   - Uses `useLanguage()` for bilingual footer text

2. **Modify: `src/components/BrandBanner.tsx`**
   - Remove the `CouponFlags` import and usage
   - Keep the KAKAGO title + tagline section as-is

3. **Modify: `src/pages/Index.tsx`**
   - Import and place `<TacticalBoosters />` after `<BrandBanner />` inside the `flex-shrink-0` header zone
   - Remove the `CouponFlags` / `Coupon` import if no longer needed elsewhere

### Vertical Space Budget

The boosters strip must be extremely compact (approximately 36-40px tall) to respect the single-screen constraint. The status line above adds ~12px. Total addition: ~50px. This may require minor padding reductions elsewhere (e.g., BrandBanner `pt-1` to `pt-0.5`).

## Technical Details

```text
+--------------------------------------------------------------+
| 🔴 LIVE STATUS: SQUAD ASSEMBLING...          (8px mono text) |
+--------------------------------------------------------------+
| ////RECRUIT//// | /////SQUAD////// | ///WBC ACCESS/// |
| //// ¥9.9  //// | /// 20% OFF //// | ////  -¥5  ///// |
| ////首杯补给//// | ///职场充能  //// | ////冠军立减///// |
+--------------------------------------------------------------+
  (orange, skewed)   (charcoal, skewed)  (silver, skewed)
     1px gap              1px gap
```

### CSS Approach

- Container: `flex gap-[1px] px-4` full width
- Each module: `flex-1`, `skewX(-15deg)`, `overflow-hidden`, specific background color
- Inner content: `skewX(15deg)`, centered vertically, `py-1.5 px-3`
- Top label: `text-[7px] font-mono font-bold uppercase tracking-[0.2em]`
- Main value: `text-base font-black font-mono`
- Footer: `text-[8px] font-medium`
- Shimmer: reuse existing `@keyframes shimmer` from `index.css`, triggered every 4s via `animation-delay`

### Color Mapping

- Module 1 (RECRUIT): `bg-[#FF4500]`, all text white
- Module 2 (SQUAD): `bg-[#222]`, label `text-[#999]`, value `text-white`, footer `text-[#888]`
- Module 3 (ACCESS): `bg-[#E0E0E0]`, all text `text-[#111]`

