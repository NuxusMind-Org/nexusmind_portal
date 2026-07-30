import { useState, useEffect } from 'react'
import { Cpu, Save, Loader2, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react'
import { seoService } from '../../../api/services/seoService'

export default function LlmsTxtEditor() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadLlms = async () => {
      setIsLoading(true)
      try {
        const text = await seoService.getLlmsTxt()
        setContent(text)
      } catch (err) {
        console.error('Failed to load llms.txt', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadLlms()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await seoService.updateLlmsTxt(content)
      setFeedback({ type: 'success', message: 'llms.txt AI directives updated successfully!' })
    } catch (err) {
      console.error('Failed to update llms.txt', err)
      setFeedback({ type: 'error', message: 'Failed to update llms.txt.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInsertPreset = (snippet: string) => {
    setContent((prev) => (prev ? `${prev.trim()}\n\n${snippet}` : snippet))
  }

  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Web Crawler Directives (llms.txt)</h2>
            <p className="text-xs text-slate-400">
              Provide Markdown instructions for LLM search engines (OpenAI, Anthropic, Google Gemini) indexing your platform.
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

      {/* Preset Snippets */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 font-semibold mr-1">Insert Markdown Template:</span>
        <button
          type="button"
          onClick={() =>
            handleInsertPreset(
              `# NexusMind Health & Therapy Portal\n\n> Platform Description for LLMs & AI Agents`
            )
          }
          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Title Header</span>
        </button>
        <button
          type="button"
          onClick={() =>
            handleInsertPreset(
              `## Core Services\n- Psychological Consultations: /meqale\n- News & Announcements: /xeber\n- Verified Psychologists Directory: /org/psychologists`
            )
          }
          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Services Index</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# NexusMind Portal Markdown Instructions for AI Agents..."
            className="w-full p-4 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-emerald-200 font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-500 font-mono">
              Lines: {content.split('\n').length} | Characters: {content.length}
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.25)] transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save llms.txt</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
