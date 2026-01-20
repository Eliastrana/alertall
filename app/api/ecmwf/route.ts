// app/api/ecmwf/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // safe default

type Units = "metric" | "imperial";

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));
    const days = Number(searchParams.get("days") ?? "7");
    const units = (searchParams.get("units") ?? "metric") as Units;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return NextResponse.json(
            { error: "Missing or invalid lat/lon. Example: /api/ecmwf?lat=59.91&lon=10.75" },
            { status: 400 }
        );
    }

    const safeLat = clamp(lat, -90, 90);
    const safeLon = clamp(lon, -180, 180);
    const safeDays = clamp(Number.isFinite(days) ? days : 7, 1, 16);

    // ECMWF via Open-Meteo (JSON). Good for prototypes and web apps.
    // You can swap this later to raw ECMWF Open Data when you need full control.
    const hourly = [
        "temperature_2m",
        "precipitation",
        "rain",
        "snowfall",
        "cloudcover",
        "windspeed_10m",
        "winddirection_10m",
        "surface_pressure",
        "relativehumidity_2m",
    ].join(",");

    const daily = [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "windspeed_10m_max",
    ].join(",");

    // Note: Open-Meteo ECMWF endpoint may vary by plan/availability.
    // If their /v1/ecmwf endpoint is enabled, this works.
    // If not, switch to /v1/forecast with a specific model parameter (depending on their docs).
    const url = new URL("https://api.open-meteo.com/v1/ecmwf");
    url.searchParams.set("latitude", String(safeLat));
    url.searchParams.set("longitude", String(safeLon));
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", String(safeDays));
    url.searchParams.set("hourly", hourly);
    url.searchParams.set("daily", daily);

    if (units === "imperial") {
        url.searchParams.set("temperature_unit", "fahrenheit");
        url.searchParams.set("windspeed_unit", "mph");
        url.searchParams.set("precipitation_unit", "inch");
    } else {
        // metric default; Open-Meteo uses °C, km/h, mm by default
    }

    try {
        const res = await fetch(url.toString(), {
            headers: { "accept": "application/json" },
            // Avoid caching in early dev; later you can add revalidate caching
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Upstream forecast fetch failed", status: res.status, details: text },
                { status: 502 }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            source: "ECMWF via Open-Meteo",
            query: { lat: safeLat, lon: safeLon, days: safeDays, units },
            data,
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "Server error while fetching forecast", details: String(err?.message ?? err) },
            { status: 500 }
        );
    }
}
