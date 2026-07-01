import { Search, Globe } from 'lucide-react'
import { useSeoManager } from '../../hooks/useSeoManager'
import SeoTabNav from '../../components/SeoTabNav'
import GeneralSeoTab from '../../components/GeneralSeoTab'
import StructuredDataTab from '../../components/StructuredDataTab'
import ScriptsTab from '../../components/ScriptsTab'
import RobotsTxtTab from '../../components/RobotsTxtTab'
import SitemapTab from '../../components/SitemapTab'
import LlmsTxtTab from '../../components/LlmsTxtTab'
import type { SchemaEntry, ScriptsConfig, RobotsConfig, SitemapConfig, LlmsConfig, SeoPageKey } from '../../types/seo'

// ─── Toast Notification ───────────────────────────────────────────────────────
function SeoToastNotification({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm transition-all animate-slide-up ${
        type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
          : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span className="text-xs font-semibold">{message}</span>
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function SeoLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-[#1b1c2b] rounded-xl" />
      ))}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-[#1b1c2b] rounded-xl" />
        <div className="h-24 bg-[#1b1c2b] rounded-xl" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SeoManagement() {
  const mgr = useSeoManager()

  const isSavingGeneral = mgr.saveStatus['general'] === 'saving'
  const isSavingSchema  = mgr.saveStatus['schema']  === 'saving'
  const isSavingScripts = mgr.saveStatus['scripts'] === 'saving'
  const isSavingRobots  = mgr.saveStatus['robots']  === 'saving'
  const isSavingSitemap = mgr.saveStatus['sitemap'] === 'saving'
  const isSavingLlms    = mgr.saveStatus['llms']    === 'saving'

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="px-6 pt-8 pb-6 border-b border-[#222437]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/30 to-teal-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">SEO Management</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-violet-500/10 border-violet-500/25 text-violet-300">
                Organization
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Configure all SEO settings for your organization's website — metadata, schemas, scripts, and crawler files.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        {mgr.data && (
          <div className="flex flex-wrap items-center gap-4 mt-5">
            {[
              { label: 'Pages Configured', value: Object.values(mgr.data.generalSeo).filter((p) => p.seoTitle).length, total: Object.keys(mgr.data.generalSeo).length, color: 'text-violet-400' },
              { label: 'Schemas Active', value: Object.values(mgr.data.schemas).filter((s) => s.rawJsonLd.trim()).length, total: Object.keys(mgr.data.schemas).length, color: 'text-teal-400' },
              { label: 'Scripts', value: (mgr.data.scripts.headScripts || mgr.data.scripts.bodyScripts) ? 'Configured' : 'Empty', isText: true, color: 'text-sky-400' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 bg-[#1b1c2b] rounded-lg border border-[#2e3146]">
                <Globe className={`w-3 h-3 ${stat.color}`} />
                <span className="text-[10px] text-slate-500">{stat.label}:</span>
                <span className={`text-[10px] font-bold ${stat.color}`}>
                  {stat.isText ? stat.value : `${stat.value}/${stat.total}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <SeoTabNav
        activeTab={mgr.activeTab}
        dirtyTabs={mgr.dirtyTabs}
        onTabChange={mgr.switchTab}
      />

      {/* ── Tab Content ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {mgr.isLoading ? (
          <SeoLoadingSkeleton />
        ) : !mgr.data ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">Failed to load SEO data. Please refresh the page.</p>
          </div>
        ) : (
          <>
            {mgr.activeTab === 'general' && (
              <GeneralSeoTab
                generalSeo={mgr.data.generalSeo}
                isSaving={isSavingGeneral}
                onSave={mgr.saveGeneral}
                onDirty={() => mgr.markDirty('general')}
              />
            )}
            {mgr.activeTab === 'schema' && (
              <StructuredDataTab
                schemas={mgr.data.schemas}
                isSaving={isSavingSchema}
                onSave={(entry: SchemaEntry) => mgr.saveSchema(entry)}
                onDelete={(pageKey: SeoPageKey) => mgr.deleteSchema(pageKey)}
                onDirty={() => mgr.markDirty('schema')}
              />
            )}
            {mgr.activeTab === 'scripts' && (
              <ScriptsTab
                scripts={mgr.data.scripts}
                isSaving={isSavingScripts}
                onSave={(data: ScriptsConfig) => mgr.saveScriptsData(data)}
                onDirty={() => mgr.markDirty('scripts')}
              />
            )}
            {mgr.activeTab === 'robots' && (
              <RobotsTxtTab
                robots={mgr.data.robots}
                isSaving={isSavingRobots}
                onSave={(data: RobotsConfig) => mgr.saveRobotsData(data)}
                onDirty={() => mgr.markDirty('robots')}
              />
            )}
            {mgr.activeTab === 'sitemap' && (
              <SitemapTab
                sitemap={mgr.data.sitemap}
                isSaving={isSavingSitemap}
                onSave={(data: SitemapConfig) => mgr.saveSitemapData(data)}
                onDirty={() => mgr.markDirty('sitemap')}
              />
            )}
            {mgr.activeTab === 'llms' && (
              <LlmsTxtTab
                llms={mgr.data.llms}
                isSaving={isSavingLlms}
                onSave={(data: LlmsConfig) => mgr.saveLlmsData(data)}
                onDirty={() => mgr.markDirty('llms')}
              />
            )}
          </>
        )}
      </div>

      {/* ── Toast Notification ───────────────────────────────── */}
      {mgr.toast && (
        <SeoToastNotification type={mgr.toast.type} message={mgr.toast.message} />
      )}
    </div>
  )
}
