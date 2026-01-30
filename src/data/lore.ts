// Lore Data Source
// This file serves as the mock database for the application.

export interface RelatedWork {
    id: string;
    titleKey: string; // Translation key
    imageUrl: string;
}

export interface RelatedCharacter {
    id: string;
    nameKey: string; // Translation key
    imageUrl: string;
    descriptionKey?: string;
}

export interface LoreLocation {
    id: string;
    lat: number;
    lng: number;
    nameKey: string;
    descKey: string;
    color: string;
    type: 'City' | 'MagicAssociation' | 'Ruins' | 'Other';
    year_start?: number;
    year_end?: number;
    label?: string; // Fallback

    // Relations
    relatedWorks: RelatedWork[];
    relatedCharacters: RelatedCharacter[];
    world_lines: string[];
}

export const SAMPLE_LOCATIONS: LoreLocation[] = [
    {
        id: '1',
        lat: 34.68,
        lng: 135.18,
        label: 'Fuyuki',
        nameKey: 'loc.fuyuki.name',
        descKey: 'loc.fuyuki.desc',
        color: '#ff2222',
        type: 'City',
        year_start: 1990,
        year_end: 2004,
        world_lines: ['Fate', 'UBW', 'HF', 'Zero'],
        relatedWorks: [
            { id: 'fsn', titleKey: 'work.fsn', imageUrl: '/images/fsn_cover.jpg' },
            { id: 'fz', titleKey: 'work.fz', imageUrl: '/images/fz_cover.jpg' }
        ],
        relatedCharacters: [
            { id: 'saber', nameKey: 'char.saber', imageUrl: '/images/saber_thumb.jpg' },
            { id: 'rin', nameKey: 'char.rin', imageUrl: '/images/rin_thumb.jpg' },
            { id: 'shirou', nameKey: 'char.shirou', imageUrl: '/images/shirou_thumb.jpg' }
        ]
    },
    {
        id: '2',
        lat: 51.50,
        lng: -0.12,
        label: 'London',
        nameKey: 'loc.clocktower.name',
        descKey: 'loc.clocktower.desc',
        color: '#0088ff',
        type: 'MagicAssociation',
        year_start: 1800,
        year_end: 9999,
        world_lines: ['Case Files', 'Fate', 'Tsukihime'],
        relatedWorks: [
            { id: 'casefiles', titleKey: 'work.casefiles', imageUrl: '/images/casefiles_cover.jpg' }
        ],
        relatedCharacters: [
            { id: 'waver', nameKey: 'char.waver', imageUrl: '/images/waver_thumb.jpg' },
            { id: 'zelretch', nameKey: 'char.zelretch', imageUrl: '/images/zelretch_thumb.jpg' }
        ]
    },
];
