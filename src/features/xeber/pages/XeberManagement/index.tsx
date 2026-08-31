import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Newspaper, 
  Loader2, 
  Search, 
  X, 
  Tag, 
  Globe,
  Eye,
  LayoutGrid,
  List,
  Clock,
  Quote as QuoteIcon,
  CheckCircle2
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { XeberResponseDto, XeberRequestDto } from '../../../../types/portalDtos'
import { ImageUploadInput } from '../../../../components/forms'

export default function XeberManagement() {
  const navigate = useNavigate()
  const [items, setItems] = useState<XeberResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'feed'>('feed')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<XeberResponseDto | null>(null)
  const [viewingItem, setViewingItem] = useState<XeberResponseDto | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Detailed Form State
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [quote, setQuote] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [readTimeMinutes, setReadTimeMinutes] = useState(5)
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED')

  // SEO & Keywords State
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [metaKeywordsInput, setMetaKeywordsInput] = useState('')
  const [schemaMarkup, setSchemaMarkup] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await contentService.getAllXeber()
      setItems(Array.isArray(data) ? data : (data as any)?.content || [])
    } catch (err) {
      console.error('Failed to fetch news', err)
      setError('Could not load news articles.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setShortDescription('')
    setIntroText('')
    setContent('')
    setCategory('General')
    setImageUrl('')
    setQuote('')
    setQuoteAuthor('')
    setReadTimeMinutes(5)
    setStatus('PUBLISHED')
    setMetaTitle('')
    setMetaDescription('')
    setSlug('')
    setMetaKeywordsInput('')
    setSchemaMarkup('')
    setJsonError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: XeberResponseDto) => {
    setEditingItem(item)
    setTitle(item.title)
    setShortDescription(item.shortDescription || '')
    setIntroText(item.introText || '')
    setContent(item.content || (item.sections && item.sections.map((s) => s.text).join('\n\n')) || '')
    setCategory(item.category || 'General')
    setImageUrl(item.imageUrl || '')
    setQuote(item.quote || '')
    setQuoteAuthor(item.quoteAuthor || '')
    setReadTimeMinutes(item.readTimeMinutes || 5)
    setStatus((item.status as any) || 'PUBLISHED')
    setMetaTitle(item.metaTitle || '')
    setMetaDescription(item.metaDescription || '')
    setSlug(item.slug || '')
    setMetaKeywordsInput(item.metaKeywords ? item.metaKeywords.join(', ') : '')
    setSchemaMarkup(item.schemaMarkup || '')
    setJsonError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Validate JSON-LD Schema markup syntax if provided
    if (schemaMarkup.trim()) {
      try {
        JSON.parse(schemaMarkup.trim())
        setJsonError(null)
      } catch (err: any) {
        setJsonError(`Invalid JSON-LD Syntax: ${err.message}`)
        return
      }
    } else {
      setJsonError(null)
    }

    setIsSaving(true)
    const mainText = content.trim() || introText.trim() || title.trim()

    const parsedKeywords = metaKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const payload: XeberRequestDto = {
      title: title.trim(),
      shortDescription: shortDescription.trim() || undefined,
      introText: introText.trim() || undefined,
      sections: mainText ? [{ title: 'Main Section', text: mainText }] : undefined,
      quote: quote.trim() || undefined,
      quoteAuthor: quoteAuthor.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      category: category.trim() || 'General',
      readTimeMinutes: Number(readTimeMinutes) || 5,
      status: status,
      content: mainText,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      slug: slug.trim() || undefined,
      schemaMarkup: schemaMarkup.trim() || undefined,
      metaKeywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
    }

    try {
      if (editingItem) {
        await contentService.updateXeber(editingItem.id, payload)
      } else {
        await contentService.createXeber(payload)
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (err) {
      console.error('Failed to save news item', err)
      alert('Failed to save news item. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return
    try {
      await contentService.deleteXeber(id)
      setItems(items.filter((item) => item.id !== id))
      if (viewingItem && viewingItem.id === id) {
        setViewingItem(null)
      }
    } catch (err) {
      console.error('Failed to delete news item', err)
      alert('Failed to delete news item.')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.introText && item.introText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const previewKeywords = metaKeywordsInput
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-violet-400" />
            <span>News Management (Xəbərlər)</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage, publish, and view all posted organization news, press releases, and articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#141521] border border-[#2e3146] rounded-xl">
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Feed & Reader</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(124,58,237,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create News</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#141521] border border-[#222437] p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by title, category, or content..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total News Items: <span className="text-white font-bold">{filteredItems.length}</span>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <span className="text-xs font-semibold">Loading news articles...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl text-center text-slate-500 space-y-3">
          <Newspaper className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No news articles found.</p>
          <p className="text-xs">Click "Create News" above to publish your first announcement.</p>
        </div>
      ) : viewMode === 'feed' ? (
        /* LIVE NEWS FEED VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const displayImg = item.imageUrl || ''
            return (
              <div
                key={item.id}
                className="bg-[#141521] border border-[#222437] hover:border-violet-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] group"
              >
                {/* Hero / Cover Image */}
                <div className="h-48 bg-[#10111a] relative overflow-hidden flex items-center justify-center">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                      <Newspaper className="w-10 h-10" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">No Cover Image</span>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-violet-600/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow">
                      {item.category || 'General'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-500/90 text-white'
                        : item.status === 'ARCHIVED'
                        ? 'bg-slate-700/90 text-slate-200'
                        : 'bg-amber-500/90 text-white'
                    }`}>
                      {item.status || 'PUBLISHED'}
                    </span>
                  </div>

                  {/* Read Time */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-slate-300 text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" />
                    <span>{item.readTimeMinutes || 5} min read</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.shortDescription || item.introText || item.content || 'No summary available.'}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-[#222437] flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/org/xeber/${item.id}`)}
                      className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Full Article</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit News"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete News"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Read Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222437] text-slate-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                    <td 
                      onClick={() => navigate(`/org/xeber/${item.id}`)}
                      className="py-3.5 px-4 font-bold text-white max-w-xs truncate cursor-pointer hover:text-violet-300 transition-colors"
                    >
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-[10px] uppercase tracking-wider">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {item.readTimeMinutes || 5} min
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        item.status === 'PUBLISHED' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : item.status === 'ARCHIVED'
                          ? 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}>
                        {item.status || 'PUBLISHED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.shortDescription || item.introText || item.content || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/org/xeber/${item.id}`)}
                          className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors cursor-pointer"
                          title="Open Full Article Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit News"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete News"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL NEWS READER / DETAIL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#222437] flex items-center justify-between bg-[#10111a]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-violet-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">News Article Viewer</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const toEdit = viewingItem
                    setViewingItem(null)
                    handleOpenEditModal(toEdit)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Cover Image */}
              {viewingItem.imageUrl && (
                <div className="w-full h-72 rounded-xl overflow-hidden bg-[#0d0e17] border border-[#222437]">
                  <img
                    src={viewingItem.imageUrl}
                    alt={viewingItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold text-xs">
                  {viewingItem.category || 'General'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {viewingItem.status || 'PUBLISHED'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {viewingItem.readTimeMinutes || 5} min read
                </span>
                {viewingItem.slug && (
                  <span className="px-3 py-1 rounded-full bg-slate-800/60 text-slate-400 font-mono text-[11px]">
                    slug: /{viewingItem.slug}
                  </span>
                )}
              </div>

              {/* Title & Short Description */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {viewingItem.title}
                </h1>
                {viewingItem.shortDescription && (
                  <p className="text-sm font-medium text-violet-300/90 leading-relaxed italic">
                    "{viewingItem.shortDescription}"
                  </p>
                )}
              </div>

              {/* Intro Text */}
              {viewingItem.introText && (
                <div className="p-4 bg-[#1b1c2b] border-l-4 border-violet-500 rounded-r-xl text-xs text-slate-300 leading-relaxed">
                  {viewingItem.introText}
                </div>
              )}

              {/* Main Content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {viewingItem.content || (viewingItem.sections && viewingItem.sections.map((s) => s.text).join('\n\n')) || 'No detailed content provided.'}
              </div>

              {/* Featured Quote */}
              {viewingItem.quote && (
                <div className="p-5 bg-gradient-to-r from-violet-950/30 to-[#141521] border border-violet-500/30 rounded-2xl relative">
                  <QuoteIcon className="w-8 h-8 text-violet-400/20 absolute right-4 top-4" />
                  <p className="text-sm font-medium text-white italic">
                    "{viewingItem.quote}"
                  </p>
                  {viewingItem.quoteAuthor && (
                    <p className="text-xs font-bold text-violet-400 mt-2">
                      — {viewingItem.quoteAuthor}
                    </p>
                  )}
                </div>
              )}

              {/* SEO & Technical Schema Preview */}
              {(viewingItem.metaTitle || viewingItem.metaDescription || (viewingItem.metaKeywords && viewingItem.metaKeywords.length > 0) || viewingItem.schemaMarkup) && (
                <div className="pt-4 border-t border-[#222437] space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-violet-400" />
                    <span>SEO & Metadata Details</span>
                  </h4>
                  <div className="p-4 bg-[#10111a] rounded-xl border border-[#222437] space-y-2 text-xs">
                    {viewingItem.metaTitle && (
                      <p><span className="text-slate-400 font-semibold">Meta Title:</span> <span className="text-white">{viewingItem.metaTitle}</span></p>
                    )}
                    {viewingItem.metaDescription && (
                      <p><span className="text-slate-400 font-semibold">Meta Description:</span> <span className="text-white">{viewingItem.metaDescription}</span></p>
                    )}
                    {viewingItem.metaKeywords && viewingItem.metaKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-slate-400 font-semibold">Keywords:</span>
                        {viewingItem.metaKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-[10px] font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    {viewingItem.schemaMarkup && (
                      <div className="pt-2">
                        <span className="text-slate-400 font-semibold block mb-1">Schema Markup (JSON-LD):</span>
                        <pre className="p-2.5 bg-[#0a0b12] rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto border border-[#1b1c2b]">
                          {viewingItem.schemaMarkup}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit News Item (PUT)' : 'Create News Item (POST)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter news title..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Health, Announcements"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Read Time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <ImageUploadInput
                label="News Image (imageUrl)"
                value={imageUrl}
                onChange={setImageUrl}
                folder="news"
                accentColor="violet"
                placeholder="https://example.com/image.jpg or upload an image"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief summary for cards..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Intro Text</label>
                <textarea
                  rows={2}
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="Introductory paragraph..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Featured Quote</label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Quoted highlight..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Quote Author</label>
                  <input
                    type="text"
                    value={quoteAuthor}
                    onChange={(e) => setQuoteAuthor(e.target.value)}
                    placeholder="Author name..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Main Content *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full article content text..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* SEO & Metadata Section */}
              <div className="space-y-3 pt-3 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>SEO & Metadata Fields</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Custom URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. mental-health-seminar-2026"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Search engine title..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search engine preview description..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meta Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={metaKeywordsInput}
                    onChange={(e) => setMetaKeywordsInput(e.target.value)}
                    placeholder="e.g. psixologiya, təlim, seminar, sağlamlıq"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  {previewKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {previewKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Schema Markup (JSON-LD)</span>
                    <span className="text-[10px] text-slate-400 font-mono">application/ld+json</span>
                  </label>
                  <textarea
                    rows={3}
                    value={schemaMarkup}
                    onChange={(e) => setSchemaMarkup(e.target.value)}
                    placeholder='{"@context": "https://schema.org", "@type": "NewsArticle", "headline": "..."}'
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-emerald-400 font-mono placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                  {jsonError && (
                    <p className="text-[11px] text-rose-400 font-mono mt-1">{jsonError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.3)]"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes (PUT)' : 'Publish News (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
