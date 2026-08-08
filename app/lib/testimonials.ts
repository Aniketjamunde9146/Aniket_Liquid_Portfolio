import { createClient } from '@/app/lib/supabase/server'

export interface Testimonial {
  id: string;
  color: string;
  stars: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
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

  return (data ?? []).map((row) => ({
    id: row.id,
    color: row.color || 'tm-c-blue',
    stars: row.stars ?? 5,
    quote: row.quote,
    name: row.name,
    role: row.role || '',
    initials: row.initials || (row.name as string).slice(0, 2).toUpperCase(),
  }))
}