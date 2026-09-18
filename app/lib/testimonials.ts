import { createClient } from '@/app/lib/supabase/server'

export interface Testimonial {
  id: string;
  slug: string;
  color: string;
  stars: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  photoUrl?: string | null;
  companyUrl?: string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }

  const seen = new Map<string, Testimonial>()

  for (const row of data ?? []) {
    const name = String(row.name || '').trim()
    const role = String(row.role || '').trim()
    const companyKey = [name, role].filter(Boolean).join(' ')
    const slug = slugify(companyKey || String(row.id || 'testimonial')) || 'testimonial'

    if (seen.has(slug)) {
      continue
    }

    seen.set(slug, {
      id: String(row.id || slug),
      slug,
      color: row.color || 'tm-c-blue',
      stars: row.stars ?? 5,
      quote: row.quote,
      name,
      role,
      initials: row.initials || name.slice(0, 2).toUpperCase(),
      photoUrl: row.photo_url || row.photoUrl || null,
      companyUrl: row.company_url || row.companyUrl || null,
    })
  }

  return Array.from(seen.values())
}