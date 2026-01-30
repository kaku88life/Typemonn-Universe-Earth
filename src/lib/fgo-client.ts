/**
 * Atlas Academy FGO API Client
 * @see https://api.atlasacademy.io/docs
 */

import type {
    BasicServant,
    NiceServant,
    BasicWar,
    BasicEvent,
    Region,
    Language,
    ClassName,
    Attribute,
    Gender,
    FGOApiError,
} from '@/types/fgo-types';

const API_BASE_URL = 'https://api.atlasacademy.io';

// Simple in-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// ============================================
// Core Fetch Utility
// ============================================

interface FetchOptions {
    region?: Region;
    lang?: Language;
    lore?: boolean;
}

async function fetchFromAPI<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { region = 'JP', lang = 'en', lore = false } = options;

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (lang) url.searchParams.set('lang', lang);
    if (lore) url.searchParams.set('lore', 'true');

    const cacheKey = url.toString();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
    }

    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
        },
        next: { revalidate: 3600 }, // Next.js cache for 1 hour
    });

    if (!response.ok) {
        const error = (await response.json()) as FGOApiError;
        throw new Error(`FGO API Error: ${error.detail || response.statusText}`);
    }

    const data = await response.json();

    // Update cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return data as T;
}

// ============================================
// Servant API
// ============================================

/**
 * Get basic servant data by ID or collectionNo
 */
export async function getServantBasic(
    servantId: number,
    options: FetchOptions = {}
): Promise<BasicServant> {
    const { region = 'JP' } = options;
    return fetchFromAPI<BasicServant>(`/basic/${region}/servant/${servantId}`, options);
}

/**
 * Get detailed servant data by ID or collectionNo
 */
export async function getServantNice(
    servantId: number,
    options: FetchOptions = {}
): Promise<NiceServant> {
    const { region = 'JP' } = options;
    return fetchFromAPI<NiceServant>(`/nice/${region}/servant/${servantId}`, options);
}

/**
 * Search servants by various criteria
 */
export interface ServantSearchParams {
    name?: string;
    className?: ClassName[];
    rarity?: number[];
    gender?: Gender[];
    attribute?: Attribute[];
    illustrator?: string;
    cv?: string;
}

export async function searchServants(
    params: ServantSearchParams,
    options: FetchOptions = {}
): Promise<BasicServant[]> {
    const { region = 'JP' } = options;

    const url = new URL(`${API_BASE_URL}/basic/${region}/servant/search`);

    if (params.name) url.searchParams.set('name', params.name);
    if (params.className?.length) {
        params.className.forEach(c => url.searchParams.append('className', c));
    }
    if (params.rarity?.length) {
        params.rarity.forEach(r => url.searchParams.append('rarity', r.toString()));
    }
    if (params.gender?.length) {
        params.gender.forEach(g => url.searchParams.append('gender', g));
    }
    if (params.attribute?.length) {
        params.attribute.forEach(a => url.searchParams.append('attribute', a));
    }
    if (params.illustrator) url.searchParams.set('illustrator', params.illustrator);
    if (params.cv) url.searchParams.set('cv', params.cv);

    if (options.lang) url.searchParams.set('lang', options.lang);

    const cacheKey = url.toString();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as BasicServant[];
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
}

// ============================================
// War API (Story Chapters)
// ============================================

/**
 * Get war (story chapter) data by ID
 */
export async function getWarBasic(
    warId: number,
    options: FetchOptions = {}
): Promise<BasicWar> {
    const { region = 'JP' } = options;
    return fetchFromAPI<BasicWar>(`/basic/${region}/war/${warId}`, options);
}

// ============================================
// Event API
// ============================================

/**
 * Get event data by ID
 */
export async function getEventBasic(
    eventId: number,
    options: FetchOptions = {}
): Promise<BasicEvent> {
    const { region = 'JP' } = options;
    return fetchFromAPI<BasicEvent>(`/basic/${region}/event/${eventId}`, options);
}

// ============================================
// Static Export Files (Bulk Data)
// ============================================

/**
 * Get all servants (basic data) from static export
 * Use sparingly - this is a large file
 */
export async function getAllServantsBasic(
    region: Region = 'JP',
    lang: Language = 'en'
): Promise<BasicServant[]> {
    const filename = lang === 'en'
        ? `basic_servant_lang_en.json`
        : `basic_servant.json`;

    return fetchFromAPI<BasicServant[]>(`/export/${region}/${filename}`);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get servant face/portrait URL
 */
export function getServantFaceUrl(servant: BasicServant): string {
    return servant.face;
}

/**
 * Get servant full art URL (for NiceServant)
 */
export function getServantArtUrl(
    servant: NiceServant,
    ascension: number = 1
): string | undefined {
    return servant.extraAssets?.charaGraph?.ascension?.[ascension.toString()];
}

/**
 * Get class icon URL
 */
export function getClassIconUrl(className: ClassName, rarity: number = 5): string {
    const gold = rarity >= 4;
    return `https://static.atlasacademy.io/JP/ClassIcons/class3_${gold ? 'gold' : 'silver'}_${className}.png`;
}

/**
 * Format rarity as stars
 */
export function formatRarity(rarity: number): string {
    return '★'.repeat(rarity);
}

/**
 * Clear the API cache
 */
export function clearCache(): void {
    cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: cache.size,
        keys: Array.from(cache.keys()),
    };
}
