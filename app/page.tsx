// app/page.tsx
import FrontpageHero from "./components/FrontpageHero";
import Timeline from "./components/Timeline";
import NewestPost from "./components/NewestPost";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <FrontpageHero />

      <section className="mx-auto max-w-5xl px-6 py-16">

        <NewestPost />

        {/*<Timeline />*/}


        {/*<div className="mt-10 grid gap-4 md:grid-cols-3">*/}
        {/*  <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">*/}
        {/*    <div className="flex items-center gap-3">*/}
        {/*      <span className="h-2 w-10 rounded-full bg-accent" />*/}
        {/*      <div className="text-xl font-semibold">Visjon</div>*/}
        {/*    </div>*/}
        {/*    <p className="mt-3 text-sm text-muted">*/}
        {/*      Forbedre multi-trussel risikovurdering for naturkatastrofer i Norge, basert på spatio-temporale løsninger.*/}
        {/*    </p>*/}
        {/*  </div>*/}

        {/*  <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">*/}
        {/*    <div className="flex items-center gap-3">*/}
        {/*      <span className="h-2 w-10 rounded-full bg-accent" />*/}
        {/*      <div className="text-xl font-semibold">Output</div>*/}
        {/*    </div>*/}
        {/*    <p className="mt-3 text-sm text-muted">*/}
        {/*      Risiko per trussel, lav/middels/høy, usikkerhet for valgt koordinat, og tidsrom.*/}
        {/*    </p>*/}
        {/*  </div>*/}

        {/*  <div className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">*/}
        {/*    <div className="flex items-center gap-3">*/}
        {/*      <span className="h-2 w-10 rounded-full bg-accent" />*/}
        {/*      <div className="text-xl font-semibold">Leveranse</div>*/}
        {/*    </div>*/}
        {/*    <p className="mt-3 text-sm text-muted">*/}
        {/*      Precomputed risikokart + API for punktspørringer. Enkelt input, enkelt output.*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/*<Link*/}
          {/*  href="/steps"*/}
          {/*  className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition hover:opacity-95 hover:shadow-lift"*/}
          {/*>*/}
          {/*  Se prosjektstegene*/}
          {/*</Link>*/}
        </div>
      </section>
    </main>
  );
}
