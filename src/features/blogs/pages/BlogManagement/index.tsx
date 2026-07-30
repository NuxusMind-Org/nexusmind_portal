import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, FileText, Loader2, Search, X, Layers, Code, Tag } from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { BlogResponse, BlogRequest, ContentSection } from '../../../../types/portalDtos'

export default function BlogManagement() {
  const [items, setItems] = useState<BlogResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BlogResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form Fields matching exact Backend Schema
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [category, setCategory] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Dynamic Sections Array
  const [sections, setSections] = useState<ContentSection[]>([{ title: 'Main Section', text: '' }])

  // SEO & Schema Markup Fields
  const [schemaMarkup, setSchemaMarkup] = useState('')
  const [metaKeywordsInput, setMetaKeywordsInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

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
    setSchemaMarkup(item.schema_markup || '')
    setMetaKeywordsInput(item.meta_keywords ? item.meta_keywords.join(', ') : '')
    setJsonError(null)
    
    // Populate sections array or fallback from body
    if (item.sections && item.sections.length > 0) {
      setSections(item.sections)
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
      schema_markup: schemaMarkup.trim() || undefined,
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
      alert('Failed to save blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await contentService.deleteBlog(id)
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to delete blog post', err)
      alert('Failed to delete blog post.')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.introText && item.introText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.body && item.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.authorName && item.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
            Create, edit, and publish blog articles for the platform portal.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(147,51,234,0.3)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#141521] border border-[#222437] p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog posts by title, author, or content..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total Posts: <span className="text-white font-bold">{filteredItems.length}</span>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Blog Table */}
      <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="text-xs font-semibold">Loading blog posts...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No blog posts found.</p>
            <p className="text-xs">Click "New Blog Post" above to publish your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222437] text-slate-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] uppercase tracking-wider">
                        {item.authorName || 'NexusMind Editorial'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.category || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.shortDescription || item.introText || (item.sections && item.sections[0]?.text) || item.body || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Blog Post"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Blog Post"
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
        )}
      </div>

      {/* Detailed Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Blog Post (PUT /blog/{id})' : 'Create Blog Post (POST /blog)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Section 1: Basic Metadata */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">1. Basic Metadata</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Blog Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter blog title..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. General, Wellness"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Image URL (imageUrl)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/blog-cover.jpg"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
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
                  <label className="text-xs font-semibold text-slate-300">Intro Text (introText)</label>
                  <textarea
                    rows={2}
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    placeholder="Blog introduction..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Section 3: Structured Content Sections */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>3. Blog Sections (sections)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {sections.map((sec, idx) => (
                  <div key={idx} className="bg-[#10111a] border border-[#222437] rounded-xl p-3.5 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Section #{idx + 1}</span>
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={sec.title || ''}
                      onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                      placeholder="Section Title..."
                      className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      rows={3}
                      value={sec.text}
                      onChange={(e) => handleUpdateSection(idx, 'text', e.target.value)}
                      placeholder="Section paragraph text..."
                      className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>

              {/* Section 4: SEO & JSON-LD Schema Markup */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>4. SEO & JSON-LD Schema Markup</span>
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>JSON-LD Schema Code (schema_markup)</span>
                    <span className="text-[10px] text-slate-500">JSON-LD format</span>
                  </label>
                  <textarea
                    rows={4}
                    value={schemaMarkup}
                    onChange={(e) => {
                      setSchemaMarkup(e.target.value)
                      setJsonError(null)
                    }}
                    placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "${title || 'Blog Title'}"\n}`}
                    className="w-full px-3.5 py-2.5 bg-[#10111a] border border-[#2e3146] rounded-xl text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  {jsonError && (
                    <p className="text-xs text-rose-400 font-semibold">{jsonError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Meta Keywords (meta_keywords)</span>
                  </label>
                  <input
                    type="text"
                    value={metaKeywordsInput}
                    onChange={(e) => setMetaKeywordsInput(e.target.value)}
                    placeholder="e.g. mental health, psychology, therapy, wellness"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Separate multiple keywords with commas.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(147,51,234,0.3)]"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? 'Save Changes (PUT)' : 'Publish Blog Post (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
