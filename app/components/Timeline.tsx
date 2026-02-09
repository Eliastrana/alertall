"use client";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

const items = [
  { title: "Innhenting", description: "Innhenting av nødvendig data.", Icon: LocationOnRoundedIcon },
  { title: "Prognose", description: "Værmelding for de neste 30 dagene hentes inn.", Icon: CalendarMonthRoundedIcon },
  { title: "Modell", description: "Spatio-temporal ML kombinerer historikk med tidsrelevant data.", Icon: PsychologyRoundedIcon },
  { title: "Risiko + usikkerhet", description: "Kalibrert sannsynlighet beregnes, sammensatt av flere trusler.", Icon: WarningAmberRoundedIcon },
  { title: "Visualisering", description: "Interaktivt kart med visualisering av trusler basert på type.", Icon: MapRoundedIcon },
];

export default function Timeline() {
  return (
    <section className="mt-10">
      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-foreground">Slik flyter systemet</h2>
        </div>

        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {items.map(({ title, description, Icon }, idx) => (
            <li key={title} className="relative">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-foreground">
                    <Icon fontSize="small" />
                  </span>
                  <span className="text-xs font-semibold text-muted">{idx + 1}</span>
                </div>

                <div className="mt-1">
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
