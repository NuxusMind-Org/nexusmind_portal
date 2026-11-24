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
      console.error('Failed to load site scripts', err)
      setError('Sayt skriptləri yüklənə bilmədi.')
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
        console.error('Failed to load site scripts', err)
        setError('Sayt skriptləri yüklənə bilmədi.')
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
              <span>Qlobal Sayt Skriptləri</span>
            </h2>
            <p className="text-xs text-slate-400">
              Server tərəfindən təqdim edilən aktiv &lt;head&gt; və &lt;body&gt; izləmə skriptlərinə baxın.
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
          <span>Yenilə</span>
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-200/90 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Yalnız Oxumaq Üçün</p>
          <p className="text-slate-400 mt-0.5">
            Aktiv &lt;head&gt; və &lt;body&gt; skriptləri bu bölmədə yalnız baxış üçün göstərilir. Redaktə edilə bilən SEO faylları üçün <strong>robots.txt</strong>, <strong>sitemap.xml</strong> və <strong>llms.txt</strong> bölmələrindən istifadə edin.
            {updatedAt && <span className="ml-2 text-slate-500 font-mono">Son yenilənmə: {updatedAt}</span>}
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
              <span>Xüsusi &lt;head&gt; Skriptləri</span>
              <span className="text-[10px] text-slate-500 font-mono">Yalnız oxumaq üçün</span>
            </label>
            <textarea
              rows={6}
              readOnly
              value={headScripts || '<!-- Serverdə xüsusi <head> skripti konfiqurasiya edilməyib -->'}
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Xüsusi &lt;body&gt; Skriptləri</span>
              <span className="text-[10px] text-slate-500 font-mono">Yalnız oxumaq üçün</span>
            </label>
            <textarea
              rows={6}
              readOnly
              value={bodyScripts || '<!-- Serverdə xüsusi <body> skripti konfiqurasiya edilməyib -->'}
              className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
