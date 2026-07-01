import { useState, useEffect } from 'react'
import { Code2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import type { SchemaEntry, SeoPageKey } from '../../types/seo'
import { SEO_PAGES } from '../../constants/seoPages'
import { validateJsonLd, formatJson } from '../../utils/seoValidation'

interface StructuredDataTabProps {
  schemas: Record<SeoPageKey, SchemaEntry>
  isSaving: boolean
  onSave: (entry: SchemaEntry) => void
  onDelete: (pageKey: SeoPageKey) => void
  onDirty: () => void
}

const EXAMPLE_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bakı Psixologiya Mərkəzi",
  "url": "https://yourdomain.com",
  "logo": "https://yourdomain.com/logo.png",
  "description": "Professional mental health services in Baku."
}`

export default function StructuredDataTab({
  schemas,
  isSaving,
  onSave,
  onDelete,
  onDirty,
}: StructuredDataTabProps) {
  const [selectedPage, setSelectedPage] = useState<SeoPageKey>('home')
  const [rawJson, setRawJson] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const entry = schemas[selectedPage]
    const content = entry?.rawJsonLd ?? ''
    setRawJson(content ? formatJson(content) : '')
    setJsonError(null)
    setIsDirty(false)
  }, [selectedPage, schemas])

  function handleChange(value: string) {
    setRawJson(value)
    setJsonError(validateJsonLd(value))
    if (!isDirty) {
      setIsDirty(true)
      onDirty()
    }
  }

  function handleFormat() {
    try {
      setRawJson(formatJson(rawJson))
    } catch {}
  }

  function handleSave() {
    const err = validateJsonLd(rawJson)
    if (err) {
      setJsonError(err)
      return
    }
    onSave({ pageKey: selectedPage, rawJsonLd: rawJson })
    setIsDirty(false)
  }

  function handleDelete() {
    onDelete(selectedPage)
    setRawJson('')
    setJsonError(null)
    setIsDirty(false)
  }

  function handleReset() {
    const entry = schemas[selectedPage]
    const content = entry?.rawJsonLd ?? ''
    setRawJson(content ? formatJson(content) : '')
    setJsonError(null)
    setIsDirty(false)
  }

  const hasContent = rawJson.trim().length > 0
  const pageLabel = SEO_PAGES.find((p) => p.key === selectedPage)?.label ?? selectedPage

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[600px]">
      {/* Left Sidebar — Page Selector */}
      <div className="w-full lg:w-56 xl:w-64 shrink-0 border-r border-[#222437] bg-[#0e0f1a]">
        <div className="p-4 border-b border-[#222437]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Website Pages</p>
        </div>
        <nav className="py-2">
          {SEO_PAGES.map((page) => {
            const hasSchema = (schemas[page.key]?.rawJsonLd ?? '').trim().length > 0
            return (
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
                {hasSchema && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-slate-200">
              JSON-LD Schema — <span className="text-violet-300">{pageLabel}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {hasContent && (
              <button
                onClick={handleFormat}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] rounded-lg transition-all cursor-pointer"
              >
                Format JSON
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {jsonError && (
          <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-300 font-medium">{jsonError}</p>
          </div>
        )}

        {/* Valid indicator */}
        {!jsonError && hasContent && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Valid JSON-LD</span>
          </div>
        )}

        {/* Code Editor */}
        <div className="relative flex-1 min-h-[300px]">
          <textarea
            value={rawJson}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={EXAMPLE_SCHEMA}
            spellCheck={false}
            className={`w-full h-full min-h-[300px] px-4 py-4 font-mono text-xs bg-[#0c0d18] border rounded-xl text-slate-300 placeholder-slate-700 focus:outline-none resize-y transition-colors ${
              jsonError ? 'border-rose-500/40' : 'border-[#2e3146] focus:border-violet-500'
            }`}
          />
        </div>

        {/* Instructions */}
        <p className="text-[10px] text-slate-600">
          Paste valid <code className="text-violet-400">{'<script type="application/ld+json">'}</code> content here. The <code className="text-violet-400">@context</code> and <code className="text-violet-400">@type</code> properties are required.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#222437]">
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty || !!jsonError}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            {isSaving ? 'Saving…' : 'Save Schema'}
          </button>
          <button
            onClick={handleReset}
            disabled={!isDirty}
            className="px-5 py-2 bg-[#1b1c2b] hover:bg-[#222437] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2e3146] text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel
          </button>
          {hasContent && (
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Schema
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
