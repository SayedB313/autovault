import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Car Storage Guide & Tips | AutoVault Blog",
  description:
    "Expert guides on car storage, climate control, pricing, and finding the best facility for your vehicle.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="mx-auto mb-6 h-px w-12 bg-primary" />
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          The AutoVault Journal
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Expert guides on car storage, from climate control to finding the right facility
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          Blog posts coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group h-full bg-card ring-1 ring-border hover:ring-primary/30 transition-all duration-300 overflow-hidden">
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="h-full bg-muted bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}
                <CardContent className="pt-4">
                  <h2 className="font-serif text-lg font-light text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs text-muted-foreground/60 mt-4 uppercase tracking-wider">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
