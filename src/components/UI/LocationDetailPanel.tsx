'use client';

import { useEffect, useState } from 'react';
import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore'; // I18N
import HolographicPanel from './HolographicPanel';
import { X, BookOpen, Users, Swords } from 'lucide-react'; // Icons
import { AnimatePresence, motion } from 'framer-motion';
import { RelatedWork, RelatedCharacter } from '@/data/lore';
import { ServantGrid, ServantGridSkeleton } from '@/components/ServantCard';
import { getServantsForLocation } from '@/app/fgo-actions';
import type { BasicServant } from '@/types/fgo-types';

export default function LocationDetailPanel() {
    const { selectedLocation, setSelectedLocation } = useLayerStore();
    const { t } = useLanguageStore();
    const [servants, setServants] = useState<BasicServant[]>([]);
    const [loadingServants, setLoadingServants] = useState(false);

    // Fetch FGO servants when location changes
    useEffect(() => {
        if (selectedLocation?.name) {
            setLoadingServants(true);
            getServantsForLocation(selectedLocation.name)
                .then(setServants)
                .catch(console.error)
                .finally(() => setLoadingServants(false));
        } else {
            setServants([]);
        }
    }, [selectedLocation?.name]);

    // Helper method to safely access array properties
    // (Since selectedLocation type might be loose in the store)
    const works: RelatedWork[] = selectedLocation?.relatedWorks || [];
    const characters: RelatedCharacter[] = selectedLocation?.relatedCharacters || [];

    return (
        <AnimatePresence>
            {selectedLocation && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    style={{
                        position: 'fixed',
                        left: '24px', // Moved to left
                        top: '50%',   // Vertically centered
                        transform: 'translateY(-50%)', // Centering correction
                        width: '300px', // Reduced width
                        zIndex: 60,
                        pointerEvents: 'auto',
                        maxHeight: '70vh', // Limit height
                        overflowY: 'auto'
                    }}
                    className="custom-scrollbar"
                >
                    <HolographicPanel className="relative flex flex-col gap-3">
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="absolute top-2 right-2 p-1 text-cyan-500/50 hover:text-white transition-colors hover:bg-cyan-900/50 rounded-full"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <div>
                            <span className="text-xs font-mono text-cyan-400 border border-cyan-500/50 px-2 py-0.5 rounded">
                                {selectedLocation.type?.toUpperCase()}
                            </span>
                            <h2 className="text-2xl font-bold text-white mt-1 mb-1 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
                                {selectedLocation.nameKey ? t(selectedLocation.nameKey) : selectedLocation.name}
                            </h2>
                            <div className="text-xs font-mono text-cyan-600">
                                COORD: {selectedLocation.coordinates?.lat?.toFixed(2) ?? selectedLocation.lat?.toFixed(2) ?? '?'},
                                {selectedLocation.coordinates?.lng?.toFixed(2) ?? selectedLocation.lng?.toFixed(2) ?? '?'}
                            </div>
                        </div>

                        <p className="text-cyan-100/80 text-sm leading-relaxed border-b border-cyan-500/20 pb-4">
                            {selectedLocation.descKey ? t(selectedLocation.descKey) : selectedLocation.description}
                        </p>

                        {/* RELATED WORKS */}
                        {works.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" />
                                    RELATED WORKS
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {works.map((work) => (
                                        <div key={work.id} className="flex items-center gap-3 bg-cyan-950/30 p-2 rounded border border-cyan-500/10">
                                            {/* Placeholder for Cover */}
                                            <div className="w-8 h-10 bg-cyan-900/50 flex flex-col items-center justify-center text-[8px] text-cyan-500/50 overflow-hidden shrink-0">
                                                IMG
                                            </div>
                                            <span className="text-sm text-cyan-100">{t(work.titleKey)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* RELATED CHARACTERS */}
                        {characters.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    KEY CHARACTERS
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {characters.map((char) => (
                                        <div key={char.id} className="flex flex-col items-center gap-1 group cursor-pointer">
                                            {/* Avatar Circle */}
                                            <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_5px_cyan]">
                                                {/* Placeholder */}
                                                <span className="text-[8px] text-cyan-500/70">{char.id.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                            <span className="text-[9px] text-center text-cyan-200/80 leading-tight group-hover:text-white transition-colors">
                                                {t(char.nameKey)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CHARACTERS (A-Z) */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2 px-1">
                                <Swords className="w-3 h-3" />
                                CHARACTERS (A-Z)
                            </h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
                                {loadingServants ? (
                                    <ServantGridSkeleton count={4} />
                                ) : servants.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {servants
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((servant) => (
                                                <div
                                                    key={servant.id}
                                                    className="flex items-center gap-2 bg-cyan-950/30 p-1.5 rounded-lg border border-cyan-500/10 hover:bg-cyan-900/40 hover:border-cyan-500/30 transition-all group cursor-pointer"
                                                >
                                                    {/* Avatar */}
                                                    <div className="relative w-9 h-9 rounded overflow-hidden border border-cyan-500/20 shrink-0">
                                                        <img
                                                            src={servant.face}
                                                            alt={servant.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-bold text-cyan-100 truncate group-hover:text-white transition-colors">
                                                                {servant.name}
                                                            </p>
                                                            <span className="text-[10px] text-yellow-500 font-mono">
                                                                {'★'.repeat(servant.rarity)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-cyan-400/70 capitalize">
                                                            {servant.className}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-cyan-600/50 italic px-1">No character data available</p>
                                )}
                            </div>
                        </div>

                        {/* WORLD LINES */}
                        {selectedLocation.world_lines && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {selectedLocation.world_lines.map((line: string) => (
                                    <span key={line} className="px-2 py-1 bg-cyan-900/40 text-cyan-500 text-[10px] uppercase rounded-full tracking-wider border border-cyan-500/20">
                                        {line}
                                    </span>
                                ))}
                            </div>
                        )}
                    </HolographicPanel>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
