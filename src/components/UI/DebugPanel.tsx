'use client';

import { useLayerStore } from '@/store/useLayerStore';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, MapPin, Eye, Calendar, Grid3x3, ChevronDown, ChevronRight, X } from 'lucide-react';

export default function DebugPanel() {
  const { locations, currentYear, viewLevel } = useLayerStore();
  const [mounted, setMounted] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Development: auto-enable debug panel
    if (process.env.NODE_ENV === 'development') {
      setDebugEnabled(true);
      return;
    }

    // Production: check localStorage
    const saved = localStorage.getItem('tm-debug-enabled');
    if (saved === 'true') {
      setDebugEnabled(true);
    }

    // Keyboard shortcut: Ctrl+Shift+D to toggle
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugEnabled(prev => {
          const next = !prev;
          localStorage.setItem('tm-debug-enabled', next.toString());
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!mounted || !debugEnabled) return null;

  const filteredCount = locations.filter(loc => {
    const start = loc.year_start ?? -9999999999;
    const end = loc.year_end ?? 9999999999;
    return currentYear >= start && currentYear <= end;
  }).length;

  const isHealthy = locations.length > 0 && filteredCount > 0;
  const healthIcon = isHealthy ? (
    <CheckCircle size={12} className="text-green-400" />
  ) : (
    <AlertCircle size={12} className="text-yellow-400" />
  );
  const healthText = isHealthy ? 'HEALTHY' : 'WARNING';
  const healthColor = isHealthy ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="fixed bottom-4 right-4 z-[999] bg-black/85 border-2 border-cyan-500/70 p-3 rounded text-[10px] text-cyan-300 font-mono max-w-xs backdrop-blur-sm shadow-lg">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-2 border-b border-cyan-500/30 pb-2">
        <div className={`font-bold ${healthColor} flex items-center gap-1`}>
          {healthIcon}
          <span>{healthText}</span>
        </div>
        <button
          onClick={() => setDebugEnabled(false)}
          className="text-cyan-500 hover:text-cyan-200"
          title="Close (Ctrl+Shift+D to toggle)"
        >
          <X size={12} />
        </button>
      </div>

      {/* Compact view */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MapPin size={10} className="text-cyan-300" />
          <span>Locations:</span>
          <span className="text-white font-bold">{locations.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={10} className="text-cyan-300" />
          <span>Visible:</span>
          <span className="text-white font-bold">{filteredCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={10} className="text-cyan-300" />
          <span>Year:</span>
          <span className="text-white font-bold">{currentYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <Grid3x3 size={10} className="text-cyan-300" />
          <span>Level:</span>
          <span className="text-white font-bold">{viewLevel}</span>
        </div>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-cyan-500 hover:text-cyan-300 mt-2 text-[9px] border-t border-cyan-500/20 pt-2 w-full text-left flex items-center gap-1"
      >
        {showDetails ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span>Details</span>
      </button>

      {showDetails && (
        <div className="text-[9px] text-cyan-400 space-y-1 mt-2 border-t border-cyan-500/20 pt-2">
          <div>Filter Rate: {filteredCount > 0 ? `${Math.round(filteredCount / locations.length * 100)}%` : '0%'}</div>
          <div>Year Range: {locations.length > 0 ? `${Math.min(...locations.map(l => l.year_start ?? -Infinity))} ~ ${Math.max(...locations.map(l => l.year_end ?? Infinity))}` : 'N/A'}</div>
          <div>Node Env: {process.env.NODE_ENV}</div>
        </div>
      )}

      {/* Warning messages */}
      {locations.length === 0 && (
        <div className="text-red-400 mt-2 border-t border-red-400/50 pt-2 text-[9px]">
          [!] No locations loaded
        </div>
      )}
      {filteredCount === 0 && locations.length > 0 && (
        <div className="text-yellow-400 mt-2 border-t border-yellow-400/50 pt-2 text-[9px]">
          [!] All locations filtered out
        </div>
      )}

      {/* Footer hint */}
      <div className="text-[8px] text-cyan-600/50 mt-2 border-t border-cyan-500/20 pt-1">
        Hint: Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}
