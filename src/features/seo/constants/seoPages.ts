import type { SeoPageDefinition, SeoTabDefinition, PageSeoMetadata, SeoPageKey } from '../types/seo'

// ─────────────────────────────────────────────
// Supported website pages
// Add future pages here without changing architecture
// ─────────────────────────────────────────────
export const SEO_PAGES: SeoPageDefinition[] = [
  { key: 'home',          label: 'Home',                description: 'Website homepage' },
  { key: 'about',         label: 'About',               description: 'About us page' },
  { key: 'services',      label: 'Services',            description: 'Services overview page' },
  { key: 'psychologists', label: 'Psychologists',       description: 'Psychologist directory page' },
  { key: 'blog',          label: 'Blog',                description: 'Blog listing page' },
  { key: 'faq',           label: 'FAQ',                 description: 'Frequently asked questions' },
  { key: 'contact',       label: 'Contact',             description: 'Contact us page' },
  { key: 'blog-individual', label: 'Individual Blog Post', description: 'Template for single blog article pages', isDynamic: true },
]

// ─────────────────────────────────────────────
// Tab navigation definitions
// ─────────────────────────────────────────────
export const SEO_TABS: SeoTabDefinition[] = [
  { id: 'general',  label: 'General SEO',        description: 'Page metadata, Open Graph, Twitter cards, and robots directives' },
  { id: 'schema',   label: 'Structured Data',    description: 'Schema.org JSON-LD markup per page' },
  { id: 'scripts',  label: 'Scripts',            description: 'Head and body script injection (Analytics, GTM, Pixels)' },
  { id: 'robots',   label: 'robots.txt',         description: 'Control crawler access to your website' },
  { id: 'sitemap',  label: 'sitemap.xml',        description: 'XML sitemap for search engine indexing' },
  { id: 'llms',     label: 'llms.txt',           description: 'Large language model discovery configuration' },
]

// ─────────────────────────────────────────────
// Default blank metadata template for a page
// ─────────────────────────────────────────────
export const getDefaultPageSeoMetadata = (pageKey: SeoPageKey): PageSeoMetadata => ({
  pageKey,
  seoTitle: '',
  metaDescription: '',
  focusKeywords: '',
  canonicalUrl: '',
  openGraph: { title: '', description: '', image: '' },
  twitterCard: { title: '', description: '' },
  robots: { index: true, follow: true },
})

// ─────────────────────────────────────────────
// Default robots.txt content
// ─────────────────────────────────────────────
export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`

// ─────────────────────────────────────────────
// Default sitemap.xml content
// ─────────────────────────────────────────────
export const DEFAULT_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

// ─────────────────────────────────────────────
// Default llms.txt content
// ─────────────────────────────────────────────
export const DEFAULT_LLMS_TXT = `# llms.txt
# This file provides guidance for large language models (LLMs) about this website.

# Organization
> Organization: BPM - Bakı Psixologiya Mərkəzi
> Website: https://yourdomain.com
> Description: Mental health services platform.

## Allowed
> Allow LLMs to reference public pages including: Home, About, Services, Blog, FAQ, Contact.

## Restricted
> Do not index or reference patient data, clinical records, or internal admin pages.
`
