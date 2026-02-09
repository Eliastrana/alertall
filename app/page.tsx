// app/page.tsx
import Link from "next/link";
import Timeline from "./components/Timeline";
import NewestPost from "./components/NewestPost";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* subtle background glow */}
  
      <div className="mx-auto max-w-5xl px-6 py-16">


        {/* badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-tint px-4 py-2 text-xs font-medium text-foreground shadow-soft">
<span className="relative inline-flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
</span>
          Masterprosjekt • 12. januar 2026 – 18. mai 2027
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
          Prosjekt Argus
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Forbedre oversikten over kaskadeeffekter av naturkatastrofer i Norge ved å utvikle et system som kombinerer spatio-temporal maskinlæring med interaktive kartvisualiseringe.
        </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">

          <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95 hover:shadow-lift"
          >
              Se kart
          </Link>

              {/*<Link*/}
              {/*    href="/check"*/}
              {/*    className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95 hover:shadow-lift"*/}
              {/*>*/}
              {/*    Lokasjonssjekker*/}
              {/*</Link>*/}

          </div>

        <Timeline />






        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="h-2 w-10 rounded-full bg-accent" />
              <div className="text-xl font-semibold">Visjon</div>
            </div>
            <p className="mt-3 text-sm text-muted">
              Forbedre multi-trussel risikovurdering for naturkatastrofer i Norge, basert på spatio-temporale løsninger.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="h-2 w-10 rounded-full bg-accent" />
              <div className="text-xl font-semibold">Output</div>
            </div>
            <p className="mt-3 text-sm text-muted">
              Risiko per trussel, lav/middels/høy, usikkerhet for valgt koordinat, og tidsrom.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="h-2 w-10 rounded-full bg-accent" />
              <div className="text-xl font-semibold">Leveranse</div>
            </div>
            <p className="mt-3 text-sm text-muted">
              Precomputed risikokart + API for punktspørringer. Enkelt input, enkelt output. 
            </p>
          </div>
        </div>


        <NewestPost />


        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/*<Link*/}
          {/*  href="/steps"*/}
          {/*  className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95 hover:shadow-lift"*/}
          {/*>*/}
          {/*  Se prosjektstegene*/}
          {/*</Link>*/}

        </div>
      </div>
    </main>
  );
}
