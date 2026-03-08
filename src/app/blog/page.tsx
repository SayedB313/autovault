import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">AutoVault Blog</h1>
      <p className="text-muted-foreground mb-8">
        Expert guides on car storage, from climate control to finding the right facility
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          Blog posts coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <div
                    className="h-48 rounded-t-lg bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                )}
                <CardContent className="pt-4">
                  <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-3">
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
