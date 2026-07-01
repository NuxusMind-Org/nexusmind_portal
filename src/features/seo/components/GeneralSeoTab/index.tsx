import { useState, useEffect } from 'react'
import { Globe, Link, Image, Tag, Search, AlertTriangle } from 'lucide-react'
import type { PageSeoMetadata, SeoPageKey } from '../../types/seo'
import { SEO_PAGES, getDefaultPageSeoMetadata } from '../../constants/seoPages'
import { getTitleStatus, getDescriptionStatus } from '../../utils/seoValidation'

interface GeneralSeoTabProps {
  generalSeo: Record<SeoPageKey, PageSeoMetadata>
  isSaving: boolean
  onSave: (meta: PageSeoMetadata) => void
  onDirty: () => void
}

export default function GeneralSeoTab({ generalSeo, isSaving, onSave, onDirty }: GeneralSeoTabProps) {
  const [selectedPage, setSelectedPage] = useState<SeoPageKey>('home')
  const [form, setForm] = useState<PageSeoMetadata>(
    generalSeo['home'] ?? getDefaultPageSeoMetadata('home')
  )
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const base = generalSeo[selectedPage] ?? getDefaultPageSeoMetadata(selectedPage)
    setForm(base)
    setIsDirty(false)
  }, [selectedPage, generalSeo])

  function handleChange<K extends keyof PageSeoMetadata>(key: K, value: PageSeoMetadata[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (!isDirty) {
      setIsDirty(true)
      onDirty()
    }
  }

  function handleNestedChange(
    group: 'openGraph' | 'twitterCard' | 'robots',
    key: string,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [group]: { ...(prev[group] as object), [key]: value },
    }))
    if (!isDirty) {
      setIsDirty(true)
      onDirty()
    }
  }

  function handleSave() {
    onSave(form)
    setIsDirty(false)
  }

  function handleReset() {
    const base = generalSeo[selectedPage] ?? getDefaultPageSeoMetadata(selectedPage)
    setForm(base)
    setIsDirty(false)
  }

  const titleStatus = getTitleStatus(form.seoTitle)
  const descStatus = getDescriptionStatus(form.metaDescription)

  const statusColors = {
    good: 'text-emerald-400',
    warning: 'text-amber-400',
    over: 'text-rose-400',
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[600px]">
      {/* Left Sidebar — Page Selector */}
      <div className="w-full lg:w-56 xl:w-64 shrink-0 border-r border-[#222437] bg-[#0e0f1a]">
        <div className="p-4 border-b border-[#222437]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Website Pages</p>
        </div>
        <nav className="py-2">
          {SEO_PAGES.map((page) => (
            <button
              key={page.key}
              onClick={() => setSelectedPage(page.key)}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                selectedPage === page.key
                  ? 'bg-violet-500/10 text-violet-300 border-r-2 border-violet-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141521]'
              }`}
            >
              <span>{page.label}</span>
              {page.isDynamic && (
                <span className="text-[9px] font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">Dynamic</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Panel — Fields */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8 max-w-3xl">

          {/* Section: Basic SEO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#222437]">
              <Search className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Basic SEO</h3>
            </div>

            {/* SEO Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEO Title</label>
                <span className={`text-[10px] font-bold ${statusColors[titleStatus]}`}>
                  {form.seoTitle.length} / 60 chars
                  {titleStatus === 'over' && ' (Too long)'}
                  {titleStatus === 'warning' && ' (Approaching limit)'}
                </span>
              </div>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                placeholder="Optimized page title for search engines"
                className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Meta Description</label>
                <span className={`text-[10px] font-bold ${statusColors[descStatus]}`}>
                  {form.metaDescription.length} / 155 chars
                  {descStatus === 'over' && ' (Too long)'}
                  {descStatus === 'warning' && ' (Approaching limit)'}
                </span>
              </div>
              <textarea
                value={form.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="Concise description that appears in search result snippets"
                rows={3}
                className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>

            {/* Focus Keywords */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Focus Keywords</label>
              <input
                type="text"
                value={form.focusKeywords}
                onChange={(e) => handleChange('focusKeywords', e.target.value)}
                placeholder="mental health, therapy, psychologist (comma separated)"
                className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Canonical URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Link className="w-3.5 h-3.5" /> Canonical URL
              </label>
              <input
                type="url"
                value={form.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://yourdomain.com/page"
                className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </section>

          {/* Section: Open Graph */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#222437]">
              <Globe className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Open Graph</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">OG Title</label>
                <input
                  type="text"
                  value={form.openGraph.title}
                  onChange={(e) => handleNestedChange('openGraph', 'title', e.target.value)}
                  placeholder="Open Graph title"
                  className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" /> OG Image URL
                </label>
                <input
                  type="url"
                  value={form.openGraph.image}
                  onChange={(e) => handleNestedChange('openGraph', 'image', e.target.value)}
                  placeholder="https://yourdomain.com/og-image.png"
                  className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">OG Description</label>
              <textarea
                value={form.openGraph.description}
                onChange={(e) => handleNestedChange('openGraph', 'description', e.target.value)}
                placeholder="Open Graph description shown when shared on social media"
                rows={2}
                className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>
          </section>

          {/* Section: Twitter Card */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#222437]">
              <Tag className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Twitter Card</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Twitter Title</label>
                <input
                  type="text"
                  value={form.twitterCard.title}
                  onChange={(e) => handleNestedChange('twitterCard', 'title', e.target.value)}
                  placeholder="Twitter card title"
                  className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Twitter Description</label>
                <input
                  type="text"
                  value={form.twitterCard.description}
                  onChange={(e) => handleNestedChange('twitterCard', 'description', e.target.value)}
                  placeholder="Twitter card description"
                  className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Section: Robots */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#222437]">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Robots Directives</h3>
            </div>
            <div className="flex flex-wrap gap-6">
              {/* Index toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => handleNestedChange('robots', 'index', !form.robots.index)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                    form.robots.index ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                      form.robots.index ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">
                    {form.robots.index ? 'Index' : 'NoIndex'}
                  </p>
                  <p className="text-[10px] text-slate-600">Allow search engines to index this page</p>
                </div>
              </label>

              {/* Follow toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => handleNestedChange('robots', 'follow', !form.robots.follow)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                    form.robots.follow ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                      form.robots.follow ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">
                    {form.robots.follow ? 'Follow' : 'NoFollow'}
                  </p>
                  <p className="text-[10px] text-slate-600">Allow crawlers to follow links on this page</p>
                </div>
              </label>
            </div>
          </section>

          {/* Save Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#222437]">
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={handleReset}
              disabled={!isDirty}
              className="px-5 py-2 bg-[#1b1c2b] hover:bg-[#222437] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2e3146] text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
