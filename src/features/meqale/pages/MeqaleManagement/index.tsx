import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Loader2, 
  Search, 
  X, 
  Sparkles, 
  Layers, 
  Tag, 
  Globe,
  Eye,
  LayoutGrid,
  List,
  Quote as QuoteIcon,
  CheckCircle2,
  User
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { MeqaleResponseDto, MeqaleRequestDto, HighlightCard, ContentSection, TitleDto } from '../../../../types/portalDtos'
import { ImageUploadInput, MultilingualContentInput } from '../../../../components/forms'
import {
  getLocalizedTitle,
  createEmptyTitleDto,
  createEmptyMultilingualContent,
  normalizeTitleDto,
  type MultilingualContent
} from '../../../../utils/multilingual'

export default function MeqaleManagement() {
  const navigate = useNavigate()
  const [items, setItems] = useState<MeqaleResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MeqaleResponseDto | null>(null)
  const [viewingItem, setViewingItem] = useState<MeqaleResponseDto | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form Fields matching exact Backend Schema
  const [titles, setTitles] = useState<TitleDto>(createEmptyTitleDto())
  const [contents, setContents] = useState<MultilingualContent>(createEmptyMultilingualContent())
  const [shortDescription, setShortDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [quote, setQuote] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [doctorId, setDoctorId] = useState<number | string>('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED')
  const [author, setAuthor] = useState('')

  // SEO & Keywords State
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [metaKeywordsInput, setMetaKeywordsInput] = useState('')
  const [schemaMarkup, setSchemaMarkup] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Structured Sections & Highlight Cards Arrays
  const [sections, setSections] = useState<ContentSection[]>([{ title: 'Main Section', text: '' }])
  const [highlightCards, setHighlightCards] = useState<HighlightCard[]>([])

  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await contentService.getAllMeqale()
      setItems(Array.isArray(data) ? data : (data as any)?.content || [])
    } catch (err) {
      console.error('Failed to fetch articles', err)
      setError('Could not load articles.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setTitles(createEmptyTitleDto())
    setContents(createEmptyMultilingualContent())
    setShortDescription('')
    setIntroText('')
    setQuote('')
    setImageUrl('')
    setCategory('Psychology')
    setDoctorId('')
    setStatus('PUBLISHED')
    setAuthor('BPM Editorial')
    setSections([{ title: 'Main Section', text: '' }])
    setHighlightCards([])
    setMetaTitle('')
    setMetaDescription('')
    setSlug('')
    setMetaKeywordsInput('')
    setSchemaMarkup('')
    setJsonError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: MeqaleResponseDto) => {
    setEditingItem(item)
    setTitles(normalizeTitleDto(item.titleDto || item.title))
    const firstSectionText = item.sections && item.sections.length > 0 ? item.sections[0].text : ''
    setContents({
      az: item.content || firstSectionText || '',
      en: (item.sections && item.sections.length > 1 ? item.sections[1].text : '') || '',
      ru: (item.sections && item.sections.length > 2 ? item.sections[2].text : '') || ''
    })
    setShortDescription(item.shortDescription || '')
    setIntroText(item.introText || '')
    setQuote(item.quote || '')
    setImageUrl(item.imageUrl || '')
    setCategory(item.category || 'Psychology')
    setDoctorId(item.doctorId || '')
    setStatus((item.status as any) || 'PUBLISHED')
    setAuthor(item.author || 'BPM Editorial')
    setMetaTitle(item.metaTitle || '')
    setMetaDescription(item.metaDescription || '')
    setSlug(item.slug || '')
    setMetaKeywordsInput(item.metaKeywords ? item.metaKeywords.join(', ') : '')
    setSchemaMarkup(item.schemaMarkup || '')
    setJsonError(null)
    
    // Populate sections array or fallback from content
    if (item.sections && item.sections.length > 0) {
      setSections(
        item.sections.map((s) => ({
          title: typeof s.title === 'object' ? getLocalizedTitle(s.title) : s.title || '',
          text: s.text || '',
        }))
      )
    } else {
      setSections([{ title: 'Main Section', text: item.content || '' }])
    }

    // Populate highlight cards
    if (item.highlightCards && item.highlightCards.length > 0) {
      setHighlightCards(
        item.highlightCards.map((c) => ({
          icon: c.icon || 'Sparkles',
          title: c.title || '',
          text: c.text || '',
        }))
      )
    } else {
      setHighlightCards([])
    }
    setIsModalOpen(true)
  }

  // Section Handlers
  const handleAddSection = () => {
    setSections([...sections, { title: '', text: '' }])
  }

  const handleUpdateSection = (index: number, field: keyof ContentSection, val: string) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: val }
    setSections(updated)
  }

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  // Highlight Card Handlers
  const handleAddHighlightCard = () => {
    setHighlightCards([...highlightCards, { icon: 'Sparkles', title: '', text: '' }])
  }

  const handleUpdateHighlightCard = (index: number, field: keyof HighlightCard, val: string) => {
    const updated = [...highlightCards]
    updated[index] = { ...updated[index], [field]: val }
    setHighlightCards(updated)
  }

  const handleRemoveHighlightCard = (index: number) => {
    setHighlightCards(highlightCards.filter((_, i) => i !== index))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titles.az.trim() && !titles.en.trim() && !titles.ru.trim()) return

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

    const primaryTitle = titles.az.trim() || titles.en.trim() || titles.ru.trim() || 'Article Title'
    const completeTitle: TitleDto = {
      az: titles.az.trim() || primaryTitle,
      en: titles.en.trim() || primaryTitle,
      ru: titles.ru.trim() || primaryTitle
    }

    // Filter out empty sections & cards
    const cleanedSections = sections
      .filter((s) => s.text && s.text.trim().length > 0)
      .map((s) => ({
        title: typeof s.title === 'object' ? s.title : { az: s.title || primaryTitle, en: s.title || primaryTitle, ru: s.title || primaryTitle },
        text: s.text.trim()
      }))

    // Add multilingual content sections if provided
    if (contents.en.trim()) {
      cleanedSections.push({
        title: { ...completeTitle, az: `${completeTitle.az} (EN)` },
        text: contents.en.trim()
      })
    }
    if (contents.ru.trim()) {
      cleanedSections.push({
        title: { ...completeTitle, az: `${completeTitle.az} (RU)` },
        text: contents.ru.trim()
      })
    }

    const cleanedCards = highlightCards
      .filter((c) => c.title && c.title.trim().length > 0)
      .map((c) => ({ icon: c.icon?.trim() || 'Sparkles', title: c.title.trim(), text: c.text?.trim() || '' }))

    const mainContentFallback = contents.az.trim() || (cleanedSections.length > 0 ? cleanedSections[0].text : '') || introText.trim() || shortDescription.trim() || primaryTitle

    const parsedKeywords = metaKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const payload: MeqaleRequestDto = {
      title: completeTitle,
      shortDescription: shortDescription.trim() || undefined,
      introText: introText.trim() || undefined,
      quote: quote.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      category: category.trim() || 'Psychology',
      author: author.trim() || 'BPM Editorial',
      doctorId: doctorId !== '' ? Number(doctorId) : undefined,
      status: status,
      sections: cleanedSections.length > 0 ? cleanedSections : [{ title: completeTitle, text: mainContentFallback }],
      highlightCards: cleanedCards.length > 0 ? cleanedCards : undefined,
      content: mainContentFallback,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      slug: slug.trim() || undefined,
      schemaMarkup: schemaMarkup.trim() || undefined,
      metaKeywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
    }

    try {
      if (editingItem) {
        await contentService.updateMeqale(editingItem.id, payload)
      } else {
        await contentService.createMeqale(payload)
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (err) {
      console.error('Failed to save article', err)
      alert('Failed to save article. Please check all fields.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await contentService.deleteMeqale(id)
      setItems(items.filter((item) => item.id !== id))
      if (viewingItem && viewingItem.id === id) {
        setViewingItem(null)
      }
    } catch (err) {
      console.error('Failed to delete article', err)
      alert('Failed to delete article.')
    }
  }

  const filteredItems = items.filter((item) => {
    const rawTitle = item.titleDto || item.title
    const localizedTitle = getLocalizedTitle(rawTitle)
    const allTitles = typeof rawTitle === 'object' && rawTitle !== null
      ? `${rawTitle.az || ''} ${rawTitle.en || ''} ${rawTitle.ru || ''}`
      : rawTitle || ''
    const q = searchQuery.toLowerCase()
    return (
      localizedTitle.toLowerCase().includes(q) ||
      allTitles.toLowerCase().includes(q) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(q)) ||
      (item.introText && item.introText.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    )
  })

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
            <BookOpen className="w-7 h-7 text-indigo-400" />
            <span>Article Management (Məqalələr)</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage, publish, and view in-depth articles, highlight takeaways, and clinical psychology pieces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#141521] border border-[#2e3146] rounded-xl">
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-indigo-600 text-white shadow-sm'
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
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
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
            placeholder="Search articles by title, author, category, or summary..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total Articles: <span className="text-white font-bold">{filteredItems.length}</span>
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
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs font-semibold">Loading articles...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl text-center text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No articles found.</p>
          <p className="text-xs">Click "Create Article" above to draft your first piece.</p>
        </div>
      ) : viewMode === 'feed' ? (
        /* LIVE ARTICLES FEED VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const displayImg = item.imageUrl || ''
            const sectionCount = item.sections ? item.sections.length : 0
            const cardCount = item.highlightCards ? item.highlightCards.length : 0

            return (
              <div
                key={item.id}
                className="bg-[#141521] border border-[#222437] hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] group"
              >
                {/* Hero / Cover Image */}
                <div className="h-48 bg-[#10111a] relative overflow-hidden flex items-center justify-center">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={getLocalizedTitle(item.titleDto || item.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                      <BookOpen className="w-10 h-10" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">No Cover Image</span>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow">
                      {item.category || 'Psychology'}
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

                  {/* Author / Doctor */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-slate-200 text-[10px] font-medium flex items-center gap-1.5">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span>{item.author || 'BPM Editorial'}</span>
                  </div>
                </div>

                {/* Card Header & Title */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {getLocalizedTitle(item.titleDto || item.title)}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.shortDescription || item.introText || item.content || 'No summary available.'}
                    </p>

                    {/* Section / Highlights Indicators */}
                    <div className="flex items-center gap-2 pt-2">
                      {sectionCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300 flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{sectionCount} Sections</span>
                        </span>
                      )}
                      {cardCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[10px] font-medium text-indigo-300 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{cardCount} Key Points</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-[#222437] flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/org/meqale/${item.id}`)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Full Article</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Article"
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
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sections</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222437] text-slate-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                    <td 
                      onClick={() => navigate(`/org/meqale/${item.id}`)}
                      className="px-5 py-4 font-medium text-white max-w-xs truncate cursor-pointer hover:text-indigo-300 transition-colors"
                    >
                      {getLocalizedTitle(item.titleDto || item.title)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {item.author || 'BPM Editorial'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                        {item.category || 'Psychology'}
                      </span>
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
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.sections ? `${item.sections.length} sections` : 'Single'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/org/meqale/${item.id}`)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors cursor-pointer"
                          title="Open Full Article Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Article"
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

      {/* FULL ARTICLE READER / DETAIL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#222437] flex items-center justify-between bg-[#10111a]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Article Reader</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const toEdit = viewingItem
                    setViewingItem(null)
                    handleOpenEditModal(toEdit)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
                    alt={getLocalizedTitle(viewingItem.titleDto || viewingItem.title)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                  {viewingItem.category || 'Psychology'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {viewingItem.status || 'PUBLISHED'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                  <User className="w-3 h-3 text-indigo-400" />
                  <span>{viewingItem.author || 'BPM Editorial'}</span>
                </span>
                {viewingItem.doctorId && (
                  <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                    Doctor ID: #{viewingItem.doctorId}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {getLocalizedTitle(viewingItem.titleDto || viewingItem.title)}
                </h1>
                {viewingItem.shortDescription && (
                  <p className="text-sm font-medium text-indigo-300/90 leading-relaxed italic">
                    "{viewingItem.shortDescription}"
                  </p>
                )}
              </div>

              {/* Intro Text */}
              {viewingItem.introText && (
                <div className="p-4 bg-[#1b1c2b] border-l-4 border-indigo-500 rounded-r-xl text-xs text-slate-300 leading-relaxed">
                  {viewingItem.introText}
                </div>
              )}

              {/* Highlight Cards Grid (if present) */}
              {viewingItem.highlightCards && viewingItem.highlightCards.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Highlights & Takeaways</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewingItem.highlightCards.map((card, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/20 to-[#1b1c2b] border border-indigo-500/20 space-y-1.5"
                      >
                        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                          <span>{card.title}</span>
                        </div>
                        {card.text && (
                          <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured Sections Reader */}
              {viewingItem.sections && viewingItem.sections.length > 0 ? (
                <div className="space-y-5 pt-2">
                  {viewingItem.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-1 border-b border-[#222437]">
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{typeof section.title === 'object' ? getLocalizedTitle(section.title) : section.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : viewingItem.content ? (
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {viewingItem.content}
                </div>
              ) : null}

              {/* Featured Quote */}
              {viewingItem.quote && (
                <div className="p-5 bg-gradient-to-r from-indigo-950/30 to-[#141521] border border-indigo-500/30 rounded-2xl relative">
                  <QuoteIcon className="w-8 h-8 text-indigo-400/20 absolute right-4 top-4" />
                  <p className="text-sm font-medium text-white italic">
                    "{viewingItem.quote}"
                  </p>
                </div>
              )}

              {/* SEO & Technical Schema Preview */}
              {((viewingItem.metaKeywords && viewingItem.metaKeywords.length > 0) || viewingItem.schemaMarkup) && (
                <div className="pt-4 border-t border-[#222437] space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>SEO & Metadata Details</span>
                  </h4>
                  <div className="p-4 bg-[#10111a] rounded-xl border border-[#222437] space-y-2 text-xs">
                    {viewingItem.metaKeywords && viewingItem.metaKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-400 font-semibold">Keywords:</span>
                        {viewingItem.metaKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono">
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
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>{editingItem ? 'Edit Article (PUT)' : 'Create Article (POST)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Section 1: Core Multilingual Fields */}
              <div className="space-y-4">
                <MultilingualContentInput
                  title={titles}
                  onTitleChange={setTitles}
                  content={contents}
                  onContentChange={setContents}
                  accentColor="indigo"
                  contentRows={4}
                  requiredLanguages={['az']}
                  titleLabel="Article Title"
                  contentLabel="Primary Article Content"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category (category)</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Psychology, Therapy, Well-being"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Author (author)</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Dr. Jane Smith or BPM Editorial"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Status (status)</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                <ImageUploadInput
                  label="Cover Image (imageUrl)"
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="articles"
                  accentColor="indigo"
                  placeholder="https://example.com/article-cover.jpg or upload cover image"
                />
              </div>

              {/* Section 2: Summary & Quotes */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">2. Intro & Featured Quote</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Short Description (shortDescription)</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief summary for card previews..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Intro Paragraph (introText)</label>
                  <textarea
                    rows={2}
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    placeholder="Lead in paragraph for the article header..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Key Takeaway Quote (quote)</label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Inspirational or clinical takeaway..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Section 3: Highlight Cards */}
              <div className="space-y-3 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Highlight Cards (highlightCards)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Add highlight bullet boxes with title and text.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHighlightCard}
                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Card</span>
                  </button>
                </div>

                {highlightCards.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No highlight cards added. Click "Add Card" to create key takeaway callouts.</p>
                ) : (
                  <div className="space-y-3">
                    {highlightCards.map((card, idx) => (
                      <div key={idx} className="p-3 bg-[#1b1c2b] border border-[#2e3146] rounded-xl space-y-2 relative group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">Card #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlightCard(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => handleUpdateHighlightCard(idx, 'title', e.target.value)}
                            placeholder="Card Title..."
                            className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={card.icon || 'Sparkles'}
                            onChange={(e) => handleUpdateHighlightCard(idx, 'icon', e.target.value)}
                            placeholder="Icon Name (e.g. Sparkles, Brain, Heart)"
                            className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={card.text}
                          onChange={(e) => handleUpdateHighlightCard(idx, 'text', e.target.value)}
                          placeholder="Card description or tips..."
                          className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Article Sections */}
              <div className="space-y-3 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Article Sections (sections)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Structured paragraphs with section titles.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {sections.map((section, idx) => (
                    <div key={idx} className="p-3.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">Section #{idx + 1}</span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={typeof section.title === 'string' ? section.title : getLocalizedTitle(section.title)}
                        onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                        placeholder="Section Heading / Title..."
                        className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <textarea
                        rows={4}
                        required
                        value={section.text}
                        onChange={(e) => handleUpdateSection(idx, 'text', e.target.value)}
                        placeholder="Section content and body text..."
                        className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: SEO Metadata */}
              <div className="space-y-3 pt-2 border-t border-[#2e3146]">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>SEO & Discoverability Metadata</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Custom URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. anxiety-modern-life"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="SEO Title..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="SEO Description..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meta Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={metaKeywordsInput}
                    onChange={(e) => setMetaKeywordsInput(e.target.value)}
                    placeholder="e.g. psixologiya, terapiya, mental health"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  {previewKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {previewKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono flex items-center gap-1"
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
                    placeholder='{"@context": "https://schema.org", "@type": "Article", "headline": "..."}'
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-emerald-400 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes (PUT)' : 'Publish Article (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
