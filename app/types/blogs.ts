export interface BlogRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  date: string | null;
  read_time: string | null;
  author: string | null;
  accent_color_1: string | null;
  accent_color_2: string | null;
  cover_image: string | null;
  content: string[] | null;
  sort_order: number;
}