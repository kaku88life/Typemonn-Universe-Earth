import { create } from 'zustand';
import { getLocations } from '@/app/actions';

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
}

interface LayerState {
    currentLayer: LayerType;
    showReverseSide: boolean;
    toggleReverseSide: () => void;
    setLayer: (layer: LayerType) => void;

    // Data
    locations: LocationData[];
    fetchLocations: () => Promise<void>;

    // Timeline
    currentYear: number;
    setCurrentYear: (year: number) => void;

    // Selection
    selectedLocation: LocationData | null;
    setSelectedLocation: (loc: LocationData | null) => void;
}

export const useLayerStore = create<LayerState>((set) => ({
    currentLayer: 'SURFACE',
    showReverseSide: false,
    toggleReverseSide: () => set((state) => ({
        showReverseSide: !state.showReverseSide,
        currentLayer: !state.showReverseSide ? 'REVERSE_SIDE' : 'SURFACE'
    })),
    setLayer: (layer) => set({ currentLayer: layer }),

    locations: [],
    fetchLocations: async () => {
        try {
            // Call Server Action
            const data = await getLocations();

            if (data) {
                // Map Prisma colors based on type
                const mappedData = data.map((loc: any) => {
                    let color = '#ffffff';
                    if (loc.type === 'City') color = '#ff2222'; // Fuyuki
                    if (loc.type === 'MagicAssociation') color = '#0088ff'; // Clock Tower
                    if (loc.type === 'Organization') color = '#ffffff'; // Chaldea
                    if (loc.type === 'Landmark') color = '#FFD700'; // Spirit Tomb

                    return { ...loc, color };
                });
                set({ locations: mappedData });
            }
        } catch (e) {
            console.error("Failed to fetch locations", e);
        }
    },

    currentYear: 2004, // Default to FSN
    setCurrentYear: (year) => set({ currentYear: year }),

    selectedLocation: null,
    setSelectedLocation: (loc) => set({ selectedLocation: loc })
}));
