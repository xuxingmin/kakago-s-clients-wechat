

# Address Card Layout Reorganization

## Goal
Match the reference screenshot layout where each card shows:
- **Row 1**: Building/landmark name (bold, prominent)
- **Row 2**: District + Recipient name

Currently the layout already has this structure but the landmark extraction needs improvement to show cleaner building names, and the second row should show district + recipient name (matching the screenshot like "蜀山区 · 张三").

## Changes (single file: `src/components/AddressPicker.tsx`)

### Row 1: Landmark (Building/Complex Name)
- Extract a more meaningful landmark from the detail string -- take the part after the separator (the actual building name like "万达广场", "万达茂", "华润万象城") instead of the prefix
- Keep the check/pin icon + landmark text layout

### Row 2: District + Recipient Name
- Show `district` (e.g., 蜀山区) followed by a dot separator and `addr.name` (e.g., 张三)
- This matches the screenshot exactly

### Landmark Extraction Logic Update
- Current: takes the first part before separator (e.g., "天鹅湖CBD" from "天鹅湖CBD·万达广场3号楼...")
- New: smarter extraction that picks the most recognizable building/complex keyword, limited to ~6 characters for Chinese, ~14 for English
- For addresses with separators, prefer the building/place name portion

### Technical Details

**Updated `extractLandmark` function:**
```
// Split by separators, pick the part that looks like a building/place name
// e.g., "天鹅湖CBD·万达广场3号楼15层1502室" -> "天鹅湖CBD"
// e.g., "滨湖新区·银泰城B座2201" -> "滨湖新区" 
// Keep current logic as it already extracts the first meaningful keyword
```

**Row 2 template:**
```
{district} · {addr.name}
```

This is a minor CSS/text adjustment in the existing card structure -- no structural changes needed.

