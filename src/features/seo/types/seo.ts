// SEO Feature - TypeScript Type Definitions
// All types for the SEO Management Module

// ─────────────────────────────────────────────
// Supported website pages
// ─────────────────────────────────────────────
export type SeoPageKey =
  | 'home'
  | 'about'
  | 'services'
  | 'psychologists'
  | 'blog'
  | 'faq'
  | 'contact'
  | 'blog-individual'
  | string // allows future dynamic pages

export interface SeoPageDefinition {
  key: SeoPageKey
  label: string
  description: string
  isDynamic?: boolean
}

// ─────────────────────────────────────────────
// Tab 1 — General SEO: Per-page metadata
// ─────────────────────────────────────────────
export interface RobotsDirective {
  index: boolean
  follow: boolean
}

export interface OpenGraphMeta {
  title: string
  description: string
  image: string
}

export interface TwitterCardMeta {
  title: string
  description: string
}

export interface PageSeoMetadata {
  pageKey: SeoPageKey
  seoTitle: string
  metaDescription: string
  focusKeywords: string
  canonicalUrl: string
  openGraph: OpenGraphMeta
  twitterCard: TwitterCardMeta
  robots: RobotsDirective
}

// ─────────────────────────────────────────────
// Tab 2 — Structured Data (Schema.org)
// ─────────────────────────────────────────────
export interface SchemaEntry {
  pageKey: SeoPageKey
  rawJsonLd: string // stored as raw JSON-LD string
  lastUpdated?: string
}

// ─────────────────────────────────────────────
// Tab 3 — Scripts (Head & Body)
// ─────────────────────────────────────────────
export interface ScriptsConfig {
  headScripts: string
  bodyScripts: string
  lastUpdated?: string
}

// ─────────────────────────────────────────────
// Tab 4 — robots.txt
// ─────────────────────────────────────────────
export interface RobotsConfig {
  content: string
  lastUpdated?: string
}

// ─────────────────────────────────────────────
// Tab 5 — sitemap.xml
// ─────────────────────────────────────────────
export interface SitemapConfig {
  content: string
  lastUpdated?: string
}

// ─────────────────────────────────────────────
// Tab 6 — llms.txt
// ─────────────────────────────────────────────
export interface LlmsConfig {
  content: string
  lastUpdated?: string
}

// ─────────────────────────────────────────────
// Aggregate SEO store for an organization
// ─────────────────────────────────────────────
export interface OrganizationSeoData {
  tenantId: string
  generalSeo: Record<SeoPageKey, PageSeoMetadata>
  schemas: Record<SeoPageKey, SchemaEntry>
  scripts: ScriptsConfig
  robots: RobotsConfig
  sitemap: SitemapConfig
  llms: LlmsConfig
}

// ─────────────────────────────────────────────
// Tab identifiers
// ─────────────────────────────────────────────
export type SeoTab =
  | 'general'
  | 'schema'
  | 'scripts'
  | 'robots'
  | 'sitemap'
  | 'llms'

export interface SeoTabDefinition {
  id: SeoTab
  label: string
  description: string
}

// ─────────────────────────────────────────────
// Save states
// ─────────────────────────────────────────────
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error'
