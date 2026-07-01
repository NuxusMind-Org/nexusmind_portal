import { useState, useEffect } from 'react'
import { Bot, RotateCcw } from 'lucide-react'
import type { RobotsConfig } from '../../types/seo'
import { DEFAULT_ROBOTS_TXT } from '../../constants/seoPages'

interface RobotsTxtTabProps {
  robots: RobotsConfig
  isSaving: boolean
  onSave: (data: RobotsConfig) => void
  onDirty: () => void
}

export default function RobotsTxtTab({ robots, isSaving, onSave, onDirty }: RobotsTxtTabProps) {
  const [content, setContent] = useState(robots.content)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setContent(robots.content)
    setIsDirty(false)
  }, [robots])

  function handleChange(value: string) {
    setContent(value)
    if (!isDirty) { setIsDirty(true); onDirty() }
  }
  function handleSave() {
    onSave({ content })
    setIsDirty(false)
  }
  function handleReset() {
    setContent(robots.content)
    setIsDirty(false)
  }
  function handleRestoreDefault() {
    setContent(DEFAULT_ROBOTS_TXT)
    setIsDirty(true)
    onDirty()
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">robots.txt</h3>
            <p className="text-xs text-slate-500">Controls which pages search engine crawlers can access on your website.</p>
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

      {/* Cheatsheet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'User-agent: *', desc: 'Apply to all crawlers' },
          { label: 'Disallow: /admin', desc: 'Block a path' },
          { label: 'Allow: /public', desc: 'Explicitly allow a path' },
          { label: 'Sitemap: …', desc: 'Point to sitemap URL' },
        ].map(({ label, desc }) => (
          <div key={label} className="p-3 bg-[#1b1c2b] border border-[#2e3146] rounded-lg">
            <code className="text-[10px] text-violet-300 block font-mono">{label}</code>
            <p className="text-[10px] text-slate-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        rows={14}
        className="w-full px-4 py-4 font-mono text-xs bg-[#0c0d18] border border-[#2e3146] focus:border-amber-500 rounded-xl text-slate-300 focus:outline-none resize-y transition-colors"
      />

      {robots.lastUpdated && (
        <p className="text-[10px] text-slate-600">Last saved: {new Date(robots.lastUpdated).toLocaleString()}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#222437]">
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {isSaving ? 'Saving…' : 'Save robots.txt'}
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
