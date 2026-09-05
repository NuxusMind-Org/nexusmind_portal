import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  Globe, 
  Tag, 
  Loader2, 
  AlertCircle, 
  Share2, 
  Check, 
  User
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { BlogResponse } from '../../../../types/portalDtos'
import { getLocalizedTitle } from '../../../../utils/multilingual'

export default function BlogPreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<BlogResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

  useEffect(() => {
    if (!id) {
      setError('No blog ID provided.')
      setIsLoading(false)
      return
    }

    const fetchBlog = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await contentService.getBlogById(id)
        if (data) {
          setItem(data)
        } else {
          setError('Blog post not found.')
        }
      } catch (err: any) {
        console.error('Failed to fetch blog post details', err)
        setError(err?.response?.data?.message || 'Failed to load blog post.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-purple-400" />
        <span className="text-sm font-semibold">Loading blog post reader...</span>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Post Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md">{error || 'The requested blog post could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/org/blogs')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs</span>
        </button>
      </div>
    )
  }

  const displayImage = item.imageUrl || item.coverImage
  const localizedTitle = getLocalizedTitle(item.title)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => navigate('/org/blogs')}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Blogs</span>
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
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Post Reader
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-purple-600 text-white shadow-xs'
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
        /* MAIN BLOG POST READER VIEW */
        <article className="bg-[#141521] border border-[#222437] rounded-3xl overflow-hidden shadow-2xl space-y-8 pb-10">
          {/* Cover Hero Image */}
          {displayImage ? (
            <div className="w-full h-80 sm:h-96 relative bg-[#0e0f19] overflow-hidden">
              <img
                src={displayImage}
                alt={localizedTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141521] via-transparent to-black/30" />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-br from-purple-950/40 via-[#141521] to-[#10111a] flex items-center justify-center text-purple-400/40">
              <FileText className="w-16 h-16" />
            </div>
          )}

          {/* Header Details */}
          <div className="px-6 sm:px-12 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs uppercase tracking-wider">
                {item.category || 'General'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>{item.authorName || 'NexusMind Editorial'}</span>
              </span>
              {item.slug && (
                <span className="px-3.5 py-1 rounded-full bg-slate-800/60 text-slate-400 font-mono text-xs">
                  slug: /{item.slug}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {localizedTitle}
            </h1>

            {item.shortDescription && (
              <p className="text-base sm:text-lg font-medium text-purple-200/90 leading-relaxed italic border-l-4 border-purple-500 pl-4 py-1">
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

          {/* Multi-Section Long-Form Post Body */}
          <div className="px-6 sm:px-12 space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {item.sections && item.sections.length > 0 ? (
              <div className="space-y-8">
                {item.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 pb-2 border-b border-[#222437]">
                      <span className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-400 text-xs font-mono flex items-center justify-center shrink-0">
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
              <div className="whitespace-pre-line">{item.body || 'No detailed content available.'}</div>
            )}
          </div>
        </article>
      ) : (
        /* SEO & TECHNICAL SCHEMA VIEW */
        <div className="bg-[#141521] border border-[#222437] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#222437]">
            <Globe className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Blog Post SEO & Schema Settings</h2>
              <p className="text-xs text-slate-400">Search keywords, URL canonicalization, and JSON-LD schema metadata.</p>
            </div>
          </div>

          <div className="p-5 bg-[#0e0f19] border border-[#222437] rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google SERP Snippet Preview</span>
            <div className="space-y-1">
              <p className="text-xs text-emerald-400 font-mono">
                https://nexusmind.az/blogs/{item.slug || id}
              </p>
              <h3 className="text-base font-semibold text-purple-400 hover:underline cursor-pointer">
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
              <span className="text-slate-400 font-semibold">Author Credits:</span>
              <p className="text-white font-semibold">{item.authorName || 'NexusMind Editorial'}</p>
            </div>
          </div>

          {/* Keywords */}
          {((item.metaKeywords && item.metaKeywords.length > 0) || (item.meta_keywords && item.meta_keywords.length > 0)) && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Indexed Search Keywords:</span>
              <div className="flex flex-wrap gap-2">
                {(item.metaKeywords || item.meta_keywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-purple-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schema JSON-LD */}
          {(item.schemaMarkup || item.schema_markup) && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Structured Data Graph (JSON-LD):</span>
              <pre className="p-4 bg-[#0a0b12] rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-[#222437]">
                {item.schemaMarkup || item.schema_markup}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
