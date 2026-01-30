'use client';

import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore'; // I18N
import HolographicPanel from './HolographicPanel';
import { useState, useEffect, useMemo } from 'react';

// Static config for logic, but labels will be dynamic
const ERA_CONFIG = [
    { id: 'GENESIS', key: 'era.genesis', min: -4600000000, max: -1, step: 1000000, default: -2600 },
    { id: 'HISTORY', key: 'era.history', min: 0, max: 1979, step: 10, default: 500 },
    { id: 'MODERN', key: 'era.modern', min: 1980, max: 2030, step: 1, default: 2004 },
    { id: 'FUTURE', key: 'era.future', min: 2031, max: 3000, step: 10, default: 2032 }
];

export default function TimelineSlider() {
    const { currentYear, setCurrentYear } = useLayerStore();
    const { t } = useLanguageStore(); // Get translation function
    const [selectedEraId, setSelectedEraId] = useState('MODERN');

    // Memoize the eras to include translations
    const eras = useMemo(() => ERA_CONFIG.map(e => ({
        ...e,
        label: t(e.key)
    })), [t]);

    const currentEra = eras.find(e => e.id === selectedEraId) || eras[2];

    // Sync selected Era if currentYear changes externally
    useEffect(() => {
        const era = eras.find(e => currentYear >= e.min && currentYear <= e.max);
        if (era && era.id !== selectedEraId) {
            setSelectedEraId(era.id);
        }
    }, [currentYear, eras, selectedEraId]);

    const handleEraChange = (era: typeof eras[0]) => {
        setSelectedEraId(era.id);
        setCurrentYear(era.default);
    };

    const formatYear = (year: number) => {
        if (year < 0) {
            const abs = Math.abs(year);
            if (abs >= 1000000000) return `${(abs / 1000000000).toFixed(1)} Billion B.C.`;
            if (abs >= 1000000) return `${(abs / 1000000).toFixed(1)} Million B.C.`;
            return `${abs} B.C.`;
        }
        return `${year} A.D.`;
    };

    return (
        <HolographicPanel>
            <div className="flex flex-col gap-3">
                {/* Era Switcher */}
                <div className="flex justify-between gap-1 mb-1">
                    {eras.map(era => (
                        <button
                            key={era.id}
                            onClick={() => handleEraChange(era)}
                            className={`
                                flex-1 py-1 text-[10px] font-mono tracking-wider border border-cyan-500/30 rounded transition-all
                                ${selectedEraId === era.id
                                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                    : 'bg-black/40 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500/50'}
                            `}
                        >
                            {era.label}
                        </button>
                    ))}
                </div>

                {/* Header & Year Display */}
                <div className="flex justify-between items-end border-b border-cyan-500/30 pb-2">
                    <span className="text-xs font-mono text-cyan-400">TEMPORAL NAVIGATION</span>
                    <span className="text-xl font-bold text-cyan-50 tracking-widest min-w-[120px] text-right">
                        {formatYear(currentYear)}
                    </span>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={currentEra.min}
                    max={currentEra.max}
                    step={currentEra.step}
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer accent-cyan-400 opacity-80 hover:opacity-100 transition-opacity"
                />

                {/* Context Labels */}
                <div className="flex justify-between text-[10px] text-cyan-600 font-mono mt-1">
                    <span>{formatYear(currentEra.min)}</span>
                    <span className="text-cyan-400/50">Current Era: {currentEra.label}</span>
                    <span>{formatYear(currentEra.max)}</span>
                </div>
            </div>
        </HolographicPanel>
    );
}
