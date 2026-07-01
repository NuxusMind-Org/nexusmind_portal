// SEO Feature — Central State Management Hook
// Manages loading, per-tab dirty state, save/cancel/reset, and toast notifications

import { useState, useEffect, useCallback } from 'react'
import { useUserStore } from '../../../store/userStore'
import type {
  OrganizationSeoData,
  SeoTab,
  SeoPageKey,
  PageSeoMetadata,
  SchemaEntry,
  ScriptsConfig,
  RobotsConfig,
  SitemapConfig,
  LlmsConfig,
  SaveStatus,
} from '../types/seo'
import {
  fetchSeoData,
  savePageSeoMetadata,
  saveSchemaEntry,
  deleteSchemaEntry,
  saveScripts,
  saveRobots,
  saveSitemap,
  saveLlms,
} from '../api/seoApi'

export interface SeoToast {
  type: 'success' | 'error'
  message: string
}

export function useSeoManager() {
  const profile = useUserStore((s) => s.profile)
  const tenantId = profile?.tenantId ?? profile?.id ?? 'default'

  // ─── Global Loading ───────────────────────────────
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<OrganizationSeoData | null>(null)

  // ─── Tab State ────────────────────────────────────
  const [activeTab, setActiveTab] = useState<SeoTab>('general')

  // ─── Dirty tracking per tab ───────────────────────
  const [dirtyTabs, setDirtyTabs] = useState<Partial<Record<SeoTab, boolean>>>({})

  // ─── Save status per tab ──────────────────────────
  const [saveStatus, setSaveStatus] = useState<Partial<Record<SeoTab, SaveStatus>>>({})

  // ─── Toast notification ───────────────────────────
  const [toast, setToast] = useState<SeoToast | null>(null)

  // ─── Load data on mount ───────────────────────────
  useEffect(() => {
    setIsLoading(true)
    fetchSeoData(tenantId)
      .then((d) => {
        setData(d)
      })
      .finally(() => setIsLoading(false))
  }, [tenantId])

  // ─── Toast auto-dismiss ───────────────────────────
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  // ─── Mark a tab as dirty ──────────────────────────
  const markDirty = useCallback((tab: SeoTab) => {
    setDirtyTabs((prev) => ({ ...prev, [tab]: true }))
  }, [])

  const clearDirty = useCallback((tab: SeoTab) => {
    setDirtyTabs((prev) => ({ ...prev, [tab]: false }))
  }, [])

  const setSave = useCallback((tab: SeoTab, status: SaveStatus) => {
    setSaveStatus((prev) => ({ ...prev, [tab]: status }))
  }, [])

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
  }, [])

  // ─── Tab switch guard ─────────────────────────────
  const switchTab = useCallback((tab: SeoTab) => {
    setActiveTab(tab)
  }, [])

  // ─────────────────────────────────────────────────
  // Save handlers per tab
  // ─────────────────────────────────────────────────

  const saveGeneral = useCallback(async (meta: PageSeoMetadata) => {
    setSave('general', 'saving')
    try {
      await savePageSeoMetadata(tenantId, meta)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          generalSeo: { ...prev.generalSeo, [meta.pageKey]: meta },
        }
      })
      clearDirty('general')
      setSave('general', 'success')
      showToast('success', 'General SEO settings saved successfully.')
    } catch {
      setSave('general', 'error')
      showToast('error', 'Failed to save General SEO settings.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  const saveSchema = useCallback(async (entry: SchemaEntry) => {
    setSave('schema', 'saving')
    try {
      await saveSchemaEntry(tenantId, entry)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          schemas: { ...prev.schemas, [entry.pageKey]: entry },
        }
      })
      clearDirty('schema')
      setSave('schema', 'success')
      showToast('success', 'Schema saved successfully.')
    } catch {
      setSave('schema', 'error')
      showToast('error', 'Failed to save schema.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  const deleteSchema = useCallback(async (pageKey: SeoPageKey) => {
    setSave('schema', 'saving')
    try {
      await deleteSchemaEntry(tenantId, pageKey)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          schemas: { ...prev.schemas, [pageKey]: { pageKey, rawJsonLd: '' } },
        }
      })
      setSave('schema', 'success')
      showToast('success', 'Schema deleted.')
    } catch {
      setSave('schema', 'error')
      showToast('error', 'Failed to delete schema.')
    }
  }, [tenantId, setSave, showToast])

  const saveScriptsData = useCallback(async (scripts: ScriptsConfig) => {
    setSave('scripts', 'saving')
    try {
      await saveScripts(tenantId, scripts)
      setData((prev) => prev ? { ...prev, scripts } : prev)
      clearDirty('scripts')
      setSave('scripts', 'success')
      showToast('success', 'Scripts saved successfully.')
    } catch {
      setSave('scripts', 'error')
      showToast('error', 'Failed to save scripts.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  const saveRobotsData = useCallback(async (robots: RobotsConfig) => {
    setSave('robots', 'saving')
    try {
      await saveRobots(tenantId, robots)
      setData((prev) => prev ? { ...prev, robots } : prev)
      clearDirty('robots')
      setSave('robots', 'success')
      showToast('success', 'robots.txt saved successfully.')
    } catch {
      setSave('robots', 'error')
      showToast('error', 'Failed to save robots.txt.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  const saveSitemapData = useCallback(async (sitemap: SitemapConfig) => {
    setSave('sitemap', 'saving')
    try {
      await saveSitemap(tenantId, sitemap)
      setData((prev) => prev ? { ...prev, sitemap } : prev)
      clearDirty('sitemap')
      setSave('sitemap', 'success')
      showToast('success', 'sitemap.xml saved successfully.')
    } catch {
      setSave('sitemap', 'error')
      showToast('error', 'Failed to save sitemap.xml.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  const saveLlmsData = useCallback(async (llms: LlmsConfig) => {
    setSave('llms', 'saving')
    try {
      await saveLlms(tenantId, llms)
      setData((prev) => prev ? { ...prev, llms } : prev)
      clearDirty('llms')
      setSave('llms', 'success')
      showToast('success', 'llms.txt saved successfully.')
    } catch {
      setSave('llms', 'error')
      showToast('error', 'Failed to save llms.txt.')
    }
  }, [tenantId, clearDirty, setSave, showToast])

  return {
    // State
    isLoading,
    data,
    activeTab,
    dirtyTabs,
    saveStatus,
    toast,
    // Actions
    switchTab,
    markDirty,
    clearDirty,
    setToast,
    // Save handlers
    saveGeneral,
    saveSchema,
    deleteSchema,
    saveScriptsData,
    saveRobotsData,
    saveSitemapData,
    saveLlmsData,
  }
}
