import { useState, useEffect, useCallback } from 'react'
import { Code2, RefreshCw, Loader2, AlertCircle, Info } from 'lucide-react'
import { seoService } from '../../../api/services/seoService'

export default function SeoScriptManager() {
  const [headScripts, setHeadScripts] = useState('')
  const [bodyScripts, setBodyScripts] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadScripts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await seoService.getSiteScripts()
      setHeadScripts(data.customHeadScripts || '')
      setBodyScripts(data.customBodyScripts || '')
      setUpdatedAt(data.updatedAt || null)
    } catch (err) {
      console.error('Failed to load site scripts from GET /site-settings/scripts', err)
      setError('Could not load site scripts from GET /site-settings/scripts.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    seoService
      .getSiteScripts()
      .then((data) => {
        if (!active) return
        setHeadScripts(data.customHeadScripts || '')
        setBodyScripts(data.customBodyScripts || '')
        setUpdatedAt(data.updatedAt || null)
        setError(null)
      })
      .catch((err) => {
        if (!active) return
        console.error('Failed to load site scripts from GET /site-settings/scripts', err)
        setError('Could not load site scripts from GET /site-settings/scripts.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Global Site Scripts</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[10px] font-mono">
                GET /site-settings/scripts
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Inspect active &lt;head&gt; and &lt;body&gt; tracking scripts returned by the backend site-settings controller.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadScripts}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-[#1b1c2b] hover:bg-[#23253a] border border-[#2e3146] text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-200/90 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Read-Only Endpoint</p>
          <p className="text-slate-400 mt-0.5">
            NexusMind API v1.0 exposes <code className="text-cyan-300">GET /site-settings/scripts</code> for reading active head/body scripts. Use the <strong>robots.txt</strong>, <strong>sitemap.xml</strong>, and <strong>llms.txt</strong> tabs to edit writable SEO files.
            {updatedAt && <span className="ml-2 text-slate-500 font-mono">Last updated: {updatedAt}</span>}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Custom &lt;head&gt; Scripts (customHeadScripts)</span>
              <span className="text-[10px] text-slate-500 font-mono">Read-only</span>
            </label>
            <textarea
              rows={6}
              readOnly
              value={headScripts || '<!-- No customHeadScripts configured on server -->'}
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Custom &lt;body&gt; Scripts (customBodyScripts)</span>
              <span className="text-[10px] text-slate-500 font-mono">Read-only</span>
            </label>
            <textarea
              rows={6}
              readOnly
              value={bodyScripts || '<!-- No customBodyScripts configured on server -->'}
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
