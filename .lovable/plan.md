
# Fix: Shopping Cart "Checkout" Button Not Visible

## Problem
The cart drawer's sticky bottom bar (containing the "去结算" checkout button) is hidden behind the bottom navigation bar. Both use `fixed bottom-0 z-50`, so the BottomNav covers the checkout button completely.

## Solution
Restructure the cart drawer so it sits above the bottom navigation, and ensure the sticky footer with the checkout button is always visible. This matches the Luckin Coffee reference image exactly.

## Changes (1 file only: `src/components/MiniCartBar.tsx`)

### 1. Fix z-index layering
- Change the cart drawer overlay and content to `z-[60]` so it renders above the BottomNav (`z-50`)

### 2. Add proper bottom padding
- Add `pb-20` (bottom padding for BottomNav height) to the cart drawer container so the sticky footer clears the navigation bar
- Alternatively, ensure the entire drawer (overlay + content) fully covers the BottomNav area

### 3. Ensure sticky footer visibility
- The sticky bottom bar containing the cart icon, estimated price, and "去结算" button must render with sufficient clearance from the BottomNav
- The drawer's `max-h-[60vh]` and flex layout already supports this -- the fix is purely a z-index and spacing issue

## Technical Details

The specific changes:
- Line 100: Change overlay from `z-50` to `z-[60]`
- Line 101: Change drawer container from `z-50` to `z-[60]`
- Line 172: Add `pb-[calc(env(safe-area-inset-bottom)+1.5rem)]` or increase `pb-6` to `pb-20` to account for the BottomNav height (64px / h-16)

This is a minimal, targeted fix -- no restructuring needed, just z-index and padding corrections.
