import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, BookOpen, Loader2, Search, X, Sparkles, Layers } from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { MeqaleResponseDto, MeqaleRequestDto, HighlightCard, ContentSection } from '../../../../types/portalDtos'

export default function MeqaleManagement() {
  const [items, setItems] = useState<MeqaleResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MeqaleResponseDto | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form Fields matching exact Backend Schema
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [quote, setQuote] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [doctorId, setDoctorId] = useState<number | string>('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED')
  const [author, setAuthor] = useState('')

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
    setTitle('')
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
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: MeqaleResponseDto) => {
    setEditingItem(item)
    setTitle(item.title)
    setShortDescription(item.shortDescription || '')
    setIntroText(item.introText || '')
    setQuote(item.quote || '')
    setImageUrl(item.imageUrl || '')
    setCategory(item.category || 'Psychology')
    setDoctorId(item.doctorId || '')
    setStatus((item.status as any) || 'PUBLISHED')
    setAuthor(item.author || 'BPM Editorial')
    
    // Populate sections array or fallback from content
    if (item.sections && item.sections.length > 0) {
      setSections(item.sections)
    } else {
      setSections([{ title: 'Main Section', text: item.content || '' }])
    }

    // Populate highlight cards
    setHighlightCards(item.highlightCards || [])
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
    if (!title.trim()) return

    setIsSaving(true)

    // Filter out empty sections & cards
    const cleanedSections = sections
      .filter((s) => s.text && s.text.trim().length > 0)
      .map((s) => ({ title: s.title?.trim() || 'Section', text: s.text.trim() }))

    const cleanedCards = highlightCards
      .filter((c) => c.title && c.title.trim().length > 0)
      .map((c) => ({ icon: c.icon?.trim() || 'Sparkles', title: c.title.trim(), text: c.text?.trim() || '' }))

    const mainContentFallback = cleanedSections.length > 0 
      ? cleanedSections.map((s) => s.text).join('\n\n')
      : introText.trim() || shortDescription.trim() || title.trim()

    const payload: MeqaleRequestDto = {
      title: title.trim(),
      shortDescription: shortDescription.trim() || undefined,
      introText: introText.trim() || undefined,
      sections: cleanedSections.length > 0 ? cleanedSections : [{ title: 'Main Section', text: mainContentFallback }],
      quote: quote.trim() || undefined,
      highlightCards: cleanedCards.length > 0 ? cleanedCards : undefined,
      imageUrl: imageUrl.trim() || undefined,
      category: category.trim() || 'Psychology',
      doctorId: doctorId ? Number(doctorId) : undefined,
      status: status,
      author: author.trim() || 'BPM Editorial',
      content: mainContentFallback,
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
      alert('Failed to save article. Please verify inputs and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await contentService.deleteMeqale(id)
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to delete article', err)
      alert('Failed to delete article.')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.introText && item.introText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            <span>Articles Management (Məqalələr)</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Publish educational materials, scientific research, and clinical articles.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
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
            placeholder="Search articles by title, author, or content..."
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

      {/* Articles Table */}
      <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="text-xs font-semibold">Loading articles...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No articles found.</p>
            <p className="text-xs">Click "Create Article" above to publish your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Doctor ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
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
                      {item.doctorId ? (
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                          ID: {item.doctorId}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Unassigned</span>
                      )}
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
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}>
                        {item.status || 'PUBLISHED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.shortDescription || item.introText || (item.sections && item.sections[0]?.text) || item.content || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
        )}
      </div>

      {/* Detailed Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Article (PUT /meqale/{id})' : 'Publish Article (POST /meqale)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">1. Basic Metadata</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Article title..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Clinical, Therapy"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Doctor ID (doctorId)</label>
                    <input
                      type="number"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      placeholder="e.g. 9007199254740991"
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Author Name</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name..."
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Cover Image URL (imageUrl)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/article-cover.jpg"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  <label className="text-xs font-semibold text-slate-300">Intro Text (introText)</label>
                  <textarea
                    rows={2}
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    placeholder="Lead introductory paragraph..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Quote (quote)</label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Featured quote text..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Section 3: Structured Content Sections */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>3. Article Sections (sections)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
                      className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      rows={3}
                      value={sec.text}
                      onChange={(e) => handleUpdateSection(idx, 'text', e.target.value)}
                      placeholder="Section paragraph text..."
                      className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {/* Section 4: Highlight Cards */}
              <div className="space-y-4 pt-2 border-t border-[#2e3146]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>4. Highlight Cards (highlightCards)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddHighlightCard}
                    className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight Card</span>
                  </button>
                </div>

                {highlightCards.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-[#10111a] p-3 rounded-xl">
                    No highlight cards added. Click "+ Add Highlight Card" above if you want to feature takeaway cards.
                  </p>
                ) : (
                  highlightCards.map((card, idx) => (
                    <div key={idx} className="bg-[#10111a] border border-[#222437] rounded-xl p-3.5 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlightCard(idx)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={card.icon || ''}
                          onChange={(e) => handleUpdateHighlightCard(idx, 'icon', e.target.value)}
                          placeholder="Icon Name (e.g. Brain, Heart)"
                          className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateHighlightCard(idx, 'title', e.target.value)}
                          placeholder="Card Title..."
                          className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={card.text}
                        onChange={(e) => handleUpdateHighlightCard(idx, 'text', e.target.value)}
                        placeholder="Card highlight text..."
                        className="w-full px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))
                )}
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
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
