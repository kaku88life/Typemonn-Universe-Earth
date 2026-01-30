'use client';

/**
 * ServantCard - Display FGO Servant information
 * Glassmorphism style matching the holographic theme
 */

import Image from 'next/image';
import type { BasicServant, NiceServant, ClassName } from '@/types/fgo-types';
import { getClassIconUrl, formatRarity } from '@/lib/fgo-client';

// ============================================
// Class Colors
// ============================================

const classColors: Record<ClassName, string> = {
    saber: 'from-blue-400 to-blue-600',
    archer: 'from-red-400 to-red-600',
    lancer: 'from-sky-400 to-sky-600',
    rider: 'from-pink-400 to-pink-600',
    caster: 'from-purple-400 to-purple-600',
    assassin: 'from-gray-400 to-gray-600',
    berserker: 'from-orange-400 to-orange-600',
    shielder: 'from-violet-400 to-violet-600',
    ruler: 'from-yellow-400 to-yellow-600',
    alterEgo: 'from-fuchsia-400 to-fuchsia-600',
    avenger: 'from-slate-400 to-slate-600',
    moonCancer: 'from-indigo-400 to-indigo-600',
    foreigner: 'from-emerald-400 to-emerald-600',
    pretender: 'from-rose-400 to-rose-600',
    beast: 'from-red-600 to-red-800',
    unknown: 'from-gray-400 to-gray-600',
};

// ============================================
// Compact Card (for lists)
// ============================================

interface ServantCardProps {
    servant: BasicServant;
    onClick?: () => void;
    selected?: boolean;
}

export function ServantCard({ servant, onClick, selected }: ServantCardProps) {
    const classColor = classColors[servant.className] || classColors.unknown;

    return (
        <button
            onClick={onClick}
            className={`
        group relative overflow-hidden rounded-lg
        bg-gradient-to-br ${classColor}
        p-[2px] transition-all duration-300
        hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
        ${selected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}
      `}
        >
            <div className="relative bg-slate-900/90 rounded-[6px] p-2 backdrop-blur-sm">
                {/* Rarity Stars */}
                <div className="absolute top-1 left-1 text-yellow-400 text-[10px] drop-shadow-glow">
                    {formatRarity(servant.rarity)}
                </div>

                {/* Servant Face */}
                <div className="relative w-16 h-16 mx-auto overflow-hidden rounded">
                    <Image
                        src={servant.face}
                        alt={servant.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized // Atlas Academy images are external
                    />
                </div>

                {/* Class Icon */}
                <div className="absolute top-1 right-1 w-5 h-5">
                    <Image
                        src={getClassIconUrl(servant.className, servant.rarity)}
                        alt={servant.className}
                        width={20}
                        height={20}
                        unoptimized
                    />
                </div>

                {/* Name */}
                <p className="mt-1 text-[10px] text-center text-white/90 truncate font-medium">
                    {servant.name}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </button>
    );
}

// ============================================
// Detail Card (for selected servant)
// ============================================

interface ServantDetailCardProps {
    servant: NiceServant;
    onClose?: () => void;
}

export function ServantDetailCard({ servant, onClose }: ServantDetailCardProps) {
    const classColor = classColors[servant.className] || classColors.unknown;
    const artUrl = servant.extraAssets?.charaGraph?.ascension?.['4']
        || servant.extraAssets?.charaGraph?.ascension?.['1']
        || servant.face;

    return (
        <div className="relative bg-slate-900/95 backdrop-blur-md rounded-xl overflow-hidden border border-cyan-500/30">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${classColor} p-4`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-yellow-300 text-sm">
                            {formatRarity(servant.rarity)}
                        </p>
                        <h3 className="text-xl font-bold text-white">{servant.name}</h3>
                        <p className="text-white/70 text-sm capitalize">{servant.className}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Art */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={artUrl}
                    alt={servant.name}
                    fill
                    className="object-cover object-top"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-800/50 rounded p-2">
                        <span className="text-cyan-400">ATK</span>
                        <span className="float-right text-white">{servant.atkMax.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                        <span className="text-green-400">HP</span>
                        <span className="float-right text-white">{servant.hpMax.toLocaleString()}</span>
                    </div>
                </div>

                {/* Skills Preview */}
                <div>
                    <p className="text-xs text-cyan-400 mb-2">Skills</p>
                    <div className="flex gap-2">
                        {servant.skills.slice(0, 3).map((skill) => (
                            <div
                                key={skill.id}
                                className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30"
                                title={skill.name}
                            >
                                {skill.icon && (
                                    <Image
                                        src={skill.icon}
                                        alt={skill.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile (if available) */}
                {servant.profile && (
                    <div className="text-xs text-white/70">
                        <p><span className="text-cyan-400">CV:</span> {servant.profile.cv}</p>
                        <p><span className="text-cyan-400">Illustrator:</span> {servant.profile.illustrator}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// Servant Grid
// ============================================

interface ServantGridProps {
    servants: BasicServant[];
    onSelect?: (servant: BasicServant) => void;
    selectedId?: number;
    maxDisplay?: number;
}

export function ServantGrid({
    servants,
    onSelect,
    selectedId,
    maxDisplay = 12
}: ServantGridProps) {
    const displayServants = servants.slice(0, maxDisplay);
    const hasMore = servants.length > maxDisplay;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
                {displayServants.map((servant) => (
                    <ServantCard
                        key={servant.id}
                        servant={servant}
                        onClick={() => onSelect?.(servant)}
                        selected={servant.id === selectedId}
                    />
                ))}
            </div>
            {hasMore && (
                <p className="text-xs text-cyan-400/60 text-center">
                    +{servants.length - maxDisplay} more
                </p>
            )}
        </div>
    );
}

// ============================================
// Loading Skeleton
// ============================================

export function ServantCardSkeleton() {
    return (
        <div className="bg-slate-800/50 rounded-lg p-2 animate-pulse">
            <div className="w-16 h-16 mx-auto bg-slate-700 rounded" />
            <div className="mt-1 h-3 bg-slate-700 rounded mx-2" />
        </div>
    );
}

export function ServantGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <ServantCardSkeleton key={i} />
            ))}
        </div>
    );
}
