import { useState, useEffect } from 'react'
import { Bot, Save, Loader2, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react'
import { seoService } from '../../../api/services/seoService'

export default function RobotsTxtEditor() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadRobots = async () => {
      setIsLoading(true)
      try {
        const text = await seoService.getRobotsTxt()
        setContent(text)
      } catch (err) {
        console.error('Failed to load robots.txt', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadRobots()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await seoService.updateRobotsTxt(content)
      setFeedback({ type: 'success', message: 'robots.txt directives saved successfully!' })
    } catch (err) {
      console.error('Failed to update robots.txt', err)
      setFeedback({ type: 'error', message: 'Failed to update robots.txt.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInsertPreset = (directive: string) => {
    setContent((prev) => (prev ? `${prev.trim()}\n${directive}` : directive))
  }

  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Crawler Directives (robots.txt)</h2>
            <p className="text-xs text-slate-400">
              Control web search engine crawler access rules and specify your sitemap location.
            </p>
          </div>
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

      {/* Preset Directive Shortcuts */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 font-semibold mr-1">Insert Directive:</span>
        <button
          type="button"
          onClick={() => handleInsertPreset('User-agent: *\nAllow: /')}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Allow All</span>
        </button>
        <button
          type="button"
          onClick={() => handleInsertPreset('Disallow: /admin')}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Disallow /admin</span>
        </button>
        <button
          type="button"
          onClick={() => handleInsertPreset('Sitemap: https://nexusmind.az/sitemap.xml')}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Add Sitemap Link</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin&#10;&#10;Sitemap: https://nexusmind.az/sitemap.xml"
            className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-indigo-200 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-500 font-mono">
              Lines: {content.split('\n').length} | Characters: {content.length}
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(99,102,241,0.25)] transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save robots.txt</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
