import type { RelevantPaper } from "@/lib/papers";

function getPrimaryLink(paper: RelevantPaper) {
  if (paper.url) {
    return { href: paper.url, label: "Open source" };
  }

  if (paper.doi) {
    return { href: `https://doi.org/${paper.doi}`, label: "DOI" };
  }

  return null;
}

export default function PaperCard({ paper }: { paper: RelevantPaper }) {
  const primaryLink = getPrimaryLink(paper);

  return (
    <article className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{paper.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {[paper.authors, paper.year].filter(Boolean).join(" • ") || paper.type}
          </p>
        </div>

        <span className="rounded-full bg-tint px-3 py-1 text-xs font-semibold">
          {paper.type}
        </span>
      </div>

      {(paper.venue || paper.note) && (
        <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted">
          {paper.venue && <p>{paper.venue}</p>}
          {paper.note && <p>{paper.note}</p>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {primaryLink && (
          <a
            href={primaryLink.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-card-2 px-3 py-1 text-xs text-muted transition hover:bg-tint hover:text-foreground"
          >
            {primaryLink.label}
          </a>
        )}
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-card-2 px-3 py-1 text-xs text-muted transition hover:bg-tint hover:text-foreground"
          >
            {paper.doi}
          </a>
        )}
      </div>
    </article>
  );
}
