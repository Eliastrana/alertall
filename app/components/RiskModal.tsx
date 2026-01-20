"use client";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    lat: number;
    lon: number;
    risk: number;
};

function classify(risk: number) {
    // Simple MVP thresholds (tune later with calibration)
    if (risk < 0.1) return { label: "Lav", pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" };
    if (risk < 0.25) return { label: "Middels", pill: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300" };
    return { label: "Høy", pill: "bg-red-500/15 text-red-700 dark:text-red-300" };
}

export default function RiskModal({ open, onClose, title, lat, lon, risk }: Props) {
    if (!open) return null;

    const c = classify(risk);

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Risk details"
            onClick={onClose}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* panel */}
            <div
                className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-lift"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold">{title ?? "Risikovurdering"}</div>
                        <div className="mt-1 text-xs text-muted">
                            Koordinat: {lat.toFixed(4)}, {lon.toFixed(4)}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl bg-tint px-3 py-2 text-xs font-semibold text-foreground hover:opacity-90"
                    >
                        Lukk
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-card-2 p-4">
                    <div>
                        <div className="text-xs text-muted">Trusselnivå</div>
                        <div className="mt-1 text-2xl font-semibold">{c.label}</div>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.pill}`}>
            {c.label}
          </span>
                </div>

                <div className="mt-4 text-sm text-muted">
                    <span className="font-semibold text-foreground">Sannsynlighet:</span>{" "}
                    {(risk * 100).toFixed(1)}%
                </div>

                <div className="mt-4 rounded-2xl bg-card-2 p-4 text-xs text-muted leading-relaxed">
                    Dette er en <span className="font-semibold text-foreground">indikator</span> basert på modellen
                    (ikke en garanti). Bruk den til å forstå om området kan være utsatt.
                </div>
            </div>
        </div>
    );
}