import { useState, useEffect } from 'react'
import { Map, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react'
import type { SitemapConfig } from '../../types/seo'
import { DEFAULT_SITEMAP_XML } from '../../constants/seoPages'
import { validateXml } from '../../utils/seoValidation'

interface SitemapTabProps {
  sitemap: SitemapConfig
  isSaving: boolean
  onSave: (data: SitemapConfig) => void
  onDirty: () => void
}

export default function SitemapTab({ sitemap, isSaving, onSave, onDirty }: SitemapTabProps) {
  const [content, setContent] = useState(sitemap.content)
  const [xmlError, setXmlError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setContent(sitemap.content)
    setXmlError(null)
    setIsDirty(false)
  }, [sitemap])

  function handleChange(value: string) {
    setContent(value)
    setXmlError(validateXml(value))
    if (!isDirty) { setIsDirty(true); onDirty() }
  }
  function handleSave() {
    const err = validateXml(content)
    if (err) { setXmlError(err); return }
    onSave({ content })
    setIsDirty(false)
  }
  function handleReset() {
    setContent(sitemap.content)
    setXmlError(null)
    setIsDirty(false)
  }
  function handleRestoreDefault() {
    setContent(DEFAULT_SITEMAP_XML)
    setXmlError(null)
    setIsDirty(true)
    onDirty()
  }

  const isValid = !xmlError && content.trim().length > 0

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Map className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">sitemap.xml</h3>
            <p className="text-xs text-slate-500">Helps search engines discover and index all pages of your website.</p>
          </div>
        </div>
        <button
          onClick={handleRestoreDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] rounded-lg transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Restore Default
        </button>
      </div>

      {/* Validation Status */}
      {xmlError ? (
        <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 font-medium">{xmlError}</p>
        </div>
      ) : isValid ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Valid XML</span>
        </div>
      ) : null}

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        rows={16}
        className={`w-full px-4 py-4 font-mono text-xs bg-[#0c0d18] border rounded-xl text-slate-300 focus:outline-none resize-y transition-colors ${
          xmlError ? 'border-rose-500/40' : 'border-[#2e3146] focus:border-emerald-500'
        }`}
      />

      {sitemap.lastUpdated && (
        <p className="text-[10px] text-slate-600">Last saved: {new Date(sitemap.lastUpdated).toLocaleString()}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#222437]">
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty || !!xmlError}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {isSaving ? 'Saving…' : 'Save sitemap.xml'}
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
  )
}
