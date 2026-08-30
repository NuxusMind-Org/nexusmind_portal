import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Search, X, Video } from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { GalleryItemResponse, GalleryItemRequest } from '../../../../types/portalDtos'
import { ImageUploadInput } from '../../../../components/forms'

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItemResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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
    } catch (err) {
      console.error('Failed to delete gallery item', err)
      alert('Failed to delete gallery item.')
    }
  }

  const filteredItems = items.filter(
    (item) =>
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-emerald-400" />
            <span>Gallery Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage photo albums, clinical facility media, and promotional assets.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Asset</span>
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
            placeholder="Search gallery by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total Assets: <span className="text-white font-bold">{filteredItems.length}</span>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Gallery Grid View */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">Loading gallery items...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-xl text-center text-slate-500 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No gallery items found.</p>
          <p className="text-xs">Click "Upload Asset" above to add your first media item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const displayImage = item.thumbnailUrl || item.mediaUrl || item.imageUrl || ''
            const isVideo = item.mediaType === 'VIDEO'
            return (
              <div
                key={item.id}
                className="bg-[#141521] border border-[#222437] hover:border-[#323652] rounded-xl overflow-hidden shadow-md group flex flex-col transition-all relative"
              >
                {/* Image Preview Container */}
                <div className="aspect-[4/3] w-full bg-[#10111a] relative overflow-hidden">
                  <img
                    src={displayImage}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60'
                    }}
                  />

                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 border border-white/10">
                    {isVideo ? <Video className="w-3 h-3 text-cyan-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                    <span>{item.mediaType || 'IMAGE'}</span>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">
                      {item.title || 'Untitled Asset'}
                    </p>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider">
                    {item.category || 'TERAPIYALAR'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Gallery Item (PUT /gallery/{id})' : 'Upload Gallery Item (POST /gallery)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
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
                  placeholder="Asset title..."
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
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
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
