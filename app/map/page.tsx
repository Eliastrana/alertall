// app/map/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import RiskModal from "@/app/components/RiskModal";
import type {
    FeatureCollection,
    Feature,
    Point,
    GeoJsonProperties,
} from "geojson";



mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const MAP_STYLE_DARK = "mapbox://styles/mapbox/dark-v11";

type HeatPoint = {
    lat: number;
    lon: number;
    risk: number;
};



function isPointFeature(f: unknown): f is Feature<Point, unknown> {
    if (!f || typeof f !== "object") return false;

    const g = (f as { geometry?: unknown }).geometry;
    if (!g || typeof g !== "object") return false;

    const type = (g as { type?: unknown }).type;
    if (type !== "Point") return false;

    const coords = (g as { coordinates?: unknown }).coordinates;
    return (
        Array.isArray(coords) &&
        coords.length >= 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
    );
}

function getPointCoords(f: Feature<Point, unknown>): [number, number] {
    const c = f.geometry.coordinates;
    return [c[0], c[1]];
}

// Safe property getter (no any)
function getPropNumber(
    props: unknown,
    key: string,
    fallback = 0
): number {
    if (!props || typeof props !== "object") return fallback;
    const val = (props as Record<string, unknown>)[key];
    if (typeof val === "number") return val;
    if (typeof val === "string") {
        const n = Number(val);
        return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
}


type RiskProps = GeoJsonProperties & { risk: number };
type RiskFeature = Feature<Point, RiskProps>;
type RiskFeatureCollection = FeatureCollection<Point, RiskProps>;

export default function RiskMapPage() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);

    const [selected, setSelected] = useState<{
        lat: number;
        lon: number;
        risk: number;
    } | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: MAP_STYLE_DARK,
            center: [10, 60],
            zoom: 4,
            interactive: true,
        });

        mapInstance.current = map;

        map.on("load", async () => {
            const res = await fetch("/heatmap_not.json");
            const json = await res.json();

            const points = (json.data as HeatPoint[]) ?? [];

            const geojson: RiskFeatureCollection = {
                type: "FeatureCollection",
                features: points.map<RiskFeature>((p) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [p.lon, p.lat],
                    },
                    properties: { risk: p.risk },
                })),
            };

            // thresholds (percent)
            const TH_YELLOW = 0.1;
            const TH_ORANGE = 0.15;
            const TH_RED = 0.2;

            // Source with all points (heatmap uses this, filtered in layer)
            map.addSource("risk", {
                type: "geojson",
                data: geojson,
                cluster: true,
                clusterRadius: 50,
                clusterMaxZoom: 8,
            });

            // Warning-only feature collection for clusters + dots (>= 10%)
            const warningGeojson: RiskFeatureCollection = {
                type: "FeatureCollection",
                features: geojson.features.filter(
                    (f) => (f.properties?.risk ?? 0) >= TH_YELLOW
                ),
            };

            map.addSource("risk-warning", {
                type: "geojson",
                data: warningGeojson,
                cluster: true,
                clusterRadius: 50,
                clusterMaxZoom: 8,
            });

            // 🔥 Heatmap (zoomed out) — only >= 10%
            map.addLayer({
                id: "risk-heat",
                type: "heatmap",
                source: "risk",
                maxzoom: 7.2,
                filter: [">=", ["get", "risk"], TH_YELLOW],
                paint: {
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "risk"],
                        TH_YELLOW,
                        0.8,
                        TH_ORANGE,
                        2.2,
                        TH_RED,
                        4.5,
                        0.35,
                        6.0,
                        1.0,
                        7.0,
                    ],
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        2,
                        0.45,
                        4,
                        0.7,
                        6,
                        0.95,
                        7,
                        1.05,
                    ],
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        2,
                        10,
                        4,
                        16,
                        6,
                        24,
                        7,
                        34,
                    ],
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        2,
                        0.35,
                        5.5,
                        0.45,
                        7.2,
                        0.0,
                    ],
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0.0,
                        "rgba(0,0,0,0)",
                        0.12,
                        "rgba(250,204,21,0.18)", // yellow
                        0.28,
                        "rgba(250,204,21,0.28)",
                        0.45,
                        "rgba(249,115,22,0.32)", // orange
                        0.62,
                        "rgba(239,68,68,0.40)", // red
                        0.85,
                        "rgba(127,29,29,0.55)",
                        1.0,
                        "rgba(127,29,29,0.60)",
                    ],
                },
            });

            // ✅ ORDER FIX: glow must be added BEFORE the main layer it sits under.

            // ✨ Cluster glow (underlay)
            map.addLayer({
                id: "clusters-glow",
                type: "circle",
                source: "risk-warning",
                filter: ["has", "point_count"],
                minzoom: 0,
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        18,
                        3,
                        26,
                        5,
                        30,
                        7,
                        28,
                    ],
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "rgba(250,204,21,0.55)",
                        30,
                        "rgba(249,115,22,0.55)",
                        80,
                        "rgba(239,68,68,0.55)",
                        200,
                        "rgba(127,29,29,0.60)",
                    ],
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0.55,
                        4,
                        0.55,
                        6,
                        0.45,
                        8,
                        0.28,
                    ],
                    "circle-blur": 0.95,
                },
            });

            // 🟠 Clusters — show from world view (zoom 0)
            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "risk-warning",
                filter: ["has", "point_count"],
                minzoom: 0,
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        10,
                        3,
                        16,
                        5,
                        18,
                        7,
                        16,
                    ],
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#facc15",
                        30,
                        "#f97316",
                        80,
                        "#ef4444",
                        200,
                        "#7f1d1d",
                    ],
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0.92,
                        4,
                        0.92,
                        6,
                        0.82,
                        8,
                        0.60,
                    ],
                    "circle-stroke-width": 1.5,
                    // always dark style -> use dark-friendly stroke
                    "circle-stroke-color": "rgba(0,0,0,0.35)",
                    "circle-stroke-opacity": 0.9,
                },
            });

            // 🔢 Cluster numbers
            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "risk-warning",
                filter: ["has", "point_count"],
                minzoom: 0,
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        11,
                        4,
                        12,
                        7,
                        12,
                    ],
                },
                paint: {
                    "text-color": "#fff",
                    "text-halo-color": "rgba(0,0,0,0.75)",
                    "text-halo-width": 1.25,
                    "text-halo-blur": 0.6,
                },
            });

            // ✨ Dot glow (underlay)
            map.addLayer({
                id: "unclustered-glow",
                type: "circle",
                source: "risk-warning",
                filter: ["!", ["has", "point_count"]],
                minzoom: 5.8,
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5.8,
                        6,
                        10,
                        14,
                    ],
                    "circle-color": [
                        "step",
                        ["get", "risk"],
                        "rgba(250,204,21,0.45)",
                        TH_ORANGE,
                        "rgba(249,115,22,0.45)",
                        TH_RED,
                        "rgba(239,68,68,0.50)",
                    ],
                    "circle-opacity": 0.6,
                    "circle-blur": 0.95,
                },
            });

            // 🟡🟠🔴 Individual warning points
            map.addLayer({
                id: "unclustered",
                type: "circle",
                source: "risk-warning",
                filter: ["!", ["has", "point_count"]],
                minzoom: 5.8,
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 5.8, 2.5, 10, 6],
                    "circle-color": [
                        "step",
                        ["get", "risk"],
                        "#facc15",
                        TH_ORANGE,
                        "#f97316",
                        TH_RED,
                        "#ef4444",
                    ],
                    "circle-opacity": 0.92,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "rgba(0,0,0,0.45)",
                },
            });

            map.on("click", "clusters", (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
                if (!features.length) return;

                const first = features[0];
                if (!isPointFeature(first)) return;

                const clusterId = getPropNumber(first.properties, "cluster_id", NaN);
                if (!Number.isFinite(clusterId)) return;

                const source = map.getSource("risk-warning") as mapboxgl.GeoJSONSource;
                source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err || zoom == null) return;
                    map.easeTo({ center: getPointCoords(first), zoom });
                });
            });

            map.on("mouseenter", "clusters", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "clusters", () => {
                map.getCanvas().style.cursor = "";
            });

            map.on("click", (e) => {
                const feats = map.queryRenderedFeatures(e.point, { layers: ["unclustered"] });
                if (!feats.length) return;

                const first = feats[0];
                if (!isPointFeature(first)) return;

                const [lon, lat] = getPointCoords(first);
                const risk = getPropNumber(first.properties, "risk", 0);

                setSelected({ lon, lat, risk });
            });

            map.on("mouseenter", "unclustered", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "unclustered", () => {
                map.getCanvas().style.cursor = "";
            });
        });

        return () => map.remove();
    }, []);

    return (
        <main className="relative h-[calc(100vh)] w-full">
            <div ref={mapRef} className="absolute inset-0" />

            <RiskModal
                open={!!selected}
                onClose={() => setSelected(null)}
                title="Ekstrem nedbør (proxy)"
                lat={selected?.lat ?? 0}
                lon={selected?.lon ?? 0}
                risk={selected?.risk ?? 0}
            />
        </main>
    );
}