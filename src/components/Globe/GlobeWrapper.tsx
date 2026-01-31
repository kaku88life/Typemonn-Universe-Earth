'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLayerStore } from '@/store/useLayerStore';
import { useLanguageStore } from '@/store/useLanguageStore'; // I18n
import { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { SAMPLE_LOCATIONS } from '@/data/lore'; // We will create this next

// Dynamically import Globe
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const CONTINENT_COLORS: Record<string, string> = {
    'Asia': 'rgba(0, 255, 255, 0.2)',
    'Europe': 'rgba(0, 100, 255, 0.2)',
    'Africa': 'rgba(255, 200, 0, 0.2)',
    'North America': 'rgba(0, 255, 100, 0.2)',
    'South America': 'rgba(255, 50, 100, 0.2)',
    'Oceania': 'rgba(150, 0, 255, 0.2)',
    'Antarctica': 'rgba(255, 255, 255, 0.2)',
};

const TYPE_COLORS: Record<string, string> = {
    'City': '#00f0ff', // Cyan
    'Landmark': '#00ff88', // Green
    'Organization': '#aa00ff', // Purple
    'MagicAssociation': '#aa00ff', // Purple
    'ReverseSide': '#ffd700', // Gold
    'Lostbelt': '#ffffff', // White
    'Singularity': '#ff0055', // Red
    'Event': '#ff0055', // Red
    'default': '#00f0ff'
};

// Custom Sphere Object
const getSphereMarker = (d: any) => {
    const color = TYPE_COLORS[d.type] || TYPE_COLORS.default;

    // Different geometry based on type? For now just size/color
    const size = d.type === 'Lostbelt' || d.type === 'ReverseSide' ? 0.8 : 0.6;

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        shininess: 100,
        transparent: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ...d, type: 'marker', color }; // Store color for hover effects
    return mesh;
};

export default function GlobeWrapper() {
    const {
        showReverseSide, locations, fetchLocations, currentYear, setSelectedLocation,
        viewLevel, setViewLevel, focusedRegion, setFocusedRegion,
        continentRegions, countryRegions
    } = useLayerStore();
    const { t, language } = useLanguageStore();

    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    const [countries, setCountries] = useState({ features: [] });
    const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    // === DATA DEPENDING ON VIEW LEVEL ===
    const displayData = useMemo(() => {
        if (viewLevel === 'GLOBAL') {
            // SHOW ALL LOCATIONS (Filtered by Year)
            // User prefers seeing dots over strict drill-down at global level for now.
            return locations
                .filter(loc => {
                    const start = loc.year_start ?? -9999999999;
                    const end = loc.year_end ?? 9999999999; // If no end date, location is "ongoing"
                    return currentYear >= start && currentYear <= end;
                })
                .map(loc => ({
                    ...loc,
                    label: loc.name,
                    color: TYPE_COLORS[loc.type] || TYPE_COLORS.default,
                    size: 0.6,
                    alt: 0.02
                }));
        }
        if (viewLevel === 'CONTINENT') {
            // Show Countries in this continent
            if (focusedRegion) {
                return countryRegions
                    .filter(c => c.id.endsWith(focusedRegion.id)) // id is "Country-Continent"
                    .map(c => ({
                        ...c,
                        label: c.name,
                        color: '#00f0ff',
                        size: 1.5, // Increased from 1.0
                        alt: 0.05
                    }));
            }
            return [];
        }
        if (viewLevel === 'COUNTRY') {
            // Show Actual Locations for this country
            if (focusedRegion && focusedRegion.children) {
                return (focusedRegion.children as any[])
                    .filter(loc => {
                        const start = loc.year_start ?? -9999999999;
                        const end = loc.year_end ?? 9999999999; // If no end date, location is "ongoing"
                        return currentYear >= start && currentYear <= end;
                    })
                    .map(loc => ({
                        ...loc,
                        lat: loc.coordinates?.lat ?? loc.lat,
                        lng: loc.coordinates?.lng ?? loc.lng,
                        label: loc.name,
                        color: TYPE_COLORS[loc.type] || TYPE_COLORS.default,
                        size: loc.type === 'Lostbelt' ? 1.2 : 0.8, // Increased size
                        alt: 0.05
                    }));
            }
            return [];
        }
        return [];
    }, [viewLevel, focusedRegion, continentRegions, countryRegions, locations]);


    useEffect(() => {
        setMounted(true);

        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(r => r.json())
            .then(setCountries);
    }, []);

    useEffect(() => {
        if (mounted && globeEl.current) {
            const scene = globeEl.current.scene();
            const ambient = new THREE.AmbientLight(0xffffff, 1.2);
            const dir = new THREE.DirectionalLight(0xffffff, 2.0);
            dir.position.set(20, 20, 20);
            scene.add(ambient, dir);
            globeEl.current.pointOfView({ lat: 35.6, lng: 136.0, altitude: 2.5 });
        }
    }, [mounted]);

    const handleObjectClick = (d: any) => {
        if (!globeEl.current) return;

        if (d.type === 'CONTINENT') {
            // Zoom in to Continent
            setFocusedRegion(d);
            globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.5 }, 1000);
        } else if (d.type === 'COUNTRY') {
            // Zoom in to Country
            setFocusedRegion(d);
            globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.6 }, 1000);
        } else {
            // It's a location
            setSelectedLocation(d);
            globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.3 }, 800);
        }
    };

    // Reset view on "Back" (User needs a back button UI, but clicking empty space works for now?)
    const handleGlobeClick = () => {
        // Optional: Reset level if clicking empty space?
        // setViewLevel('GLOBAL');
        // setFocusedRegion(null);
    };

    if (!mounted) return <div className="w-full h-full bg-black flex items-center justify-center text-cyan-500">Initializing Core...</div>;

    const oceanColor = showReverseSide ? 'rgba(30, 20, 0, 1)' : 'rgba(2, 6, 15, 1)';
    const oceanImage = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${oceanColor}"/></svg>`)}`;

    return (
        <div className="w-full h-full">
            {/* Back Button for Drill Down - Only visible if deep */}
            {viewLevel !== 'GLOBAL' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Go up one level
                        if (viewLevel === 'COUNTRY') {
                            setFocusedRegion(continentRegions.find(c => focusedRegion!.id.includes(c.id)) as any);
                            // Re-finding parent is tricky with current simple state, let's just reset to GLOBAL for MVP reliability or Continent logic
                            // Actually setFocusedRegion logic handles level setting based on type.
                            // If we want to go Country -> Continent, we need the Continent Region object.
                            // Simplified: Just Global reset for now, or find parent.

                            // Let's safe-reset to Global for now to avoid bugs, user can re-drill
                            setFocusedRegion(null);
                            if (globeEl.current) globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
                        } else {
                            setFocusedRegion(null);
                            if (globeEl.current) globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
                        }
                    }}
                    className="absolute top-24 left-4 z-50 px-4 py-2 bg-black/60 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-900/50 backdrop-blur-md transition-all"
                >
                    ← RETURN TO ORBIT
                </button>
            )}

            <Globe
                ref={globeEl}
                key={`${showReverseSide ? 'reverse' : 'surface'}-${language}-${viewLevel}`} // Re-render on level change

                atmosphereAltitude={0.25}
                globeImageUrl={oceanImage}
                backgroundColor="#000000"
                atmosphereColor={showReverseSide ? "#ffd700" : "#00f0ff"}

                // === AUTO ROTATION ===
                autoRotate={true}
                autoRotateSpeed={0.5}

                // === VECTOR CONTINENTS ===
                polygonsData={countries.features}
                polygonStrokeColor={() => showReverseSide ? '#aa8800' : '#446666'}
                polygonSideColor={() => 'rgba(0,0,0,0)'}
                polygonCapColor={(d: any) => {
                    const continent = d.properties.CONTINENT;
                    const isContinentHovered = continent === hoveredContinent;
                    const isCountryHovered = d.properties.NAME === hoveredCountry;
                    const baseColor = CONTINENT_COLORS[continent] || 'rgba(200, 200, 200, 0.1)';

                    if (isCountryHovered) return 'rgba(255, 255, 255, 0.8)';
                    if (isContinentHovered) return baseColor.replace('0.2', '0.4');
                    return baseColor;
                }}
                polygonAltitude={0.01}
                polygonsTransitionDuration={300}

                onPolygonHover={(d: any) => {
                    setHoveredContinent(d ? d.properties.CONTINENT : null);
                    setHoveredCountry(d ? d.properties.NAME : null);
                }}

                // === INTERACTION ===
                onGlobeClick={handleGlobeClick}

                // === HTML LABELS (Only show at Country/Global level) ===
                htmlElementsData={viewLevel === 'COUNTRY' ? [] : (viewLevel === 'CONTINENT' ? [] : [])} // Hide default labels for now to avoid clutter

                // === MARKERS: SPHERES (Dynamic Level Data) ===
                customLayerData={displayData}
                customLayerLabel="label"
                customThreeObject={(d: any) => {
                    const color = d.color || '#ffffff';
                    const size = d.size || 0.5;
                    const geometry = new THREE.SphereGeometry(size, 32, 32);
                    const material = new THREE.MeshPhongMaterial({
                        color: color,
                        emissive: color,
                        emissiveIntensity: 0.8,
                        shininess: 100,
                    });
                    return new THREE.Mesh(geometry, material);
                }}
                onCustomLayerClick={handleObjectClick}

                ringsData={displayData}
                ringColor="color"
                ringMaxRadius={viewLevel === 'GLOBAL' ? 10 : 3}
                ringPropagationSpeed={2.5}
                ringRepeatPeriod={1200}
            />

            {showReverseSide && (
                <div className="absolute inset-0 pointer-events-none bg-yellow-900/10 mix-blend-overlay z-10"></div>
            )}
        </div>
    );
}
