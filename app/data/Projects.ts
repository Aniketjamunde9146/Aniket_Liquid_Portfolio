import { createClient } from '@/app/lib/supabase/server'

export async function getProjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    idea: row.idea,
    tagline: row.tagline,
    desc: row.description,
    category: row.category,
    mockup: row.mockup,
    logo: row.logo,
    accentColor: row.accent_color,
    year: row.year,
    clientRequirements: row.client_requirements ?? [],
    review: row.review ?? {},
    links: row.links ?? {},
  }))
}