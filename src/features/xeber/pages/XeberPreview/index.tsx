import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Newspaper, 
  Clock, 
  CheckCircle2, 
  Globe, 
  Tag, 
  Quote as QuoteIcon, 
  Loader2, 
  AlertCircle, 
  Share2, 
  Check
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { XeberResponseDto } from '../../../../types/portalDtos'
import { getLocalizedTitle } from '../../../../utils/multilingual'

export default function XeberPreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<XeberResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

  useEffect(() => {
    if (!id) {
      setError('No news ID provided.')
      setIsLoading(false)
      return
    }

    const fetchNews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await contentService.getXeberById(id)
        if (data) {
          setItem(data)
        } else {
          setError('News article not found.')
        }
      } catch (err: any) {
        console.error('Failed to fetch news article details', err)
        setError(err?.response?.data?.message || 'Failed to load news article.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-violet-400" />
        <span className="text-sm font-semibold">Loading news article preview...</span>
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
        <p className="text-xs text-slate-400 max-w-md">{error || 'The requested news article could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/org/xeber')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News Management</span>
        </button>
      </div>
    )
  }

  const localizedTitle = getLocalizedTitle(item.title)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => navigate('/org/xeber')}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to News</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-xs sm:max-w-md font-medium">
            {localizedTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher for Content vs SEO */}
          <div className="flex items-center p-1 bg-[#1b1c2b] rounded-xl border border-[#2e3146]">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Article Reader
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEO & Metadata
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
          {/* Hero Cover Image Banner */}
          {item.imageUrl ? (
            <div className="w-full h-80 sm:h-96 relative bg-[#0e0f19] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={getLocalizedTitle(item.title)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141521] via-transparent to-black/30" />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-br from-violet-950/40 via-[#141521] to-[#10111a] flex items-center justify-center text-violet-400/40">
              <Newspaper className="w-16 h-16" />
            </div>
          )}

          {/* Article Header Details */}
          <div className="px-6 sm:px-12 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold text-xs uppercase tracking-wider">
                {item.category || 'General'}
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
              <span className="px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                <span>{item.readTimeMinutes || 5} min read</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {getLocalizedTitle(item.title)}
            </h1>

            {item.shortDescription && (
              <p className="text-base sm:text-lg font-medium text-violet-200/90 leading-relaxed italic border-l-4 border-violet-500 pl-4 py-1">
                {item.shortDescription}
              </p>
            )}
          </div>

          {/* Lead Intro Callout */}
          {item.introText && (
            <div className="mx-6 sm:mx-12 p-5 bg-[#1b1c2b] border border-[#2e3146] rounded-2xl text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {item.introText}
            </div>
          )}

          {/* Main Long-form Content & Sections */}
          <div className="px-6 sm:px-12 space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-normal">
            {item.sections && item.sections.length > 0 ? (
              <div className="space-y-8">
                {item.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    {section.title && getLocalizedTitle(section.title) !== 'Main Section' && (
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-2 border-b border-[#222437]">
                        <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 text-xs font-mono flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{getLocalizedTitle(section.title)}</span>
                      </h2>
                    )}
                    <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {section.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>{item.content || 'No detailed content written for this article.'}</div>
            )}
          </div>

          {/* Featured Quote Callout Banner */}
          {item.quote && (
            <div className="mx-6 sm:mx-12 p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-[#1a1b2d] to-[#141521] border border-violet-500/30 rounded-3xl relative shadow-lg">
              <QuoteIcon className="w-12 h-12 text-violet-400/20 absolute right-6 top-6" />
              <p className="text-lg sm:text-xl font-semibold text-white italic leading-relaxed">
                "{item.quote}"
              </p>
              {item.quoteAuthor && (
                <p className="text-sm font-bold text-violet-400 mt-4 tracking-wide">
                  — {item.quoteAuthor}
                </p>
              )}
            </div>
          )}
        </article>
      ) : (
        /* SEO & TECHNICAL METADATA VIEW */
        <div className="bg-[#141521] border border-[#222437] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#222437]">
            <Globe className="w-6 h-6 text-violet-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Search Engine Optimization & Metadata</h2>
              <p className="text-xs text-slate-400">Preview search engine index cards, URL slugs, and schema graphs.</p>
            </div>
          </div>

          {/* Google Search Card Preview */}
          <div className="p-5 bg-[#0e0f19] border border-[#222437] rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google SERP Snippet Preview</span>
            <div className="space-y-1">
              <p className="text-xs text-emerald-400 font-mono">
                https://nexusmind.az/xeber/{item.slug || id}
              </p>
              <h3 className="text-base font-semibold text-indigo-400 hover:underline cursor-pointer">
                {item.metaTitle || localizedTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.metaDescription || item.shortDescription || item.introText || 'No meta description provided.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
              <span className="text-slate-400 font-semibold">Custom Slug:</span>
              <p className="text-white font-mono">{item.slug ? `/${item.slug}` : 'Default (by ID)'}</p>
            </div>
            <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
              <span className="text-slate-400 font-semibold">Estimated Read Time:</span>
              <p className="text-white font-semibold">{item.readTimeMinutes || 5} minutes</p>
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
                    className="px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-violet-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* JSON-LD Schema */}
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
