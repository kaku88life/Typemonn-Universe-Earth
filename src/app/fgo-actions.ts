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
        'fuyuki': [1, 2, 5, 6, 7, 9, 10, 11], // Mash, Artoria, Cu, EMIYA, Gilgamesh, Medusa
        'clock tower': [36, 45, 67, 127], // Mordred, Jekyll, Waver, etc.
        'london': [27, 36, 45, 67], // Jekyll, Mordred, etc.
        'chaldea': [1, 261, 153, 108], // Mash, Da Vinci, Romani
        'uruk': [52, 138, 80, 76], // Gilgamesh Caster, Enkidu, Ana
        'camelot': [4, 17, 25, 58, 123], // Artoria variants, Bedivere, Lancelot
        'misaki': [53, 164], // Shiki Tohno-related
        'mifune': [56, 186], // Ryougi Shiki
        'atlas institute': [187, 200], // Atlas characters
        'antarctic': [1, 261], // Mash, Da Vinci
    };

    // Find matching servants by checking if any key is contained in the location name
    for (const [key, servantIds] of Object.entries(locationServantMap)) {
        if (normalizedName.includes(key)) {
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
