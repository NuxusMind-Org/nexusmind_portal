import { useState, useEffect } from 'react'
import { Brain, RotateCcw, Info } from 'lucide-react'
import type { LlmsConfig } from '../../types/seo'
import { DEFAULT_LLMS_TXT } from '../../constants/seoPages'

interface LlmsTxtTabProps {
  llms: LlmsConfig
  isSaving: boolean
  onSave: (data: LlmsConfig) => void
  onDirty: () => void
}

export default function LlmsTxtTab({ llms, isSaving, onSave, onDirty }: LlmsTxtTabProps) {
  const [content, setContent] = useState(llms.content)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setContent(llms.content)
    setIsDirty(false)
  }, [llms])

  function handleChange(value: string) {
    setContent(value)
    if (!isDirty) { setIsDirty(true); onDirty() }
  }
  function handleSave() {
    onSave({ content })
    setIsDirty(false)
  }
  function handleReset() {
    setContent(llms.content)
    setIsDirty(false)
  }
  function handleRestoreDefault() {
    setContent(DEFAULT_LLMS_TXT)
    setIsDirty(true)
    onDirty()
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">llms.txt</h3>
            <p className="text-xs text-slate-500">Provides guidance for large language models (LLMs) about your website content and policies.</p>
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

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-violet-500/5 border border-violet-500/15 rounded-xl">
        <Info className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-violet-300">About llms.txt</p>
          <p className="text-xs text-slate-400">
            The <code className="bg-violet-900/30 px-1 rounded text-violet-300">llms.txt</code> file is a proposed standard (similar to <code className="bg-violet-900/30 px-1 rounded text-violet-300">robots.txt</code>) that lets you communicate your content licensing preferences and guidance to AI systems that crawl and learn from websites. Use it to specify which pages AI may reference, summarize, or cite.
          </p>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        rows={16}
        className="w-full px-4 py-4 font-mono text-xs bg-[#0c0d18] border border-[#2e3146] focus:border-violet-500 rounded-xl text-slate-300 focus:outline-none resize-y transition-colors"
      />

      {llms.lastUpdated && (
        <p className="text-[10px] text-slate-600">Last saved: {new Date(llms.lastUpdated).toLocaleString()}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#222437]">
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {isSaving ? 'Saving…' : 'Save llms.txt'}
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
