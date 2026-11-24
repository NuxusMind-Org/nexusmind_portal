import type { SeoPageDefinition, SeoTabDefinition, PageSeoMetadata, SeoPageKey } from '../types/seo'

// ─────────────────────────────────────────────
// Supported website pages
// Add future pages here without changing architecture
// ─────────────────────────────────────────────
export const SEO_PAGES: SeoPageDefinition[] = [
  { key: 'home',          label: 'Ana Səhifə',            description: 'Veb-saytın ana səhifəsi' },
  { key: 'about',         label: 'Haqqımızda',            description: 'Haqqımızda səhifəsi' },
  { key: 'services',      label: 'Xidmətlər',             description: 'Xidmətlərin icmalı səhifəsi' },
  { key: 'psychologists', label: 'Psixoloqlar',           description: 'Psixoloqlar kataloqu səhifəsi' },
  { key: 'blog',          label: 'Bloq',                  description: 'Bloq siyahısı səhifəsi' },
  { key: 'faq',           label: 'Tez-tez Verilən Suallar', description: 'Tez-tez verilən suallar səhifəsi' },
  { key: 'contact',       label: 'Əlaqə',                 description: 'Əlaqə səhifəsi' },
  { key: 'blog-individual', label: 'Fərdi Bloq Yazısı',   description: 'Tək bloq məqaləsi səhifələri üçün şablon', isDynamic: true },
]

// ─────────────────────────────────────────────
// Tab navigation definitions
// ─────────────────────────────────────────────
export const SEO_TABS: SeoTabDefinition[] = [
  { id: 'general',  label: 'Ümumi SEO',              description: 'Səhifə metaməlumatları, Open Graph, Twitter kartları və bot direktivləri' },
  { id: 'schema',   label: 'Strukturlaşdırılmış Məlumat', description: 'Hər səhifə üçün Schema.org JSON-LD işarələməsi' },
  { id: 'scripts',  label: 'Skriptlər',              description: 'Head və body skriptləri (Analitika, GTM, Piksellər)' },
  { id: 'robots',   label: 'robots.txt',             description: 'Axtarış botlarının sayta girişini tənzimləyin' },
  { id: 'sitemap',  label: 'sitemap.xml',            description: 'Axtarış sistemlərinin indeksləməsi üçün XML sayt xəritəsi' },
  { id: 'llms',     label: 'llms.txt',               description: 'Böyük dil modelləri üçün konfiqurasiya' },
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

Sitemap: https://nexusmind.az/sitemap.xml`

// ─────────────────────────────────────────────
// Default sitemap.xml content
// ─────────────────────────────────────────────
export const DEFAULT_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nexusmind.az/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

// ─────────────────────────────────────────────
// Default llms.txt content
// ─────────────────────────────────────────────
export const DEFAULT_LLMS_TXT = `# llms.txt
# Bu fayl böyük dil modellərinə (LLM) veb-sayt haqqında bələdçilik təqdim edir.

# Təşkilat
> Təşkilat: BPM - Bakı Psixologiya Mərkəzi
> Veb-sayt: https://nexusmind.az
> Təsvir: Psixi sağlamlıq xidmətləri platforması.

## İcazə Verilənlər
> Süni intellekt sistemlərinin ictimai səhifələrə istinad etməsinə icazə verilir: Ana Səhifə, Haqqımızda, Xidmətlər, Bloq, Suallar, Əlaqə.

## Məhdudlaşdırılmış
> Pasiyent məlumatlarını, klinik qeydləri və ya daxili idarəetmə səhifələrini indeksləməyin və istinad etməyin.
`
