// SEO Feature — Mock API
// All functions are typed for future REST API replacement
// Replace mock implementations with real axios calls when backend is ready

import type {
  OrganizationSeoData,
  PageSeoMetadata,
  SchemaEntry,
  ScriptsConfig,
  RobotsConfig,
  SitemapConfig,
  LlmsConfig,
  SeoPageKey,
} from '../types/seo'
import {
  SEO_PAGES,
  getDefaultPageSeoMetadata,
  DEFAULT_ROBOTS_TXT,
  DEFAULT_SITEMAP_XML,
  DEFAULT_LLMS_TXT,
} from '../constants/seoPages'

// ─────────────────────────────────────────────
// Build the initial empty data structure
// ─────────────────────────────────────────────
function buildInitialSeoData(tenantId: string): OrganizationSeoData {
  const generalSeo: Record<SeoPageKey, PageSeoMetadata> = {} as Record<SeoPageKey, PageSeoMetadata>
  const schemas: Record<SeoPageKey, SchemaEntry> = {} as Record<SeoPageKey, SchemaEntry>

  SEO_PAGES.forEach(({ key }) => {
    generalSeo[key] = getDefaultPageSeoMetadata(key)
    schemas[key] = { pageKey: key, rawJsonLd: '' }
  })

  return {
    tenantId,
    generalSeo,
    schemas,
    scripts: { headScripts: '', bodyScripts: '' },
    robots: { content: DEFAULT_ROBOTS_TXT },
    sitemap: { content: DEFAULT_SITEMAP_XML },
    llms: { content: DEFAULT_LLMS_TXT },
  }
}

// In-memory store (mocks persistence for this session)
let _store: OrganizationSeoData | null = null

function getStore(tenantId: string): OrganizationSeoData {
  if (!_store) {
    _store = buildInitialSeoData(tenantId)
  }
  return _store
}

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms))

// ─────────────────────────────────────────────
// Load all SEO data for an organization
// ─────────────────────────────────────────────
export async function fetchSeoData(tenantId: string): Promise<OrganizationSeoData> {
  await delay()
  return JSON.parse(JSON.stringify(getStore(tenantId)))
}

// ─────────────────────────────────────────────
// Save General SEO metadata for a single page
// ─────────────────────────────────────────────
export async function savePageSeoMetadata(
  tenantId: string,
  data: PageSeoMetadata
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.generalSeo[data.pageKey] = { ...data }
}

// ─────────────────────────────────────────────
// Save Schema for a single page
// ─────────────────────────────────────────────
export async function saveSchemaEntry(
  tenantId: string,
  entry: SchemaEntry
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.schemas[entry.pageKey] = {
    ...entry,
    lastUpdated: new Date().toISOString(),
  }
}

export async function deleteSchemaEntry(
  tenantId: string,
  pageKey: SeoPageKey
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.schemas[pageKey] = { pageKey, rawJsonLd: '' }
}

// ─────────────────────────────────────────────
// Save Scripts
// ─────────────────────────────────────────────
export async function saveScripts(
  tenantId: string,
  data: ScriptsConfig
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.scripts = { ...data, lastUpdated: new Date().toISOString() }
}

// ─────────────────────────────────────────────
// Save robots.txt
// ─────────────────────────────────────────────
export async function saveRobots(
  tenantId: string,
  data: RobotsConfig
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.robots = { ...data, lastUpdated: new Date().toISOString() }
}

// ─────────────────────────────────────────────
// Save sitemap.xml
// ─────────────────────────────────────────────
export async function saveSitemap(
  tenantId: string,
  data: SitemapConfig
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.sitemap = { ...data, lastUpdated: new Date().toISOString() }
}

// ─────────────────────────────────────────────
// Save llms.txt
// ─────────────────────────────────────────────
export async function saveLlms(
  tenantId: string,
  data: LlmsConfig
): Promise<void> {
  await delay()
  const store = getStore(tenantId)
  store.llms = { ...data, lastUpdated: new Date().toISOString() }
}
