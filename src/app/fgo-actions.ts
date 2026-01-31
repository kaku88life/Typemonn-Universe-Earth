'use server';

/**
 * FGO Server Actions
 * Server-side functions for interacting with Atlas Academy API
 */

import {
    getServantBasic,
    getServantNice,
    searchServants,
    getWarBasic,
    type ServantSearchParams,
} from '@/lib/fgo-client';
import type { BasicServant, NiceServant, BasicWar } from '@/types/fgo-types';

// ============================================
// Servant Actions
// ============================================

/**
 * Get a single servant by ID
 */
export async function fetchServant(servantId: number): Promise<NiceServant | null> {
    try {
        const servant = await getServantNice(servantId, { lang: 'en', lore: true });
        return servant;
    } catch (error) {
        console.error(`Failed to fetch servant ${servantId}:`, error);
        return null;
    }
}

/**
 * Get basic servant info (lightweight)
 */
export async function fetchServantBasic(servantId: number): Promise<BasicServant | null> {
    try {
        const servant = await getServantBasic(servantId, { lang: 'en' });
        return servant;
    } catch (error) {
        console.error(`Failed to fetch servant ${servantId}:`, error);
        return null;
    }
}

/**
 * Search for servants
 */
export async function findServants(params: ServantSearchParams): Promise<BasicServant[]> {
    try {
        const servants = await searchServants(params, { lang: 'en' });
        return servants;
    } catch (error) {
        console.error('Failed to search servants:', error);
        return [];
    }
}

/**
 * Get multiple servants by their IDs
 */
export async function fetchServantsById(servantIds: number[]): Promise<BasicServant[]> {
    const results = await Promise.all(
        servantIds.map(async (id) => {
            try {
                return await getServantBasic(id, { lang: 'en' });
            } catch {
                return null;
            }
        })
    );
    return results.filter((s): s is BasicServant => s !== null);
}

// ============================================
// War (Story Chapter) Actions
// ============================================

/**
 * Get war/story chapter data
 */
export async function fetchWar(warId: number): Promise<BasicWar | null> {
    try {
        const war = await getWarBasic(warId, { lang: 'en' });
        return war;
    } catch (error) {
        console.error(`Failed to fetch war ${warId}:`, error);
        return null;
    }
}

// ============================================
// Location-Servant Mapping
// ============================================

/**
 * Get servants associated with a location
 * This is a curated mapping - FGO doesn't have explicit location data
 * Uses lowercase location name for matching (e.g., "fuyuki city (冬木市)" -> "fuyuki")
 */
export async function getServantsForLocation(locationName: string): Promise<BasicServant[]> {
    // Normalize the name for matching
    const normalizedName = locationName.toLowerCase();

    // Hardcoded mappings for Type-Moon locations
    // Keys are substrings that appear in location names
    const locationServantMap: Record<string, number[]> = {
        // Japan
        'fuyuki': [1, 2, 5, 6, 7, 9, 10, 11, 14], // Mash, Artoria, Cu, EMIYA, Gilgamesh, Medusa, Herakles
        'misaki': [167, 236], // Shiki variants
        'mifune': [56, 186], // Ryougi Shiki variants
        'tohno': [167, 236], // Shiki Tohno related
        'einzbern': [2, 3, 15, 16], // Artoria, Irisviel
        'ryuudou': [7, 40, 115], // Medea, Assassin
        'homurahara': [5, 6, 7, 11], // FSN main cast
        'garan': [56], // Ryougi Shiki

        // Europe
        'clock tower': [36, 45, 67, 127, 145], // Lord El-Melloi cast
        'london': [27, 36, 45, 67, 117], // Jekyll, Mordred, Jack
        'albion': [127, 36], // Waver, etc
        'camelot': [2, 4, 17, 25, 58, 121, 123, 126], // Round Table Knights
        'avalon': [2, 68], // Artoria, Merlin
        'orleans': [13, 22, 26, 33, 59], // Jeanne, Gilles, Marie
        'rome': [6, 23, 41, 43, 50, 51], // Nero, Caesar, Romulus

        // Middle East
        'uruk': [52, 138, 80, 76, 139], // Gilgamesh Caster, Enkidu, Ishtar, Ereshkigal
        'babylon': [52, 60, 139, 140], // Gilgamesh, Ishtar
        'jerusalem': [24, 38, 100, 131], // Richard, Saladin (approximations)

        // Americas
        'e pluribus': [57, 66, 70, 78, 79], // American heroes
        'salem': [74, 135, 163, 195], // Salem characters
        'agartha': [166, 167, 168, 169], // Scheherazade, Wu Zetian
        'okeanos': [19, 29, 34, 44, 71], // Drake, Blackbeard, pirates

        // Lostbelts
        'permafrost': [142, 174, 175], // Ivan, Anastasia
        'ice flame': [160, 176], // Skadi, Sigurd, Brynhild
        'synchronized': [133, 177, 178], // Qin Shi Huang
        'genesis': [83, 180, 181], // Arjuna Alter, Karna
        'ocean.*titan': [88, 182, 183, 184], // Olympus cast
        'fairy': [231, 232, 233, 234], // Lostbelt 6 cast
        'golden.*tree': [300, 301], // Lostbelt 7 cast

        // Mages Association
        'atlas institute': [187, 200], // Sion related
        'wandering sea': [261, 153], // Da Vinci, Chaldea staff

        // Special
        'chaldea': [1, 261, 153, 108], // Mash, Da Vinci, Romani
        'moon cell': [18, 19, 20, 21, 49], // Nero, Tamamo, Extra cast
        'se.ra.ph': [18, 19, 20, 21, 163], // CCC cast
        'root': [56], // Ryougi Shiki - connected to Root
        'reverse side': [2, 68, 191], // Phantasmal species

        // FGO Events/Other
        'shinjuku': [165, 166], // Shinjuku cast
        'shimousa': [56, 167, 188], // Musashi, swordsmen
        'egypt': [62, 63, 64, 65], // Ozymandias, Nitocris, Cleopatra
        'troy': [8, 85, 86], // Hector, Paris
    };

    // Find matching servants by checking if any key is contained in the location name
    for (const [key, servantIds] of Object.entries(locationServantMap)) {
        if (normalizedName.includes(key) || new RegExp(key).test(normalizedName)) {
            return fetchServantsById(servantIds);
        }
    }

    // No match found
    return [];
}

/**
 * Get featured servants (for showcase purposes)
 */
export async function getFeaturedServants(): Promise<BasicServant[]> {
    // Featured servants: popular/iconic characters
    const featuredIds = [2, 5, 9, 10, 11, 52]; // Artoria, Cu, EMIYA, Gilgamesh, Tamamo, etc.
    return fetchServantsById(featuredIds);
}
