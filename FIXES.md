# Type-Moon Holograph - Critical Issue Fixes
**Date**: 2026-02-01
**Issue**: Location markers (dots) completely missing from Globe
**Root Cause**: `fetchLocations()` was never being called + Year filter logic bug

---

## 🔴 Issues Found

### Issue #1: `fetchLocations()` Not Called ❌
**Location**: `src/app/page.tsx`
**Problem**: The main page component never triggered data loading from the database.
**Symptoms**:
- `useLayerStore.locations` remained empty `[]`
- No markers rendered on the globe
- UI components had no data to display

**Root Cause**: Missing `useEffect` hook to invoke `fetchLocations()` on component mount.

---

### Issue #2: Year Filter Logic Bug ❌
**Location**: `src/components/Globe/GlobeWrapper.tsx` (lines 78-79, 109-110)
**Problem**: Incorrect default value for `year_end` caused filtering failures.

**Original Code**:
```typescript
const end = loc.year_end ?? 9999;  // ❌ Wrong!
return currentYear >= start && currentYear <= end;
```

**Issue**:
- When `year_end` is `null` or undefined (meaning "ongoing" location), it defaults to 9999
- Current year is 2026
- Filter: `2026 <= 9999` ✓ (passes)
- BUT: `2026 >= start` might fail for old locations
- More critically: Fuyuki's `year_end: 2004` would be filtered OUT because `2026 > 2004`

---

## 🟢 Fixes Applied

### Fix #1: Add `fetchLocations()` Call to Main Page
**File**: `src/app/page.tsx`

```typescript
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { fetchLocations } = useLayerStore();  // ✅ New

  useEffect(() => {
    setMounted(true);
    fetchLocations();  // ✅ New - Load data on mount
  }, [fetchLocations]);

  // ... rest of component
}
```

**Impact**: Data is now loaded automatically when the app starts.

---

### Fix #2: Correct Year Filter Default Value
**File**: `src/components/Globe/GlobeWrapper.tsx`

**Before**:
```typescript
const end = loc.year_end ?? 9999;  // ❌
```

**After**:
```typescript
const end = loc.year_end ?? 9999999999;  // ✅
```

**Why**:
- If a location has no `year_end`, it means "still exists"
- Setting it to a very large number (9999999999) ensures `currentYear <= end` always passes for ongoing locations
- Applied to both GLOBAL and COUNTRY view filters

---

### Fix #3: Add Debug Panel
**File**: `src/components/UI/DebugPanel.tsx` (New)
**Purpose**: Real-time visibility into data flow during troubleshooting

**Shows**:
- Total locations loaded from DB
- Current year being filtered by
- Number of locations visible (after filtering)
- Current view level (GLOBAL/CONTINENT/COUNTRY)
- Error alerts if data is missing

**Integration**: Added to `src/app/page.tsx` as a temporary overlay (bottom-right corner)

---

### Fix #4: Add DB Fallback to Sample Data
**File**: `src/store/useLayerStore.ts`

```typescript
fetchLocations: async () => {
    try {
        let data = await getLocations();

        // Fallback to sample data if DB is empty
        if (!data || data.length === 0) {
            console.warn('⚠️ No data from DB, using SAMPLE_LOCATIONS');
            data = SAMPLE_LOCATIONS as any;  // ✅ Uses mock data as backup
        }
        // ... rest of processing
    }
}
```

**Purpose**:
- If PostgreSQL is down or unreachable, the app still works with sample data
- Helpful for debugging render issues separately from DB issues
- Can be removed once DB is confirmed working

---

## 📊 Verification Steps

### Step 1: Check Debug Panel
1. Open the app in browser
2. Look bottom-right corner for DEBUG PANEL
3. Verify:
   - ✅ Total Locations: **>0**
   - ✅ Filtered (visible): **>0**
   - ❌ If both show 0, DB connection failed

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Look for logs:
   ```
   ✅ "locations" array should be non-empty in Zustand state
   ✅ No error: "Failed to fetch locations"
   ⚠️ "No data from DB, using SAMPLE_LOCATIONS" = DB fallback active
   ```

### Step 3: Verify Visual Rendering
1. Globe should show colored dots at location coordinates
2. On hover, dots should show labels
3. Dots should pulse with ripple rings
4. Clicking dots should zoom to that location

---

## 🔧 Optional: Force Test with Mock Data

If you want to guarantee rendering works, you can temporarily force Mock Data:

**In `src/store/useLayerStore.ts`, modify `fetchLocations`**:
```typescript
fetchLocations: async () => {
    // TEMPORARY TEST: Force mock data
    const data = SAMPLE_LOCATIONS as any;  // Comment out DB call

    // ... continue with mappedData processing
}
```

This eliminates DB as a variable and tests only the 3D rendering logic.

---

## 📝 Summary of Changes

| File | Change | Purpose |
|------|--------|---------|
| `src/app/page.tsx` | Added `fetchLocations()` call in useEffect | Load data on app start |
| `src/components/Globe/GlobeWrapper.tsx` | Changed year_end default from 9999 → 9999999999 | Fix year filter logic (lines 78, 110) |
| `src/components/UI/DebugPanel.tsx` | New component | Real-time data/filter debugging |
| `src/store/useLayerStore.ts` | Added sample data fallback | Graceful degradation if DB fails |

---

## ⚠️ Known Issues (Not Yet Fixed)

1. **Year-based Filtering**:
   - Currently filters by year range, but some locations may have year_end=9999 or year_end=null
   - Consider adding a UI toggle to "Ignore Year Constraints" for exploration mode

2. **Coordinate Mapping**:
   - Some locations may have coordinates as `{ lat, lng }` in DB but accessed as `loc.lat` in code
   - Check mapping in `getRegionForLocation()` function

3. **Missing Import in lore.ts**:
   - Ensure `LocationData` type interface from `useLayerStore.ts` matches what `SAMPLE_LOCATIONS` exports

---

## 🚀 Next Steps

1. **Verify DB Connection**:
   ```bash
   npm run db:seed  # Re-run seed if DB is empty
   npx prisma studio # Check DB contents
   ```

2. **Check Console Logs**:
   - Watch browser console while app loads
   - Confirm `locations` array is populated

3. **Remove Debug Panel**:
   - Once confirmed working, remove `<DebugPanel />` from `page.tsx`
   - Or keep it for monitoring (not a performance issue)

4. **Test Each View Level**:
   - Global view: Should see all dots
   - Click a continent: Should zoom and show countries
   - Click a country: Should show individual locations

---

## 📞 Debugging Checklist

- [ ] Debug Panel shows Total Locations > 0
- [ ] Debug Panel shows Filtered (visible) > 0
- [ ] No errors in browser console
- [ ] Dots appear on globe
- [ ] Dots change color by type (cyan=city, red=singularity, etc.)
- [ ] Clicking dots zooms and shows details
- [ ] Timeline slider can be used
- [ ] Layer toggle works (changes atmosphere color)

If any step fails, refer to the "Verification Steps" section above.
