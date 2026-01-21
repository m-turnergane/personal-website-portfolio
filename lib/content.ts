import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Collection = "trading" | "projects" | "automation" | "writing";

export type PostStatus = "published" | "draft" | "coming-soon";

export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status: PostStatus;
  links?: {
    github?: string;
    live?: string;
    article?: string;
    x?: string;
    linkedin?: string;
    kaggle?: string;
    demo?: string;
  };
  coverImage?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

const contentDirectory = path.join(process.cwd(), "content");

/**
 * Get all posts from a collection
 */
export function getAllPosts(collection: Collection): Post[] {
  const collectionPath = path.join(contentDirectory, collection);

  // Return empty array if directory doesn't exist
  if (!fs.existsSync(collectionPath)) {
    return [];
  }

  const files = fs.readdirSync(collectionPath);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(collectionPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as PostFrontmatter,
        content,
      };
    })
    .sort((a, b) => {
      // Sort by date descending (newest first)
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  return posts;
}

/**
 * Get all published posts from a collection
 */
export function getPublishedPosts(collection: Collection): Post[] {
  const allPosts = getAllPosts(collection);
  return allPosts.filter((post) => post.frontmatter.status === "published");
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(collection: Collection, slug: string): Post | null {
  const collectionPath = path.join(contentDirectory, collection);
  const filePath = path.join(collectionPath, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

/**
 * Get all slugs for a collection (for static generation)
 */
export function getAllSlugs(collection: Collection): string[] {
  const collectionPath = path.join(contentDirectory, collection);

  if (!fs.existsSync(collectionPath)) {
    return [];
  }

  const files = fs.readdirSync(collectionPath);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Format a date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
