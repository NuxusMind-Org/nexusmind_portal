import { useState, useEffect } from 'react'
import { Code2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { seoService } from '../../../api/services/seoService'

export default function SeoScriptManager() {
  const [headScripts, setHeadScripts] = useState('')
  const [bodyScripts, setBodyScripts] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadScripts = async () => {
      setIsLoading(true)
      try {
        const data = await seoService.getSiteScripts()
        setHeadScripts(data.custom_head_scripts || '')
        setBodyScripts(data.custom_body_scripts || '')
      } catch (err) {
        console.error('Failed to load site scripts', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadScripts()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await seoService.updateSiteScripts({
        custom_head_scripts: headScripts,
        custom_body_scripts: bodyScripts,
      })
      setFeedback({ type: 'success', message: 'Global site scripts updated successfully!' })
    } catch (err) {
      console.error('Failed to update site scripts', err)
      setFeedback({ type: 'error', message: 'Failed to save scripts. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Global Site Scripts Injection</h2>
            <p className="text-xs text-slate-400">
              Inject Google Search Console, Google Analytics, GTM, or custom scripts into &lt;head&gt; and &lt;body&gt;.
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

      {isLoading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Custom <head> Scripts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Custom &lt;head&gt; Scripts (custom_head_scripts)</span>
              <span className="text-[10px] text-slate-500 font-mono">Executed before page render</span>
            </label>
            <textarea
              rows={6}
              value={headScripts}
              onChange={(e) => setHeadScripts(e.target.value)}
              placeholder="<!-- Paste Google Site Verification, Analytics, Meta Tags here -->&#10;<script async src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXX'></script>"
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Custom <body> Scripts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Custom &lt;body&gt; Scripts (custom_body_scripts)</span>
              <span className="text-[10px] text-slate-500 font-mono">Executed after body load</span>
            </label>
            <textarea
              rows={6}
              value={bodyScripts}
              onChange={(e) => setBodyScripts(e.target.value)}
              placeholder="<!-- Paste GTM noscript iframe or chat widget scripts here -->&#10;<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX'></iframe></noscript>"
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(6,182,212,0.25)] transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Site Scripts</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
