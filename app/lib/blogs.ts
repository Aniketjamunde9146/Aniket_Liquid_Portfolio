import { createClient } from "@/app/lib/supabase/client";
import type { BlogRow } from "@/app/types/blogs";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  accent: [string, string];
  coverImage: string;
  content: string[];
}

const DEFAULT_ACCENT: [string, string] = ["#4682ff", "#8b5cf6"];

function mapRowToPost(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    excerpt: row.excerpt ?? "",
    category: row.category ?? "General",
    tags: row.tags ?? [],
    date: row.date ?? new Date().toISOString(),
    readTime: row.read_time ?? "5 min read",
    author: row.author ?? "Aniket Jamunde",
    accent:
      row.accent_color_1 && row.accent_color_2
        ? [row.accent_color_1, row.accent_color_2]
        : DEFAULT_ACCENT,
    coverImage: row.cover_image ?? "",
    content: row.content ?? [],
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("getAllPosts:", error?.message);
    return [];
  }
  return (data as BlogRow[]).map(mapRowToPost);
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("blogs").select("slug");
  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapRowToPost(data as BlogRow);
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<BlogPost[]> {
  const supabase = createClient();

  const { data: currentRow } = await supabase
    .from("blogs")
    .select("category")
    .eq("slug", slug)
    .single();

  const { data, error } = await supabase.from("blogs").select("*").neq("slug", slug);
  if (error || !data) return [];

  const rows = data as BlogRow[];
  const sameCategory = currentRow?.category
    ? rows.filter((r) => r.category === currentRow.category)
    : [];
  const pool = sameCategory.length >= limit ? sameCategory : rows;

  return pool.slice(0, limit).map(mapRowToPost);
}