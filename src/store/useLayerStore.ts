import { create } from 'zustand';
import { getLocations } from '@/app/actions';
import { SAMPLE_LOCATIONS } from '@/data/lore';

type LayerType = 'SURFACE' | 'REVERSE_SIDE' | 'CHALDEAS';

export interface LocationData {
    id: string;
    name: string;
    description: string | null;
    coordinates: any; // Prisma Json type is any/unknown by default
    type: string;
    world_lines: string[];
    year_start: number;
    year_end?: number | null;
    color?: string; // Derived in frontend depending on type

    // Optional properties for detailed view
    relatedWorks?: any[];
    relatedCharacters?: any[];
    nameKey?: string;
    descKey?: string;
    lat?: number;
    lng?: number;
}

// View Hierarchy
type ViewLevel = 'GLOBAL' | 'CONTINENT' | 'COUNTRY';

export interface Region {
    id: string;
    name: string;
    type: 'CONTINENT' | 'COUNTRY';
    lat: number;
    lng: number;
    children?: Region[] | LocationData[]; // Sub-regions or final locations
    count?: number; // Number of contained locations
}

interface LayerState {
    currentLayer: LayerType;
    showReverseSide: boolean;
    toggleReverseSide: () => void;
    setLayer: (layer: LayerType) => void;

    // Data
    locations: LocationData[];
    fetchLocations: () => Promise<void>;

    // Hierarchy Navigation
    viewLevel: ViewLevel;
    focusedRegion: Region | null;
    setViewLevel: (level: ViewLevel) => void;
    setFocusedRegion: (region: Region | null) => void;

    // Derived Data (Computed)
    continentRegions: Region[]; // For Global View
    countryRegions: Region[];   // For Continent View

    // Timeline
    currentYear: number;
    setCurrentYear: (year: number) => void;

    // Selection
    selectedLocation: LocationData | null;
    setSelectedLocation: (loc: LocationData | null) => void;
}

// Helper to map location to region
const getRegionForLocation = (loc: LocationData): { continent: string, country: string } => {
    // Simple mapping based on known locations or coordinates could be done here
    // For now, we'll map known locations or use rough coordinate bounds
    const lat = loc.lat ?? loc.coordinates?.lat ?? 0;
    const lng = loc.lng ?? loc.coordinates?.lng ?? 0;

    // Very rough bounding boxes
    if (lng > 60 && lng < 150 && lat > 0) return { continent: 'Asia', country: lng > 120 ? 'Japan' : 'China' }; // Fuyuki is in Japan
    if (lng > -10 && lng < 40 && lat > 35) return { continent: 'Europe', country: lng < 2 ? 'UK' : (lat < 48 ? 'Italy' : 'France') };
    if (lng < -50 && lat > 15) return { continent: 'North America', country: 'USA' };
    if (lng < -30 && lat < 15) return { continent: 'South America', country: 'Brazil' };
    if (lng > 30 && lng < 60 && lat < 30) return { continent: 'Africa', country: 'Egypt' };

    return { continent: 'Unknown', country: 'Unknown' };
};

export const useLayerStore = create<LayerState>((set, get) => ({
    currentLayer: 'SURFACE',
    showReverseSide: false,
    toggleReverseSide: () => set((state) => ({
        showReverseSide: !state.showReverseSide,
        currentLayer: !state.showReverseSide ? 'REVERSE_SIDE' : 'SURFACE'
    })),
    setLayer: (layer) => set({ currentLayer: layer }),

    locations: [],
    continentRegions: [],
    countryRegions: [],

    viewLevel: 'GLOBAL',
    focusedRegion: null,

    setViewLevel: (level) => set({ viewLevel: level }),
    setFocusedRegion: (region) => {
        set({ focusedRegion: region });
        if (!region) {
            set({ viewLevel: 'GLOBAL' });
        } else if (region.type === 'CONTINENT') {
            set({ viewLevel: 'CONTINENT' });
        } else if (region.type === 'COUNTRY') {
            set({ viewLevel: 'COUNTRY' });
        }
    },

    fetchLocations: async () => {
        try {
            // Call Server Action
            let data = await getLocations();

            // Fallback to sample data if DB is empty (for debugging)
            if (!data || data.length === 0) {
                console.warn('⚠️ No data from DB, using SAMPLE_LOCATIONS for debugging');
                data = SAMPLE_LOCATIONS as any;
            }

            if (data) {
                // Map Prisma colors based on type
                const mappedData = data.map((loc: any) => {
                    let color = '#ffffff';
                    if (loc.type === 'City') color = '#00f0ff'; // Cyan
                    if (loc.type === 'MagicAssociation') color = '#aa00ff'; // Purple
                    if (loc.type === 'Singularity') color = '#ff0055'; // Red
                    if (loc.type === 'Landmark') color = '#00ff88'; // Green
                    if (loc.type === 'ReverseSide') color = '#ffd700'; // Gold

                    return { ...loc, color };
                });

                // COMPUTE HIERARCHY
                const continentMap = new Map<string, Region>();
                const countryMap = new Map<string, Region>(); // Key: "Country-Continent"

                mappedData.forEach((loc: LocationData) => {
                    const { continent, country } = getRegionForLocation(loc);

                    // 1. Continent
                    if (!continentMap.has(continent)) {
                        continentMap.set(continent, {
                            id: continent,
                            name: continent,
                            type: 'CONTINENT',
                            lat: loc.lat ?? 0,
                            lng: loc.lng ?? 0,
                            children: [],
                            count: 0
                        });
                    }
                    const cont = continentMap.get(continent)!;
                    cont.count = (cont.count || 0) + 1;

                    // 2. Country
                    const countryKey = `${country}-${continent}`;
                    if (!countryMap.has(countryKey)) {
                        const region: Region = {
                            id: countryKey,
                            name: country,
                            type: 'COUNTRY',
                            lat: loc.lat ?? 0,
                            lng: loc.lng ?? 0,
                            children: [], // Will hold locations
                            count: 0
                        };
                        countryMap.set(countryKey, region);
                        (cont.children as Region[]).push(region);
                    }
                    const ctry = countryMap.get(countryKey)!;

                    // Add Location to Country
                    (ctry.children as LocationData[]).push(loc);
                    ctry.count = (ctry.count || 0) + 1;

                    // Update centroids (simple average)
                    // ... skipping avg logic for brevity, using first point
                });

                set({
                    locations: mappedData,
                    continentRegions: Array.from(continentMap.values()),
                    countryRegions: Array.from(countryMap.values()) // Flattened list if needed
                });
            }
        } catch (e) {
            console.error("Failed to fetch locations", e);
        }
    },

    currentYear: new Date().getFullYear(), // Default to Real Time
    setCurrentYear: (year) => set({ currentYear: year }),

    selectedLocation: null,
    setSelectedLocation: (loc) => set({ selectedLocation: loc })
}));
