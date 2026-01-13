// app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const mdxComponents = {
  h1: (props: any) => (
    <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3" {...props} />
  ),
  p: (props: any) => (
    <p className="text-sm text-muted leading-relaxed my-3" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc pl-6 my-3 space-y-1" {...props} />,
  li: (props: any) => <li className="text-sm text-muted" {...props} />,
};

// ✅ params is async in newer Next versions
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const { frontmatter, content } = post;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
          <h1 className="text-3xl font-semibold tracking-tight">{frontmatter.title}</h1>
          <p className="mt-2 text-sm text-muted">{formatDate(frontmatter.date)}</p>

          {!!frontmatter.tags?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((t) => (
                <span key={t} className="rounded-full bg-tint px-3 py-1 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

       <article className="mt-10 rounded-2xl bg-card p-6 shadow-soft prose max-w-none prose-slate dark:prose-invert">
 <MDXRemote
  source={content}
  components={mdxComponents}
  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
/>
</article>
      </div>
    </main>
  );
}
