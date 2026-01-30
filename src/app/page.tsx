'use client';

import GlobeWrapper from '@/components/Globe/GlobeWrapper';
import HolographicPanel from '@/components/UI/HolographicPanel';
import TimelineSlider from '@/components/UI/TimelineSlider';
import LocationDetailPanel from '@/components/UI/LocationDetailPanel';
import SettingsMenu from '@/components/UI/SettingsMenu'; // New Component
import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Layers, Activity } from 'lucide-react';

// Helper for Client-Side Translation in JSX
// (Store hook usage inside component body is cleaner)
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
  const { t } = useLanguageStore(); // Get t function

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

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      {/* === LAYER 1: 3D Globe (z-0) === */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GlobeWrapper />
      </div>

      {/* === LAYER 2: UI Overlay (z-50) === */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }}>

        {/* Header - Top Left (Scaled down further ~15% -> 0.6) */}
        <header style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          pointerEvents: 'auto',
          transform: 'scale(0.6)',
          transformOrigin: 'top left',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              <span className="text-cyan-400"><TranslatedTitle /></span>
            </h1>
            <p className="text-cyan-600/80 text-sm mt-1 uppercase tracking-[0.2em]">
              <TranslatedSubtitle />
            </p>
          </div>

          {/* Settings Gear */}
          <div className="mt-2">
            <SettingsMenu />
          </div>
        </header>


        {/* Location Detail Panel */}
        <LocationDetailPanel />

        {/* Layer Control - Bottom Right (Compacted) */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          pointerEvents: 'auto',
          zIndex: 60
        }}>
          <LayerControl />
        </div>

        {/* Credits - Bottom Left */}
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', pointerEvents: 'none', zIndex: 30 }} className="text-[10px] text-cyan-900/50 uppercase">
          Project ID: 86d4c795<br />
          Render Engine: React-Globe.GL
        </div>

        {/* Timeline - Bottom Center */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          maxWidth: '36rem',
          pointerEvents: 'auto',
          zIndex: 50
        }}>
          <TimelineSlider />
        </div>
      </div>
    </div>
  );
}
