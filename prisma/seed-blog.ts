/**
 * AutoVault — Blog Post Seeder
 *
 * Seeds the database with SEO blog posts from JSON files in prisma/blog-posts/.
 *
 * Usage:
 *   npx tsx prisma/seed-blog.ts
 */

import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  tags?: string[];
  published?: boolean;
  publishedAt?: string;
}

async function seedBlogPosts() {
  console.log("=".repeat(60));
  console.log("AutoVault — Blog Post Seeder");
  console.log("=".repeat(60));
  console.log();

  const blogPostsDir = path.join(__dirname, "blog-posts");

  if (!fs.existsSync(blogPostsDir)) {
    console.error(`Blog posts directory not found: ${blogPostsDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(blogPostsDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  console.log(`Found ${files.length} blog post files.\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = path.join(blogPostsDir, file);

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data: BlogPostData = JSON.parse(raw);

      if (!data.slug || !data.title || !data.content) {
        console.error(
          `  [SKIP] ${file}: Missing required fields (slug, title, content)`
        );
        errors++;
        continue;
      }

      const publishedAt = data.publishedAt
        ? new Date(data.publishedAt)
        : new Date();

      const result = await prisma.blogPost.upsert({
        where: { slug: data.slug },
        update: {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          published: data.published ?? true,
          publishedAt,
        },
        create: {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          published: data.published ?? true,
          publishedAt,
        },
      });

      // Check if this was a create or update by comparing timestamps
      const isNew =
        result.createdAt.getTime() === result.updatedAt.getTime() ||
        result.updatedAt.getTime() - result.createdAt.getTime() < 1000;

      if (isNew) {
        created++;
        console.log(`  [CREATE] ${data.slug}`);
      } else {
        updated++;
        console.log(`  [UPDATE] ${data.slug}`);
      }
    } catch (err: any) {
      console.error(`  [ERROR] ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("BLOG SEED COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Total:   ${files.length}`);
  console.log("=".repeat(60));
}

seedBlogPosts()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nFATAL ERROR:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
