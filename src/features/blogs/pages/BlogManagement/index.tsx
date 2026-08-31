import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Loader2, 
  Search, 
  X, 
  Layers, 
  Tag, 
  Globe,
  Eye,
  LayoutGrid,
  List,
  User
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { BlogResponse, BlogRequest, ContentSection } from '../../../../types/portalDtos'
import { ImageUploadInput } from '../../../../components/forms'

export default function BlogManagement() {
  const navigate = useNavigate()
  const [items, setItems] = useState<BlogResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BlogResponse | null>(null)
  const [viewingItem, setViewingItem] = useState<BlogResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form Fields matching exact Backend Schema
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [category, setCategory] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // SEO & Schema Markup Fields
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [schemaMarkup, setSchemaMarkup] = useState('')
  const [metaKeywordsInput, setMetaKeywordsInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Dynamic Sections Array
  const [sections, setSections] = useState<ContentSection[]>([{ title: 'Main Section', text: '' }])

  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await contentService.getAllBlogs()
      setItems(Array.isArray(data) ? data : (data as any)?.content || [])
    } catch (err) {
      console.error('Failed to fetch blog posts', err)
      setError('Could not load blog posts.')
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
    setCategory('General')
    setAuthorName('NexusMind Editorial')
    setImageUrl('')
    setSections([{ title: 'Main Section', text: '' }])
    setMetaTitle('')
    setMetaDescription('')
    setSlug('')
    setSchemaMarkup('')
    setMetaKeywordsInput('')
    setJsonError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: BlogResponse) => {
    setEditingItem(item)
    setTitle(item.title)
    setShortDescription(item.shortDescription || '')
    setIntroText(item.introText || '')
    setCategory(item.category || 'General')
    setAuthorName(item.authorName || 'NexusMind Editorial')
    setImageUrl(item.imageUrl || item.coverImage || '')
    setMetaTitle(item.metaTitle || '')
    setMetaDescription(item.metaDescription || '')
    setSlug(item.slug || '')
    setSchemaMarkup(item.schemaMarkup || item.schema_markup || '')
    
    const kw = item.metaKeywords || item.meta_keywords
    setMetaKeywordsInput(kw && Array.isArray(kw) ? kw.join(', ') : '')
    setJsonError(null)
    
    // Populate sections array or fallback from body
    if (item.sections && item.sections.length > 0) {
      setSections(
        item.sections.map((s) => ({
          title: s.title || '',
          text: s.text || '',
        }))
      )
    } else {
      setSections([{ title: 'Main Section', text: item.body || '' }])
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Validate JSON-LD Schema syntax if provided
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

    // Clean sections
    const cleanedSections = sections
      .filter((s) => s.text && s.text.trim().length > 0)
      .map((s) => ({ title: s.title?.trim() || 'Section', text: s.text.trim() }))

    const mainBodyFallback = cleanedSections.length > 0 
      ? cleanedSections.map((s) => s.text).join('\n\n')
      : introText.trim() || shortDescription.trim() || title.trim()

    const parsedKeywords = metaKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const payload: BlogRequest = {
      title: title.trim(),
      shortDescription: shortDescription.trim() || undefined,
      introText: introText.trim() || undefined,
      sections: cleanedSections.length > 0 ? cleanedSections : [{ title: 'Main Section', text: mainBodyFallback }],
      imageUrl: imageUrl.trim() || undefined,
      coverImage: imageUrl.trim() || undefined,
      category: category.trim() || 'General',
      authorName: authorName.trim() || 'NexusMind Editorial',
      body: mainBodyFallback,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      slug: slug.trim() || undefined,
      schemaMarkup: schemaMarkup.trim() || undefined,
      schema_markup: schemaMarkup.trim() || undefined,
      metaKeywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
      meta_keywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
    }

    try {
      if (editingItem) {
        await contentService.updateBlog(editingItem.id, payload)
      } else {
        await contentService.createBlog(payload)
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (err) {
      console.error('Failed to save blog post', err)
      alert('Failed to save blog post.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await contentService.deleteBlog(id)
      setItems(items.filter((item) => item.id !== id))
      if (viewingItem && viewingItem.id === id) {
        setViewingItem(null)
      }
    } catch (err) {
      console.error('Failed to delete blog post', err)
      alert('Failed to delete blog post.')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.authorName && item.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <FileText className="w-7 h-7 text-purple-400" />
            <span>Blog Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Publish, edit, and explore all published blog articles, thought leadership, and guides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#141521] border border-[#2e3146] rounded-xl">
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Showcase & Reader</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(168,85,247,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blog Post</span>
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
            placeholder="Search blog posts by title, author, or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total Blog Posts: <span className="text-white font-bold">{filteredItems.length}</span>
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
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-xs font-semibold">Loading blog posts...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl text-center text-slate-500 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No blog posts found.</p>
          <p className="text-xs">Click "Create Blog Post" above to write your first piece.</p>
        </div>
      ) : viewMode === 'feed' ? (
        /* LIVE BLOG FEED VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const displayImg = item.imageUrl || item.coverImage || ''
            const sectionCount = item.sections ? item.sections.length : 0

            return (
              <div
                key={item.id}
                className="bg-[#141521] border border-[#222437] hover:border-purple-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] group"
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
                      <FileText className="w-10 h-10" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">No Cover Image</span>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-purple-600/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow">
                      {item.category || 'General'}
                    </span>
                  </div>

                  {/* Author Byline */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-slate-200 text-[10px] font-medium flex items-center gap-1.5">
                    <User className="w-3 h-3 text-purple-400" />
                    <span>{item.authorName || 'NexusMind Editorial'}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.shortDescription || item.introText || item.body || 'No summary available.'}
                    </p>

                    {sectionCount > 0 && (
                      <div className="pt-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300 flex items-center gap-1 w-fit">
                          <Layers className="w-2.5 h-2.5 text-purple-400" />
                          <span>{sectionCount} Sections</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-[#222437] flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/org/blogs/${item.id}`)}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Post</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Post"
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
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222437] text-slate-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                    <td 
                      onClick={() => navigate(`/org/blogs/${item.id}`)}
                      className="py-3.5 px-4 font-bold text-white max-w-xs truncate cursor-pointer hover:text-purple-300 transition-colors"
                    >
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {item.authorName || 'NexusMind Editorial'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] uppercase tracking-wider">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {item.slug ? `/${item.slug}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.shortDescription || item.introText || item.body || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/org/blogs/${item.id}`)}
                          className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors cursor-pointer"
                          title="Open Full Blog Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Post"
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

      {/* FULL BLOG READER / DETAIL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#222437] flex items-center justify-between bg-[#10111a]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Blog Post Reader</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const toEdit = viewingItem
                    setViewingItem(null)
                    handleOpenEditModal(toEdit)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
              {(viewingItem.imageUrl || viewingItem.coverImage) && (
                <div className="w-full h-72 rounded-xl overflow-hidden bg-[#0d0e17] border border-[#222437]">
                  <img
                    src={viewingItem.imageUrl || viewingItem.coverImage}
                    alt={viewingItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs">
                  {viewingItem.category || 'General'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                  <User className="w-3 h-3 text-purple-400" />
                  <span>{viewingItem.authorName || 'NexusMind Editorial'}</span>
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
                  <p className="text-sm font-medium text-purple-300/90 leading-relaxed italic">
                    "{viewingItem.shortDescription}"
                  </p>
                )}
              </div>

              {/* Intro Text */}
              {viewingItem.introText && (
                <div className="p-4 bg-[#1b1c2b] border-l-4 border-purple-500 rounded-r-xl text-xs text-slate-300 leading-relaxed">
                  {viewingItem.introText}
                </div>
              )}

              {/* Structured Post Sections Reader */}
              {viewingItem.sections && viewingItem.sections.length > 0 ? (
                <div className="space-y-5 pt-2">
                  {viewingItem.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-1 border-b border-[#222437]">
                        <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : viewingItem.body ? (
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {viewingItem.body}
                </div>
              ) : null}

              {/* SEO & Schema Metadata */}
              {(viewingItem.metaTitle || viewingItem.metaDescription || viewingItem.schemaMarkup || viewingItem.schema_markup) && (
                <div className="pt-4 border-t border-[#222437] space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>SEO & Metadata Details</span>
                  </h4>
                  <div className="p-4 bg-[#10111a] rounded-xl border border-[#222437] space-y-2 text-xs">
                    {viewingItem.metaTitle && (
                      <p><span className="text-slate-400 font-semibold">Meta Title:</span> <span className="text-white">{viewingItem.metaTitle}</span></p>
                    )}
                    {viewingItem.metaDescription && (
                      <p><span className="text-slate-400 font-semibold">Meta Description:</span> <span className="text-white">{viewingItem.metaDescription}</span></p>
                    )}
                    {(viewingItem.schemaMarkup || viewingItem.schema_markup) && (
                      <div className="pt-2">
                        <span className="text-slate-400 font-semibold block mb-1">Schema Markup (JSON-LD):</span>
                        <pre className="p-2.5 bg-[#0a0b12] rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto border border-[#1b1c2b]">
                          {viewingItem.schemaMarkup || viewingItem.schema_markup}
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
                <FileText className="w-5 h-5 text-purple-400" />
                <span>{editingItem ? 'Edit Blog Post (PUT)' : 'Create Blog Post (POST)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Section 1: Overview */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">1. Basic Information</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Blog Title * (title)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cognitive Behavioral Insights for Stress Management"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Author Name (authorName)</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. NexusMind Editorial"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category (category)</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Therapy, Mindset, Research"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <ImageUploadInput
                  label="Blog Cover Image (imageUrl)"
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="blogs"
                  accentColor="purple"
                  placeholder="https://example.com/blog-cover.jpg or upload blog cover"
                />
              </div>

              {/* Section 2: Summary & Intro */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">2. Intro & Summary</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Short Description (shortDescription)</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief summary..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Intro Paragraph (introText)</label>
                  <textarea
                    rows={2}
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    placeholder="Introduction lead text..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Section 3: Dynamic Post Sections */}
              <div className="space-y-3 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Post Sections (sections)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Structured sections for the blog article.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {sections.map((section, idx) => (
                    <div key={idx} className="p-3.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">Section #{idx + 1}</span>
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
                        value={section.title}
                        onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                        placeholder="Section Heading..."
                        className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                      <textarea
                        rows={4}
                        required
                        value={section.text}
                        onChange={(e) => handleUpdateSection(idx, 'text', e.target.value)}
                        placeholder="Section content and body text..."
                        className="w-full px-3 py-2 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: SEO & Schema */}
              <div className="space-y-3 pt-2 border-t border-[#2e3146]">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>SEO & Schema Settings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Custom Slug (slug)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. cbt-stress-management"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Meta Title (metaTitle)</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Search engine title..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meta Description (metaDescription)</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search engine preview description..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={metaKeywordsInput}
                    onChange={(e) => setMetaKeywordsInput(e.target.value)}
                    placeholder="e.g. blog, mental health, advice"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  {previewKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {previewKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono flex items-center gap-1"
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
                    placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", "headline": "..."}'
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-emerald-400 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(168,85,247,0.3)]"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes (PUT)' : 'Publish Post (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
