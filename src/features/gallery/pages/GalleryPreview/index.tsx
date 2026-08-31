import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Video, 
  Loader2, 
  AlertCircle, 
  Check, 
  Copy, 
  ExternalLink
} from 'lucide-react'
import { contentService } from '../../../../api/services/contentService'
import type { GalleryItemResponse } from '../../../../types/portalDtos'

export default function GalleryPreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<GalleryItemResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('No asset ID provided.')
      setIsLoading(false)
      return
    }

    const fetchItem = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch all gallery items and find by ID
        const items = await contentService.getGalleryItems()
        const found = items.find((i) => String(i.id) === String(id))
        if (found) {
          setItem(found)
        } else {
          setError('Gallery asset not found.')
        }
      } catch (err: any) {
        console.error('Failed to fetch gallery asset details', err)
        setError(err?.response?.data?.message || 'Failed to load gallery asset.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleCopyLink = () => {
    const url = item?.mediaUrl || item?.imageUrl || window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-emerald-400" />
        <span className="text-sm font-semibold">Loading gallery asset preview...</span>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Asset Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md">{error || 'The requested media item could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/org/gallery')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gallery</span>
        </button>
      </div>
    )
  }

  const isVideo = item.mediaType === 'VIDEO'
  const mediaUrl = item.mediaUrl || item.imageUrl

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => navigate('/org/gallery')}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Gallery</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-xs sm:max-w-md font-medium">
            {item.title || 'Untitled Asset'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Copy Media URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Direct URL'}</span>
          </button>

          {mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Original</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="bg-[#141521] border border-[#222437] rounded-3xl overflow-hidden shadow-2xl space-y-6">
        {/* Media Stage */}
        <div className="bg-[#090a10] min-h-[400px] flex items-center justify-center p-6 border-b border-[#222437]">
          {isVideo && mediaUrl ? (
            <video
              src={mediaUrl}
              poster={item.thumbnailUrl}
              controls
              autoPlay
              className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl"
            />
          ) : mediaUrl ? (
            <img
              src={mediaUrl}
              alt={item.title || 'Full size media'}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="p-16 text-center text-slate-600 space-y-2">
              <ImageIcon className="w-16 h-16 mx-auto" />
              <p className="text-sm font-semibold">No media source available</p>
            </div>
          )}
        </div>

        {/* Details & Metadata */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              {item.category || 'TERAPIYALAR'}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              {isVideo ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{item.mediaType || 'IMAGE'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {item.title || 'Untitled Gallery Media Asset'}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
              <span className="text-slate-400 font-semibold">Media File URL:</span>
              <p className="text-emerald-400 font-mono break-all">{mediaUrl || 'N/A'}</p>
            </div>
            {item.thumbnailUrl && (
              <div className="p-4 bg-[#1b1c2b] rounded-xl border border-[#2e3146] space-y-1">
                <span className="text-slate-400 font-semibold">Thumbnail URL:</span>
                <p className="text-slate-300 font-mono break-all">{item.thumbnailUrl}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
