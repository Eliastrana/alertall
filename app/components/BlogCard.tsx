import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("no-NO", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const { slug, frontmatter } = post;

  return (
    <Link
      href={`/blog/${slug}`}
      className="block rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{frontmatter.title}</h3>
          <p className="mt-1 text-sm text-muted">{formatDate(frontmatter.date)}</p>
        </div>

        <span className="rounded-full bg-tint px-3 py-1 text-xs font-semibold">
          Blogg
        </span>
      </div>

      {frontmatter.excerpt && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {frontmatter.excerpt}
        </p>
      )}

      {!!frontmatter.tags?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {frontmatter.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-card-2 px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
