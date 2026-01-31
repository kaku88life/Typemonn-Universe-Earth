'use client';

import { useLayerStore } from '@/store/useLayerStore';
import { useEffect, useState } from 'react';

export default function DebugPanel() {
  const { locations, currentYear, viewLevel } = useLayerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredCount = locations.filter(loc => {
    const start = loc.year_start ?? -9999999999;
    const end = loc.year_end ?? 9999999999;
    return currentYear >= start && currentYear <= end;
  }).length;

  return (
    <div className="fixed bottom-4 right-4 z-[999] bg-black/80 border border-cyan-500 p-3 rounded text-[11px] text-cyan-300 font-mono max-w-xs backdrop-blur-sm">
      <div className="space-y-1">
        <div className="text-yellow-400 font-bold">DEBUG PANEL</div>
        <div>📊 Total Locations: <span className="text-white font-bold">{locations.length}</span></div>
        <div>📅 Current Year: <span className="text-white font-bold">{currentYear}</span></div>
        <div>✅ Filtered (visible): <span className="text-white font-bold">{filteredCount}</span></div>
        <div>🎯 View Level: <span className="text-white font-bold">{viewLevel}</span></div>
        {locations.length === 0 && (
          <div className="text-red-400 mt-2 border-t border-red-400/50 pt-2">
            ⚠️ No locations loaded! Check:
            <br />1. DB connection
            <br />2. fetchLocations() called
            <br />3. Seed script ran
          </div>
        )}
        {filteredCount === 0 && locations.length > 0 && (
          <div className="text-red-400 mt-2 border-t border-red-400/50 pt-2">
            ⚠️ All filtered out!
            <br />Check year range logic
          </div>
        )}
      </div>
    </div>
  );
}
