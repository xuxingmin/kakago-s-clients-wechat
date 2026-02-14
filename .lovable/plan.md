
# Add "Auto-Detect Nearby Buildings" Button to AddressForm

## Overview
Add a location-detect button at the top of the AddressForm (in the red-boxed area from the screenshot). When tapped, it uses the browser's Geolocation API + OpenStreetMap Nominatim reverse geocoding to auto-fill the province, city, district, and detail fields. It also fetches nearby POIs (points of interest) like buildings and landmarks for the user to pick from, eliminating manual input.

## UI Changes (`src/components/AddressForm.tsx`)

### 1. "Select Location" Button
- Add a tappable button between the header and the "收货人" field
- Icon: `Navigation` (or `Locate`) from lucide-react + text "自动识别当前位置" / "Auto-detect location"
- Shows a loading spinner while detecting

### 2. Nearby POI List (Inline Dropdown)
- After detection, display a scrollable list of 5-8 nearby buildings/landmarks below the button
- Each item shows: building name + short address
- Tapping an item auto-fills: province, city, district, detail, and stores lat/lng
- List dismisses after selection

### 3. Auto-Fill Behavior
- On POI selection, populate:
  - `province` / `provinceEn` from reverse geocode result
  - `city` / `cityEn`
  - `district` / `districtEn`
  - `detail` / `detailEn` with the selected building name + address
- Clear any validation errors on the filled fields

## Technical Implementation

### Geolocation + Nominatim Flow
1. Call `navigator.geolocation.getCurrentPosition()` to get lat/lng
2. In parallel, call Nominatim reverse geocode for address decomposition AND Nominatim search API for nearby POIs:
   - Reverse: `https://nominatim.openstreetmap.org/reverse?lat=X&lon=Y&format=json&accept-language=zh`
   - Nearby POIs: `https://nominatim.openstreetmap.org/search?q=*&format=json&accept-language=zh&viewbox={bbox}&bounded=1&limit=8&addressdetails=1`
   - Alternative: Use Overpass API for better POI results (buildings, shops, amenities within 500m radius)

### State Additions
- `locationLoading: boolean` - shows spinner on the button
- `nearbyPOIs: Array<{name, address, lat, lng, province, city, district}>` - detected results
- `showPOIList: boolean` - toggles the dropdown

### Form Data Update
- Add `latitude` and `longitude` to formData state (already supported in Address type)
- Pass coordinates through to `onSubmit`

## File Changes
- `src/components/AddressForm.tsx` - add location button, POI list, auto-fill logic (single file change)
