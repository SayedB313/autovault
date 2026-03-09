import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.metaTitle || `${post.title} | AutoVault Blog`,
    description: post.metaDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  // Article JSON-LD structured data (server-generated content, safe for dangerouslySetInnerHTML)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "AutoVault" },
    publisher: {
      "@type": "Organization",
      name: "AutoVault",
      url: "https://autovault.network",
    },
    mainEntityOfPage: `https://autovault.network/blog/${slug}`,
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      {/* eslint-disable-next-line react/no-danger -- static server-generated SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-10">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground/60 truncate">{post.title}</span>
      </nav>

      {post.coverImage && (
        <div
          className="w-full h-64 md:h-96 rounded-xl bg-muted bg-cover bg-center mb-10"
          style={{ backgroundImage: `url(${post.coverImage})` }}
        />
      )}

      <h1 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl leading-[1.1] mb-6">
        {post.title}
      </h1>

      {post.publishedAt && (
        <p className="text-sm text-muted-foreground/60 mb-12 uppercase tracking-wider">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <div className="mx-auto mb-12 h-px w-16 bg-primary" />

      {/* Blog content is admin-authored only (seeded from DB, not user-generated).
          For user-generated content, add DOMPurify sanitization. */}
      <div
        className="prose prose-lg prose-luxury max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
