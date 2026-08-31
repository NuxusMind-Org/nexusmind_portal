import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  Search, 
  X, 
  Video,
  Eye,
  LayoutGrid,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Play
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { GalleryItemResponse, GalleryItemRequest } from '../../../../types/portalDtos'
import { ImageUploadInput } from '../../../../components/forms'

export default function GalleryManagement() {
  const navigate = useNavigate()
  const [items, setItems] = useState<GalleryItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'showcase' | 'manager'>('showcase')

  // Modal & Lightbox States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItemResponse | null>(null)
  const [lightboxItem, setLightboxItem] = useState<GalleryItemResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Form Fields matching exact Backend Schema
  const [title, setTitle] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [category, setCategory] = useState('')

  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await contentService.getGalleryItems()
      setItems(Array.isArray(data) ? data : (data as any)?.content || [])
    } catch (err) {
      console.error('Failed to fetch gallery items', err)
      setError('Could not load gallery items.')
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
    setMediaUrl('')
    setThumbnailUrl('')
    setMediaType('IMAGE')
    setCategory('TERAPIYALAR')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: GalleryItemResponse) => {
    setEditingItem(item)
    setTitle(item.title || '')
    setMediaUrl(item.mediaUrl || item.imageUrl || '')
    setThumbnailUrl(item.thumbnailUrl || '')
    setMediaType((item.mediaType as any) || 'IMAGE')
    setCategory(item.category || 'TERAPIYALAR')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaUrl.trim()) return

    setIsSaving(true)
    const payload: GalleryItemRequest = {
      title: title.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      mediaUrl: mediaUrl.trim(),
      imageUrl: mediaUrl.trim(),
      mediaType: mediaType,
      category: category.trim() || 'TERAPIYALAR',
    }

    try {
      if (editingItem) {
        await contentService.updateGalleryItem(editingItem.id, payload)
      } else {
        await contentService.createGalleryItem(payload)
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (err) {
      console.error('Failed to save gallery item', err)
      alert('Failed to save gallery item. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return
    try {
      await contentService.deleteGalleryItem(id)
      setItems(items.filter((item) => item.id !== id))
      if (lightboxItem && lightboxItem.id === id) {
        setLightboxItem(null)
      }
    } catch (err) {
      console.error('Failed to delete gallery item', err)
      alert('Failed to delete gallery item.')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory
    const matchesType = selectedType === 'ALL' || item.mediaType === selectedType

    return matchesSearch && matchesCat && matchesType
  })

  // Lightbox Navigation
  const currentIndex = lightboxItem ? filteredItems.findIndex((i) => i.id === lightboxItem.id) : -1

  const handlePrevLightbox = () => {
    if (currentIndex > 0) {
      setLightboxItem(filteredItems[currentIndex - 1])
    }
  }

  const handleNextLightbox = () => {
    if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
      setLightboxItem(filteredItems[currentIndex + 1])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-emerald-400" />
            <span>Gallery & Media Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Browse, preview, and manage facility photos, therapy rooms, session videos, and clinical media assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#141521] border border-[#2e3146] rounded-xl">
            <button
              onClick={() => setViewMode('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'showcase'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Media Showcase</span>
            </button>
            <button
              onClick={() => setViewMode('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'manager'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Asset Manager</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      {/* Filter & Category Bar */}
      <div className="bg-[#141521] border border-[#222437] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Categories & Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Categories */}
          <div className="flex items-center gap-1 bg-[#1b1c2b] p-1 rounded-lg border border-[#2e3146]">
            {['ALL', 'TERAPIYALAR', 'OTAQLAR', 'TELIMLER'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Media Types */}
          <div className="flex items-center gap-1 bg-[#1b1c2b] p-1 rounded-lg border border-[#2e3146]">
            {['ALL', 'IMAGE', 'VIDEO'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedType === t
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-semibold pl-2">
            Items: <span className="text-white font-bold">{filteredItems.length}</span>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Main Media Grid */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">Loading media assets...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl text-center text-slate-500 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No media assets found.</p>
          <p className="text-xs">Click "Upload Asset" above to post your first photo or video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const displayImage = item.thumbnailUrl || item.mediaUrl || item.imageUrl || ''
            const isVideo = item.mediaType === 'VIDEO'
            return (
              <div
                key={item.id}
                className="bg-[#141521] border border-[#222437] hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-md group flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] relative"
              >
                {/* Media Thumbnail Container */}
                <div 
                  onClick={() => setLightboxItem(item)}
                  className="aspect-[4/3] w-full bg-[#10111a] relative overflow-hidden cursor-pointer"
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={item.title || 'Gallery item'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[10px] font-semibold uppercase">No Media File</span>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                      {item.category || 'TERAPIYALAR'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      {isVideo ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                      <span>{item.mediaType || 'IMAGE'}</span>
                    </span>
                  </div>

                  {/* Play / Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 rounded-full bg-emerald-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      {isVideo ? <Play className="w-5 h-5 fill-white ml-0.5" /> : <Eye className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Footer Details & Action Bar */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {item.title || 'Untitled Asset'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                      {item.mediaUrl || item.imageUrl || 'No URL'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#222437]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLightboxItem(item)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => navigate(`/org/gallery/${item.id}`)}
                        className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        title="Open Dedicated Asset Page"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Page</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Asset"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* FULL LIGHTBOX VIEWER */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#141521] border border-[#2e3146] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Lightbox Header */}
            <div className="p-4 border-b border-[#222437] flex items-center justify-between bg-[#10111a]">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase">
                  {lightboxItem.category || 'TERAPIYALAR'}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {lightboxItem.title || 'Media Asset Preview'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(lightboxItem.mediaUrl || lightboxItem.imageUrl || '')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  title="Copy Media URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                </button>
                <a
                  href={lightboxItem.mediaUrl || lightboxItem.imageUrl || ''}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Open original in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Media Stage */}
            <div className="relative flex-1 bg-[#090a10] min-h-[350px] flex items-center justify-center p-4 overflow-hidden">
              {lightboxItem.mediaType === 'VIDEO' ? (
                <video
                  src={lightboxItem.mediaUrl || lightboxItem.imageUrl}
                  poster={lightboxItem.thumbnailUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[60vh] rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={lightboxItem.mediaUrl || lightboxItem.imageUrl || lightboxItem.thumbnailUrl}
                  alt={lightboxItem.title || 'Full size'}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl"
                />
              )}

              {/* Prev / Next Arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  title="Previous Asset"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {currentIndex < filteredItems.length - 1 && (
                <button
                  onClick={handleNextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  title="Next Asset"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Footer Info */}
            <div className="p-4 border-t border-[#222437] bg-[#10111a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-slate-300 font-semibold">{lightboxItem.title || 'Untitled'}</p>
                <p className="text-slate-500 font-mono text-[11px] truncate max-w-lg">
                  {lightboxItem.mediaUrl || lightboxItem.imageUrl}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = lightboxItem
                    setLightboxItem(null)
                    handleOpenEditModal(toEdit)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Asset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <span>{editingItem ? 'Edit Gallery Asset (PUT)' : 'Upload Gallery Asset (POST)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Title (title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Individual Therapy Room 102"
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Media Type (mediaType)</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IMAGE">IMAGE</option>
                    <option value="VIDEO">VIDEO</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category (category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="TERAPIYALAR">TERAPIYALAR</option>
                    <option value="OTAQLAR">OTAQLAR</option>
                    <option value="TELIMLER">TELIMLER</option>
                  </select>
                </div>
              </div>

              <ImageUploadInput
                label="Media Asset * (mediaUrl / imageUrl)"
                value={mediaUrl}
                onChange={setMediaUrl}
                folder="gallery"
                accentColor="emerald"
                required
                placeholder="https://example.com/media.jpg or upload media file"
              />

              <ImageUploadInput
                label="Thumbnail Asset (thumbnailUrl)"
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                folder="gallery"
                accentColor="emerald"
                placeholder="https://example.com/thumbnail.jpg or upload thumbnail"
              />

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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes (PUT)' : 'Save Asset (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
