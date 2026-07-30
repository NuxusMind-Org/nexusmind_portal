import { useState, useEffect } from 'react'
import { Network, Save, Loader2, CheckCircle2, AlertCircle, Plus, Trash2, Code, LayoutList } from 'lucide-react'
import { seoService } from '../../../api/services/seoService'
import type { SitemapUrlEntry } from '../../../types/portalDtos'

export default function SitemapManager() {
  const [mode, setMode] = useState<'VISUAL' | 'RAW_XML'>('VISUAL')
  const [urls, setUrls] = useState<SitemapUrlEntry[]>([])
  const [rawXml, setRawXml] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadSitemap = async () => {
      setIsLoading(true)
      try {
        const data = await seoService.getSitemap()
        if (data.urls && data.urls.length > 0) {
          setUrls(data.urls)
        } else {
          setUrls([
            { loc: 'https://nexusmind.az/', priority: 1.0, changefreq: 'daily' },
            { loc: 'https://nexusmind.az/xeber', priority: 0.8, changefreq: 'daily' },
            { loc: 'https://nexusmind.az/meqale', priority: 0.8, changefreq: 'weekly' },
            { loc: 'https://nexusmind.az/blogs', priority: 0.8, changefreq: 'weekly' },
          ])
        }
        if (data.xml) {
          setRawXml(data.xml)
        } else {
          generateXmlFromUrls(data.urls || [])
        }
      } catch (err) {
        console.error('Failed to load sitemap', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSitemap()
  }, [])

  const generateXmlFromUrls = (entries: SitemapUrlEntry[]) => {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    entries.forEach((u) => {
      lines.push('  <url>')
      lines.push(`    <loc>${u.loc}</loc>`)
      if (u.priority) lines.push(`    <priority>${u.priority}</priority>`)
      if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`)
      if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`)
      lines.push('  </url>')
    })
    lines.push('</urlset>')
    const generated = lines.join('\n')
    setRawXml(generated)
    return generated
  }

  const handleAddUrl = () => {
    const newEntry: SitemapUrlEntry = {
      loc: 'https://nexusmind.az/new-page',
      priority: 0.8,
      changefreq: 'weekly',
    }
    const updated = [...urls, newEntry]
    setUrls(updated)
    generateXmlFromUrls(updated)
  }

  const handleUpdateUrl = (index: number, field: keyof SitemapUrlEntry, value: any) => {
    const updated = [...urls]
    updated[index] = { ...updated[index], [field]: value }
    setUrls(updated)
    generateXmlFromUrls(updated)
  }

  const handleRemoveUrl = (index: number) => {
    const updated = urls.filter((_, i) => i !== index)
    setUrls(updated)
    generateXmlFromUrls(updated)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      const xmlToSave = mode === 'RAW_XML' ? rawXml : generateXmlFromUrls(urls)
      await seoService.updateSitemap({
        urls,
        xml: xmlToSave,
      })
      setFeedback({ type: 'success', message: 'Sitemap updated successfully!' })
    } catch (err) {
      console.error('Failed to update sitemap', err)
      setFeedback({ type: 'error', message: 'Failed to update sitemap.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sitemap Viewer & Editor (sitemap.xml)</h2>
            <p className="text-xs text-slate-400">
              Manage indexed page URLs, priorities, and update frequencies.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#10111a] border border-[#2e3146] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('VISUAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'VISUAL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Visual Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('RAW_XML')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'RAW_XML'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw XML Mode</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {mode === 'VISUAL' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Sitemap URLs ({urls.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL Entry</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {urls.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-[#10111a] border border-[#222437] rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">URL Location (loc)</label>
                      <input
                        type="url"
                        required
                        value={entry.loc}
                        onChange={(e) => handleUpdateUrl(idx, 'loc', e.target.value)}
                        placeholder="https://nexusmind.az/page"
                        className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Frequency</label>
                      <select
                        value={entry.changefreq || 'weekly'}
                        onChange={(e) => handleUpdateUrl(idx, 'changefreq', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="always">always</option>
                        <option value="hourly">hourly</option>
                        <option value="daily">daily</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                        <option value="never">never</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Priority (0.1 - 1.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="1.0"
                        value={entry.priority ?? 0.8}
                        onChange={(e) => handleUpdateUrl(idx, 'priority', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-1 flex items-center justify-end pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(idx)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Remove URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Raw XML Content (&lt;urlset&gt;)</span>
                <span className="text-[10px] text-slate-500 font-mono">Standard Sitemap 0.9 XML</span>
              </label>
              <textarea
                rows={12}
                value={rawXml}
                onChange={(e) => setRawXml(e.target.value)}
                placeholder='<?xml version="1.0" encoding="UTF-8"?>...'
                className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-purple-300 font-mono leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(147,51,234,0.25)] transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Sitemap</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
