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

// Custom Sphere Object
const getSphereMarker = (d: any) => {
    const geometry = new THREE.SphereGeometry(0.6, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: d.color,
        emissive: d.color,
        emissiveIntensity: 1.0,
        shininess: 100,
        transparent: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ...d, type: 'marker' };
    return mesh;
};

export default function GlobeWrapper() {
    const { showReverseSide, locations, fetchLocations, currentYear, setSelectedLocation } = useLayerStore();
    const { t, language } = useLanguageStore(); // Get translation function AND language

    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    const [countries, setCountries] = useState({ features: [] });
    const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    // === DYNAMIC LABELS ===
    const geoLabels = useMemo(() => [
        // Continents
        { text: t('geo.asia'), lat: 45, lng: 90, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.europe'), lat: 50, lng: 15, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.africa'), lat: 10, lng: 20, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.na'), lat: 45, lng: -100, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.sa'), lat: -15, lng: -60, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.oceania'), lat: -25, lng: 135, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },
        { text: t('geo.antarctica'), lat: -80, lng: 0, size: '20px', color: 'rgba(255,255,255,0.7)', weight: 'bold' },

        // Countries
        { text: t('country.russia'), lat: 60, lng: 90, size: '12px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
        { text: t('country.usa'), lat: 38, lng: -97, size: '12px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
        { text: t('country.china'), lat: 35, lng: 105, size: '12px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
        { text: t('country.japan'), lat: 36, lng: 138, size: '12px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
        { text: t('country.taiwan'), lat: 23.5, lng: 121, size: '10px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
        { text: t('country.uk'), lat: 54, lng: -2, size: '12px', color: 'rgba(0,240,255,0.8)', weight: 'normal' },
    ], [t]);

    useEffect(() => {
        setMounted(true);
        fetchLocations();

        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(r => r.json())
            .then(setCountries);
    }, []);

    const filteredLocations = useMemo(() => {
        // Use SAMPLE_LOCATIONS if store locations are empty
        const sourceData = locations.length > 0 ? locations : SAMPLE_LOCATIONS;

        const transformedData = sourceData.map((loc: any) => ({
            ...loc,
            lat: loc.coordinates?.lat ?? loc.lat, // Handle both structures if needed
            lng: loc.coordinates?.lng ?? loc.lng,
            alt: 0.03,
            label: loc.name,
        }));

        return transformedData.filter((loc: any) => {
            const start = loc.year_start ?? -9999999999;
            const end = loc.year_end ?? 9999;
            return currentYear >= start && currentYear <= end;
        });
    }, [locations, currentYear]);

    useEffect(() => {
        if (mounted && globeEl.current) {
            const scene = globeEl.current.scene();
            const ambient = new THREE.AmbientLight(0xffffff, 1.2);
            const dir = new THREE.DirectionalLight(0xffffff, 2.0);
            dir.position.set(20, 20, 20);
            scene.add(ambient, dir);

            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
        }
    }, [mounted]);

    if (!mounted) return <div className="w-full h-full bg-black flex items-center justify-center text-cyan-500">Initializing Core...</div>;

    const oceanColor = showReverseSide ? 'rgba(30, 20, 0, 1)' : 'rgba(2, 6, 15, 1)';
    const oceanImage = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${oceanColor}"/></svg>`)}`;

    return (
        <div className="w-full h-screen bg-black">
            <Globe
                ref={globeEl}
                // CRITICAL FIX: Include language in key to force re-render when language changes
                key={`${showReverseSide ? 'reverse' : 'surface'}-${language}`}

                atmosphereAltitude={0.25}
                globeImageUrl={oceanImage}
                backgroundColor="#000000"
                atmosphereColor={showReverseSide ? "#ffd700" : "#00f0ff"}

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

                polygonAltitude={(d: any) => {
                    if (d.properties.NAME === hoveredCountry) return 0.015;
                    if (d.properties.CONTINENT === hoveredContinent) return 0.01;
                    return 0.001;
                }}
                polygonsTransitionDuration={300}

                // EVENTS
                onPolygonHover={(d: any) => {
                    setHoveredContinent(d ? d.properties.CONTINENT : null);
                    setHoveredCountry(d ? d.properties.NAME : null);
                }}

                onPolygonClick={(d: any, event: any, coords: { lat: number, lng: number }) => {
                    if (globeEl.current) {
                        globeEl.current.pointOfView({
                            lat: coords.lat,
                            lng: coords.lng,
                            altitude: 1.0
                        }, 1000);
                    }
                }}

                // === HTML LABELS ===
                htmlElementsData={geoLabels}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.05}
                htmlElement={(d: any) => {
                    const el = document.createElement('div');
                    el.innerText = d.text;
                    el.style.color = d.color;
                    el.style.fontSize = d.size;
                    el.style.fontWeight = d.weight;
                    el.style.fontFamily = 'monospace';
                    el.style.textShadow = '0 0 5px #000';
                    el.style.pointerEvents = 'none';
                    el.style.whiteSpace = 'pre';
                    el.style.textAlign = 'center';
                    return el;
                }}

                // === MARKERS: SPHERES ===
                customLayerData={filteredLocations}
                customLayerLabel="label"
                customThreeObject={getSphereMarker}
                customThreeObjectUpdate={(obj, d: any) => {
                    if (obj && globeEl.current) {
                        Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, d.alt));
                    }
                }}
                onCustomLayerClick={(d: any) => {
                    if (d) {
                        setSelectedLocation(d);
                    }
                }}

                ringsData={filteredLocations}
                ringColor="color"
                ringMaxRadius={3.5}
                ringPropagationSpeed={2.5}
                ringRepeatPeriod={1200}
                ringAltitude={0.02}
            />

            {showReverseSide && (
                <div className="absolute inset-0 pointer-events-none bg-yellow-900/10 mix-blend-overlay z-10"></div>
            )}
        </div>
    );
}
