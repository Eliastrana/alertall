import { getAllPosts } from "@/lib/blog";
import BlogCard from "../components/BlogCard";

export const metadata = {
  title: "Blogg",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background text-foreground">
    
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blogg</h1>
          <p className="max-w-2xl text-sm text-muted md:text-base">
            Oppdateringer om prosjektet, designvalg, data, modeller og fremdrift.
          </p>
        </header>

        <section className="mt-10 grid gap-4">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </section>
      </div>
    </main>
  );
}
