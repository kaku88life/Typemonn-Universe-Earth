'use client';

import { useState, useEffect } from 'react';
import GlobeWrapper from '@/components/Globe/GlobeWrapper';
import HolographicPanel from '@/components/UI/HolographicPanel';
import TimelineSlider from '@/components/UI/TimelineSlider';
import LocationDetailPanel from '@/components/UI/LocationDetailPanel';
import SettingsMenu from '@/components/UI/SettingsMenu';
import DebugPanel from '@/components/UI/DebugPanel';
import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import DraggablePanel from '@/components/UI/DraggablePanel';
import { Layers, Activity } from 'lucide-react';

// Helper for Client-Side Translation in JSX
function TranslatedTitle() {
  const { t } = useLanguageStore();
  return <>{t('system.title')}</>;
}

function TranslatedSubtitle() {
  const { t } = useLanguageStore();
  return <>{t('system.subtitle')}</>;
}

function LayerControl() {
  const { showReverseSide, toggleReverseSide } = useLayerStore();
  const { t } = useLanguageStore();

  return (
    <HolographicPanel title={t('layer.control')} className="w-32">
      <div className="flex flex-col items-center justify-center mt-1 gap-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono text-cyan-200/70">
            {showReverseSide ? t('layer.reverse') : t('layer.surface')}
          </span>

          <button
            onClick={toggleReverseSide}
            className={`relative inline-flex h-3 w-6 items-center rounded-full transition-colors focus:outline-none 
                            ${showReverseSide ? 'bg-yellow-600' : 'bg-cyan-900/50'}
                        `}
          >
            <span
              className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform
                                ${showReverseSide ? 'translate-x-3' : 'translate-x-0.5'}
                            `}
            />
          </button>
        </div>
      </div>
    </HolographicPanel>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { fetchLocations } = useLayerStore();

  useEffect(() => {
    setMounted(true);
    // Load locations from database on mount
    fetchLocations();
  }, [fetchLocations]);

  // Prevent SSR from accessing window
  if (!mounted) return <div className="bg-black w-screen h-screen" />;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans selection:bg-cyan-500/30">
      {/* === LAYER 1: 3D Globe (Background) === */}
      <div className="absolute inset-0 z-0">
        <GlobeWrapper />
      </div>

      {/* === LAYER 2: UI Overlay (Static + Draggable) === */}
      <div className="relative z-50 w-full h-full pointer-events-none p-4 md:p-6 lg:p-8">

        {/* 1. Header Section (Static Title) */}
        <header className="flex items-start justify-between pointer-events-auto relative z-50">
          <div className="flex items-start gap-4 transform origin-top-left scale-75 md:scale-90 lg:scale-100 transition-transform">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                <span className="text-cyan-400"><TranslatedTitle /></span>
              </h1>
              <p className="text-cyan-600/80 text-xs md:text-sm mt-1 uppercase tracking-[0.2em]">
                <TranslatedSubtitle />
              </p>
            </div>
          </div>
        </header>

        {/* 2. Side Panel (Location Details) */}
        <div className="absolute left-8 top-32 pointer-events-auto z-40">
          <LocationDetailPanel />
        </div>

        {/* 3. Floating Draggable Windows */}

        {/* Timeline - Default Bottom Center */}
        {/* Adjusted: y = window.innerHeight - 220 (Raised another 10px) */}
        <DraggablePanel
          id="timeline-panel"
          title="TIMELINE"
          defaultPosition={{ x: window.innerWidth / 2 - 300, y: window.innerHeight - 220 }}
          className="pointer-events-auto"
        >
          <div className="w-[600px] max-w-[90vw]">
            <TimelineSlider />
          </div>
        </DraggablePanel>

        {/* Layer Control - Default Bottom Right */}
        <DraggablePanel
          id="layer-panel"
          title="LAYERS"
          defaultPosition={{ x: window.innerWidth - 180, y: window.innerHeight - 230 }}
          className="pointer-events-auto"
        >
          <LayerControl />
        </DraggablePanel>

        {/* Settings Menu - Default Top Left (Below Title) */}
        <DraggablePanel
          id="settings-panel"
          title="SYSTEM"
          defaultPosition={{ x: 30, y: 120 }}
          className="pointer-events-auto"
        >
          <SettingsMenu />
        </DraggablePanel>

        {/* Footer Info - Static Bottom Left */}
        <div className="absolute bottom-6 left-8 pointer-events-auto z-30">
          <div className="text-[10px] text-cyan-900/50 uppercase hidden md:block backdrop-blur-sm p-2 rounded">
            Project ID: 86d4c795<br />
            Render Engine: React-Globe.GL
          </div>
        </div>

      </div>

      {/* Debug Panel - Temporary for troubleshooting */}
      <DebugPanel />
    </div>
  );
}
