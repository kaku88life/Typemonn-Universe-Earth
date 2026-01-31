'use client';

import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import HolographicPanel from './HolographicPanel';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Enhanced Era Configuration with visual properties
const ERA_CONFIG = [
    {
        id: 'MYTHICAL',
        key: 'era.mythical',
        label: '太古',
        min: -9999999999,
        max: -200001,
        step: 1000000,
        default: -1000000,
        color: 'from-purple-900 to-purple-700',
        accentColor: '#aa00ff',
        unitLabel: '萬年',
        description: 'Mythical Age - Beyond time itself'
    },
    {
        id: 'ANCIENT',
        key: 'era.ancient',
        label: '上古',
        min: -200000,
        max: -2001,
        step: 1000,
        default: -50000,
        color: 'from-indigo-900 to-indigo-700',
        accentColor: '#7c3aed',
        unitLabel: '年',
        description: 'Ancient History - Prehistoric era'
    },
    {
        id: 'HISTORY',
        key: 'era.history',
        label: '中世',
        min: -2000,
        max: 1979,
        step: 50,
        default: 500,
        color: 'from-blue-900 to-blue-700',
        accentColor: '#0284c7',
        unitLabel: '年',
        description: 'Medieval Era - Age of legend and history'
    },
    {
        id: 'MODERN',
        key: 'era.modern',
        label: '近代',
        min: 1980,
        max: 2100,
        step: 1,
        default: 2026,
        color: 'from-cyan-900 to-cyan-700',
        accentColor: '#00f0ff',
        unitLabel: '月',
        description: 'Modern Era - Present and near future'
    }
];

export default function TimelineSlider() {
    const { currentYear, setCurrentYear } = useLayerStore();
    const { t } = useLanguageStore();
    const [selectedEraId, setSelectedEraId] = useState('MODERN');
    const [isExpanded, setIsExpanded] = useState(false);

    // Build eras with translations
    const eras = useMemo(() => ERA_CONFIG.map(e => ({
        ...e,
        translatedLabel: t(e.key) || e.label
    })), [t]);

    const currentEra = eras.find(e => e.id === selectedEraId) || eras[3];

    // Auto-sync era when year changes externally
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

    // Enhanced year formatting with era-specific units
    const formatYear = (year: number, era?: typeof eras[0]) => {
        const targetEra = era || currentEra;

        if (year < 0) {
            const abs = Math.abs(year);
            if (abs >= 1000000) {
                return `${(abs / 1000000).toFixed(0)}M ${targetEra.unitLabel} B.C.`;
            } else if (abs >= 1000) {
                return `${(abs / 1000).toFixed(0)}K ${targetEra.unitLabel} B.C.`;
            }
            return `${abs} B.C.`;
        }
        return `${year} A.D.`;
    };

    // Calculate progress percentage for visual feedback
    const progress = ((currentYear - currentEra.min) / (currentEra.max - currentEra.min)) * 100;

    return (
        <HolographicPanel>
            <div className={`flex flex-col transition-all duration-300 ${isExpanded ? 'gap-4' : 'gap-2'}`}>

                {/* Era Switcher Buttons - Always Visible */}
                <div className="flex justify-between gap-1">
                    {eras.map((era) => (
                        <button
                            key={era.id}
                            onClick={() => handleEraChange(era)}
                            className={`
                                flex-1 py-1 px-1 text-[9px] font-mono tracking-wider border rounded transition-all duration-200
                                ${selectedEraId === era.id
                                    ? `bg-gradient-to-r ${era.color} text-white border-[${era.accentColor}] shadow-lg`
                                    : 'bg-black/40 text-cyan-700/60 border-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50'}
                            `}
                            style={selectedEraId === era.id ? {
                                borderColor: era.accentColor,
                                boxShadow: `0 0 10px ${era.accentColor}80`
                            } : {}}
                        >
                            {era.translatedLabel}
                        </button>
                    ))}
                </div>

                {/* Header with expand toggle */}
                <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase">TEMPORAL NAVIGATOR</span>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-cyan-400 hover:text-cyan-200 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? 'v' : '>'}
                    </button>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                    <div className="border-l-2 border-cyan-500/50 pl-2 space-y-1 text-[8px] text-cyan-400">
                        <div className="font-bold">{currentEra.translatedLabel}</div>
                        <div className="text-cyan-600">{currentEra.description}</div>
                        <div className="text-cyan-700">
                            Unit: {currentEra.unitLabel} | Step: {currentEra.step}
                        </div>
                    </div>
                )}

                {/* Year Display - Large and Prominent */}
                <div className="flex justify-between items-center">
                    <span className="text-[8px] text-cyan-500/60">CURRENT</span>
                    <span
                        className="text-2xl font-bold font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                        style={{ color: currentEra.accentColor }}
                    >
                        {formatYear(currentYear)}
                    </span>
                </div>

                {/* Enhanced Slider with visual feedback */}
                <div className="space-y-1">
                    {/* Progress bar background */}
                    <div className="relative h-2 bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/20">
                        <div
                            className="h-full transition-all duration-100"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: currentEra.accentColor,
                                boxShadow: `0 0 8px ${currentEra.accentColor}80`
                            }}
                        />
                    </div>

                    {/* Range slider */}
                    <input
                        type="range"
                        min={currentEra.min}
                        max={currentEra.max}
                        step={currentEra.step}
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        style={{
                            WebkitAppearance: 'slider-horizontal',
                        }}
                    />
                </div>

                {/* Era bounds with labels */}
                <div className="flex justify-between text-[8px] text-cyan-600/70 font-mono">
                    <span>{formatYear(currentEra.min)}</span>
                    <span className="text-[7px]">
                        {Math.round((currentYear - currentEra.min) / (currentEra.max - currentEra.min) * 100)}%
                    </span>
                    <span>{formatYear(currentEra.max)}</span>
                </div>

                {/* Quick navigation (nearby major events) - Only in expanded mode */}
                {isExpanded && (
                    <div className="border-t border-cyan-500/20 pt-1 mt-1">
                        <div className="text-[8px] text-cyan-500 mb-1 uppercase">KEY EVENTS</div>
                        <div className="flex gap-1 flex-wrap">
                            {currentEra.id === 'MODERN' && [
                                { label: 'FSN', year: 2004 },
                                { label: 'Today', year: 2026 },
                                { label: 'FGO', year: 2015 }
                            ].map(evt => (
                                <button
                                    key={evt.label}
                                    onClick={() => setCurrentYear(evt.year)}
                                    className="px-2 py-0.5 text-[7px] bg-cyan-500/10 border border-cyan-500/30 rounded hover:bg-cyan-500/20 transition-colors"
                                >
                                    {evt.label}
                                </button>
                            ))}
                            {currentEra.id === 'HISTORY' && [
                                { label: 'Year 0', year: 0 },
                                { label: 'Medieval', year: 1000 },
                                { label: 'Modern', year: 1979 }
                            ].map(evt => (
                                <button
                                    key={evt.label}
                                    onClick={() => setCurrentYear(evt.year)}
                                    className="px-2 py-0.5 text-[7px] bg-cyan-500/10 border border-cyan-500/30 rounded hover:bg-cyan-500/20 transition-colors"
                                >
                                    {evt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </HolographicPanel>
    );
}
