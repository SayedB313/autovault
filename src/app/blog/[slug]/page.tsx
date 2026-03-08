import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";

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

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        {" / "}
        <Link href="/blog" className="hover:underline">Blog</Link>
        {" / "}
        <span>{post.title}</span>
      </nav>

      {post.coverImage && (
        <div
          className="w-full h-64 md:h-96 rounded-xl bg-muted bg-cover bg-center mb-8"
          style={{ backgroundImage: `url(${post.coverImage})` }}
        />
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

      {post.publishedAt && (
        <p className="text-muted-foreground mb-8">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* Blog content is admin-authored only (seeded from DB, not user-generated).
          For user-generated content, add DOMPurify sanitization. */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
