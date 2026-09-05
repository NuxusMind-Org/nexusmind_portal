import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Globe, 
  Tag, 
  Quote as QuoteIcon, 
  Loader2, 
  AlertCircle, 
  Share2, 
  Check, 
  Sparkles,
  User
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { MeqaleResponseDto } from '../../../../types/portalDtos'
import { getLocalizedTitle } from '../../../../utils/multilingual'

export default function MeqalePreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<MeqaleResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

  useEffect(() => {
    if (!id) {
      setError('No article ID provided.')
      setIsLoading(false)
      return
    }

    const fetchArticle = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await contentService.getMeqaleById(id)
        if (data) {
          setItem(data)
        } else {
          setError('Article not found.')
        }
      } catch (err: any) {
        console.error('Failed to fetch article details', err)
        setError(err?.response?.data?.message || 'Failed to load article.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-400" />
        <span className="text-sm font-semibold">Loading article reader...</span>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md">{error || 'The requested article could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/org/meqale')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
      </div>
    )
  }

  const localizedTitle = getLocalizedTitle(item.titleDto || item.title)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => navigate('/org/meqale')}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Articles</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-xs sm:max-w-md font-medium">
            {localizedTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#1b1c2b] rounded-xl border border-[#2e3146]">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Article Reader
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEO & Schema
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        /* MAIN ARTICLE READER VIEW */
        <article className="bg-[#141521] border border-[#222437] rounded-3xl overflow-hidden shadow-2xl space-y-8 pb-10">
          {/* Cover Hero Banner */}
          {item.imageUrl ? (
            <div className="w-full h-80 sm:h-96 relative bg-[#0e0f19] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={localizedTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141521] via-transparent to-black/30" />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-br from-indigo-950/40 via-[#141521] to-[#10111a] flex items-center justify-center text-indigo-400/40">
              <BookOpen className="w-16 h-16" />
            </div>
          )}

          {/* Article Header Details */}
          <div className="px-6 sm:px-12 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                {item.category || 'Psychology'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{item.author || 'BPM Editorial'}</span>
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                item.status === 'PUBLISHED'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : item.status === 'ARCHIVED'
                  ? 'bg-slate-700/50 text-slate-300'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.status || 'PUBLISHED'}</span>
              </span>
              {item.doctorId && (
                <span className="px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                  Doctor #{item.doctorId}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {localizedTitle}
            </h1>

            {item.shortDescription && (
              <p className="text-base sm:text-lg font-medium text-indigo-200/90 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-1">
                {item.shortDescription}
              </p>
            )}
          </div>

          {/* Intro Paragraph */}
          {item.introText && (
            <div className="mx-6 sm:mx-12 p-5 bg-[#1b1c2b] border border-[#2e3146] rounded-2xl text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {item.introText}
            </div>
          )}

          {/* Highlight Key Takeaway Cards */}
          {item.highlightCards && item.highlightCards.length > 0 && (
            <div className="mx-6 sm:mx-12 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Key Clinical Takeaways</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.highlightCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-[#1b1c2b] border border-indigo-500/30 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{card.title}</span>
                    </div>
                    {card.text && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{card.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Section Long-Form Content */}
          <div className="px-6 sm:px-12 space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {item.sections && item.sections.length > 0 ? (
              <div className="space-y-8">
                {item.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 pb-2 border-b border-[#222437]">
                      <span className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 text-xs font-mono flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{getLocalizedTitle(section.title)}</span>
                    </h2>
                    <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line pt-1">
                      {section.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-line">{item.content || 'No detailed content available.'}</div>
            )}
          </div>

          {/* Featured Quote Callout Banner */}
          {item.quote && (
            <div className="mx-6 sm:mx-12 p-6 sm:p-8 bg-gradient-to-r from-indigo-950/40 via-[#1a1b2d] to-[#141521] border border-indigo-500/30 rounded-3xl relative shadow-lg">
              <QuoteIcon className="w-12 h-12 text-indigo-400/20 absolute right-6 top-6" />
              <p className="text-lg sm:text-xl font-semibold text-white italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>
          )}
        </article>
      ) : (
        /* SEO & TECHNICAL METADATA VIEW */
        <div className="bg-[#141521] border border-[#222437] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#222437]">
            <Globe className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Article SEO & Search Graph</h2>
              <p className="text-xs text-slate-400">Search keywords, author indexing, and JSON-LD schema metadata.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
              <span className="text-slate-400 font-semibold">Author Credits:</span>
              <p className="text-white font-semibold">{item.author || 'BPM Editorial'}</p>
            </div>
            <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
              <span className="text-slate-400 font-semibold">Category Domain:</span>
              <p className="text-white font-semibold">{item.category || 'Psychology'}</p>
            </div>
          </div>

          {/* Keywords */}
          {item.metaKeywords && item.metaKeywords.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Indexed Search Keywords:</span>
              <div className="flex flex-wrap gap-2">
                {item.metaKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schema JSON-LD */}
          {item.schemaMarkup && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Structured Data Graph (JSON-LD):</span>
              <pre className="p-4 bg-[#0a0b12] rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-[#222437]">
                {item.schemaMarkup}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
