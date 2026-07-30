import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../../../store/userStore'
import { contentService } from '../../../../api/services/contentService'
import type {
  XeberResponseDto,
  XeberRequestDto,
  MeqaleResponseDto,
  MeqaleRequestDto,
  BlogResponse,
  BlogRequest,
  GalleryItemResponse,
  GalleryItemRequest,
} from '../../../../types/portalDtos'
import { 
  ArrowRight,
  FileText,
  Plus,
  Newspaper,
  BookOpen,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Loader2,
  X
} from 'lucide-react'

export default function DashboardOverview() {
  const profile = useUserStore((state) => state.profile)
  const navigate = useNavigate()

  // Content State
  const [xeberList, setXeberList] = useState<XeberResponseDto[]>([])
  const [meqaleList, setMeqaleList] = useState<MeqaleResponseDto[]>([])
  const [blogList, setBlogList] = useState<BlogResponse[]>([])
  const [galleryList, setGalleryList] = useState<GalleryItemResponse[]>([])
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentTab, setContentTab] = useState<'xeber' | 'meqale' | 'blogs' | 'gallery'>('xeber')

  // Content Modal States
  const [activeModal, setActiveModal] = useState<'xeber' | 'meqale' | 'blog' | 'gallery' | null>(null)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [isSavingContent, setIsSavingContent] = useState(false)

  // Content Form Fields
  const [formTitle, setFormTitle] = useState('')
  const [formShortDesc, setFormShortDesc] = useState('')
  const [formIntroText, setFormIntroText] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formAuthor, setFormAuthor] = useState('')
  const [formQuote, setFormQuote] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formStatus, setFormStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED')
  const [formReadTime, setFormReadTime] = useState(5)
  const [formMediaType, setFormMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')

  const fetchContentData = async () => {
    setIsContentLoading(true)
    try {
      const [xeberData, meqaleData, blogData, galleryData] = await Promise.allSettled([
        contentService.getAllXeber(),
        contentService.getAllMeqale(),
        contentService.getAllBlogs(),
        contentService.getGalleryItems(),
      ])

      if (xeberData.status === 'fulfilled') {
        const val = xeberData.value
        setXeberList(Array.isArray(val) ? val : (val as any)?.content || [])
      }
      if (meqaleData.status === 'fulfilled') {
        const val = meqaleData.value
        setMeqaleList(Array.isArray(val) ? val : (val as any)?.content || [])
      }
      if (blogData.status === 'fulfilled') {
        const val = blogData.value
        setBlogList(Array.isArray(val) ? val : (val as any)?.content || [])
      }
      if (galleryData.status === 'fulfilled') {
        const val = galleryData.value
        setGalleryList(Array.isArray(val) ? val : (val as any)?.content || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard content', err)
    } finally {
      setIsContentLoading(false)
    }
  }

  useEffect(() => {
    fetchContentData()
  }, [])

  // Open Create Modals
  const handleOpenCreateXeber = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormShortDesc('')
    setFormIntroText('')
    setFormContent('')
    setFormCategory('Announcements')
    setFormQuote('')
    setFormImageUrl('')
    setFormStatus('PUBLISHED')
    setFormReadTime(5)
    setActiveModal('xeber')
  }

  const handleOpenCreateMeqale = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormShortDesc('')
    setFormIntroText('')
    setFormContent('')
    setFormAuthor('Super Admin')
    setFormCategory('Psychology')
    setFormQuote('')
    setFormImageUrl('')
    setFormStatus('PUBLISHED')
    setActiveModal('meqale')
  }

  const handleOpenCreateBlog = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormShortDesc('')
    setFormIntroText('')
    setFormContent('')
    setFormAuthor('NexusMind Editorial')
    setFormCategory('General')
    setFormImageUrl('')
    setActiveModal('blog')
  }

  const handleOpenCreateGallery = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormImageUrl('')
    setFormCategory('TERAPIYALAR')
    setFormMediaType('IMAGE')
    setActiveModal('gallery')
  }

  // Open Edit Modals
  const handleOpenEditItem = (type: 'xeber' | 'meqale' | 'blog' | 'gallery', item: any) => {
    setEditingItem(item)
    if (type === 'xeber') {
      setFormTitle(item.title)
      setFormShortDesc(item.shortDescription || '')
      setFormIntroText(item.introText || '')
      setFormContent(item.content || (item.sections && item.sections.map((s: any) => s.text).join('\n\n')) || '')
      setFormCategory(item.category || 'General')
      setFormQuote(item.quote || '')
      setFormImageUrl(item.imageUrl || '')
      setFormStatus(item.status || 'PUBLISHED')
      setFormReadTime(item.readTimeMinutes || 5)
    } else if (type === 'meqale') {
      setFormTitle(item.title)
      setFormShortDesc(item.shortDescription || '')
      setFormIntroText(item.introText || '')
      setFormContent(item.content || (item.sections && item.sections.map((s: any) => s.text).join('\n\n')) || '')
      setFormAuthor(item.author || 'Super Admin')
      setFormCategory(item.category || 'Psychology')
      setFormQuote(item.quote || '')
      setFormImageUrl(item.imageUrl || '')
      setFormStatus(item.status || 'PUBLISHED')
    } else if (type === 'blog') {
      setFormTitle(item.title)
      setFormShortDesc(item.shortDescription || '')
      setFormIntroText(item.introText || '')
      setFormContent(item.body || (item.sections && item.sections.map((s: any) => s.text).join('\n\n')) || '')
      setFormAuthor(item.authorName || 'NexusMind Editorial')
      setFormCategory(item.category || 'General')
      setFormImageUrl(item.imageUrl || item.coverImage || '')
    } else if (type === 'gallery') {
      setFormTitle(item.title || '')
      setFormImageUrl(item.mediaUrl || item.imageUrl || '')
      setFormCategory(item.category || 'TERAPIYALAR')
      setFormMediaType(item.mediaType || 'IMAGE')
    }
    setActiveModal(type)
  }

  // Delete Content Item
  const handleDeleteContentItem = async (type: 'xeber' | 'meqale' | 'blog' | 'gallery', id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      if (type === 'xeber') {
        await contentService.deleteXeber(id)
        setXeberList(xeberList.filter((i) => i.id !== id))
      } else if (type === 'meqale') {
        await contentService.deleteMeqale(id)
        setMeqaleList(meqaleList.filter((i) => i.id !== id))
      } else if (type === 'blog') {
        await contentService.deleteBlog(id)
        setBlogList(blogList.filter((i) => i.id !== id))
      } else if (type === 'gallery') {
        await contentService.deleteGalleryItem(id)
        setGalleryList(galleryList.filter((i) => i.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete item', err)
      alert('Failed to delete item.')
    }
  }

  // Save Handlers
  const handleSaveXeber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return
    setIsSavingContent(true)
    const mainText = formContent.trim() || formIntroText.trim() || formTitle.trim()
    const payload: XeberRequestDto = {
      title: formTitle.trim(),
      shortDescription: formShortDesc.trim() || undefined,
      introText: formIntroText.trim() || undefined,
      sections: mainText ? [{ title: 'Main Section', text: mainText }] : undefined,
      quote: formQuote.trim() || undefined,
      category: formCategory.trim() || 'General',
      imageUrl: formImageUrl.trim() || undefined,
      readTimeMinutes: Number(formReadTime) || 5,
      status: formStatus,
      content: mainText,
    }
    try {
      if (editingItem) {
        await contentService.updateXeber(editingItem.id, payload)
      } else {
        await contentService.createXeber(payload)
      }
      setActiveModal(null)
      fetchContentData()
    } catch (err) {
      console.error('Failed to save news', err)
      alert('Failed to save news item.')
    } finally {
      setIsSavingContent(false)
    }
  }

  const handleSaveMeqale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return
    setIsSavingContent(true)
    const mainText = formContent.trim() || formIntroText.trim() || formTitle.trim()
    const payload: MeqaleRequestDto = {
      title: formTitle.trim(),
      shortDescription: formShortDesc.trim() || undefined,
      introText: formIntroText.trim() || undefined,
      sections: mainText ? [{ title: 'Main Article', text: mainText }] : undefined,
      quote: formQuote.trim() || undefined,
      category: formCategory.trim() || 'Psychology',
      author: formAuthor.trim() || 'Super Admin',
      imageUrl: formImageUrl.trim() || undefined,
      status: formStatus,
      content: mainText,
    }
    try {
      if (editingItem) {
        await contentService.updateMeqale(editingItem.id, payload)
      } else {
        await contentService.createMeqale(payload)
      }
      setActiveModal(null)
      fetchContentData()
    } catch (err) {
      console.error('Failed to save article', err)
      alert('Failed to save article.')
    } finally {
      setIsSavingContent(false)
    }
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return
    setIsSavingContent(true)
    const mainText = formContent.trim() || formIntroText.trim() || formTitle.trim()
    const payload: BlogRequest = {
      title: formTitle.trim(),
      shortDescription: formShortDesc.trim() || undefined,
      introText: formIntroText.trim() || undefined,
      sections: mainText ? [{ title: 'Main Blog', text: mainText }] : undefined,
      category: formCategory.trim() || 'General',
      authorName: formAuthor.trim() || 'NexusMind Editorial',
      imageUrl: formImageUrl.trim() || undefined,
      coverImage: formImageUrl.trim() || undefined,
      body: mainText,
    }
    try {
      if (editingItem) {
        await contentService.updateBlog(editingItem.id, payload)
      } else {
        await contentService.createBlog(payload)
      }
      setActiveModal(null)
      fetchContentData()
    } catch (err) {
      console.error('Failed to save blog post', err)
      alert('Failed to save blog post.')
    } finally {
      setIsSavingContent(false)
    }
  }

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formImageUrl.trim()) return
    setIsSavingContent(true)
    const payload: GalleryItemRequest = {
      title: formTitle.trim() || undefined,
      mediaUrl: formImageUrl.trim(),
      imageUrl: formImageUrl.trim(),
      mediaType: formMediaType,
      category: formCategory.trim() || 'TERAPIYALAR',
    }
    try {
      if (editingItem) {
        await contentService.updateGalleryItem(editingItem.id, payload)
      } else {
        await contentService.createGalleryItem(payload)
      }
      setActiveModal(null)
      fetchContentData()
    } catch (err) {
      console.error('Failed to save gallery item', err)
      alert('Failed to save gallery item.')
    } finally {
      setIsSavingContent(false)
    }
  }

  const renderSuperAdminDashboard = () => (
    <div className="space-y-8">
      {/* Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Super Admin Overview</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Monitor platform telemetry, publish global content, and manage portal resources across all controllers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchContentData}
            className="flex items-center gap-2 py-2 px-4 bg-[#141521] hover:bg-[#1a1c2d] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Refresh Content</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: News Count */}
        <div 
          onClick={() => navigate('/org/xeber')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-violet-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-violet-600/10 text-violet-400 rounded-lg group-hover:text-white group-hover:bg-violet-600 transition-all">
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              News Controller
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total News Articles</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{xeberList.length}</h3>
          </div>
        </div>

        {/* Card 2: Articles Count */}
        <div 
          onClick={() => navigate('/org/meqale')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-indigo-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-lg group-hover:text-white group-hover:bg-indigo-600 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Article Controller
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published Articles</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{meqaleList.length}</h3>
          </div>
        </div>

        {/* Card 3: Blog Posts Count */}
        <div 
          onClick={() => navigate('/org/blogs')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-purple-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-600/10 text-purple-400 rounded-lg group-hover:text-white group-hover:bg-purple-600 transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Blog Controller
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Blog Posts</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{blogList.length}</h3>
          </div>
        </div>

        {/* Card 4: Gallery Items Count */}
        <div 
          onClick={() => navigate('/org/gallery')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-emerald-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-lg group-hover:text-white group-hover:bg-emerald-600 transition-all">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Gallery Controller
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gallery Assets</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{galleryList.length}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Super Admin Content Publishing */}
      <div className="bg-[#141521] border border-[#222437] p-6 rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content Quick Actions</h4>
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
            POST / PUT / DELETE Controls
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleOpenCreateXeber}
            className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-violet-500/40 hover:bg-violet-500/5 cursor-pointer transition-colors group"
          >
            <div className="p-2.5 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">Create News</span>
          </button>

          <button
            onClick={handleOpenCreateMeqale}
            className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer transition-colors group"
          >
            <div className="p-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">Create Article</span>
          </button>

          <button
            onClick={handleOpenCreateBlog}
            className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-purple-500/40 hover:bg-purple-500/5 cursor-pointer transition-colors group"
          >
            <div className="p-2.5 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">Create Blog</span>
          </button>

          <button
            onClick={handleOpenCreateGallery}
            className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-emerald-500/40 hover:bg-emerald-500/5 cursor-pointer transition-colors group"
          >
            <div className="p-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">Upload Asset</span>
          </button>
        </div>
      </div>

      {/* Live Content Registry Section */}
      <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222437] pb-4">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Live Content Registry</h4>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#1b1c2b] p-1 rounded-xl border border-[#222437]">
            <button
              onClick={() => setContentTab('xeber')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'xeber' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>News ({xeberList.length})</span>
            </button>

            <button
              onClick={() => setContentTab('meqale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'meqale' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles ({meqaleList.length})</span>
            </button>

            <button
              onClick={() => setContentTab('blogs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'blogs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Blogs ({blogList.length})</span>
            </button>

            <button
              onClick={() => setContentTab('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'gallery' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Gallery ({galleryList.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {isContentLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            <span className="text-xs font-semibold">Loading content items...</span>
          </div>
        ) : (
          <div>
            {/* XEBER TAB */}
            {contentTab === 'xeber' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Manage News Articles (/xeber)</span>
                  <button
                    onClick={() => navigate('/org/xeber')}
                    className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Xeber View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {xeberList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#10111a] rounded-xl">
                    No news items available. Click "+ Create News" above to publish one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Summary</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222437] text-slate-300">
                        {xeberList.map((item) => (
                          <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                            <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-[9px] uppercase tracking-wider">
                                {item.category || 'General'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                item.status === 'PUBLISHED' 
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              }`}>
                                {item.status || 'PUBLISHED'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 max-w-md truncate">
                              {item.shortDescription || item.introText || item.content || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditItem('xeber', item)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="PUT Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContentItem('xeber', item.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                  title="DELETE News"
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
            )}

            {/* MEQALE TAB */}
            {contentTab === 'meqale' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Manage Articles (/meqale)</span>
                  <button
                    onClick={() => navigate('/org/meqale')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Article View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {meqaleList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#10111a] rounded-xl">
                    No articles available. Click "+ Create Article" above to publish one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Summary</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222437] text-slate-300">
                        {meqaleList.map((item) => (
                          <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                            <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[9px] uppercase tracking-wider">
                                {item.author || 'Super Admin'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{item.category || 'Psychology'}</td>
                            <td className="py-3 px-4 text-slate-400 max-w-md truncate">
                              {item.shortDescription || item.introText || item.content || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditItem('meqale', item)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="PUT Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContentItem('meqale', item.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                  title="DELETE Article"
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
            )}

            {/* BLOGS TAB */}
            {contentTab === 'blogs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Manage Blog Posts (/blog)</span>
                  <button
                    onClick={() => navigate('/org/blogs')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Blog View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {blogList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#10111a] rounded-xl">
                    No blog posts available. Click "+ Create Blog" above to publish one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Summary</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222437] text-slate-300">
                        {blogList.map((item) => (
                          <tr key={item.id} className="hover:bg-[#191b2b] transition-colors">
                            <td className="py-3 px-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[9px] uppercase tracking-wider">
                                {item.authorName || 'NexusMind Editorial'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{item.category || 'General'}</td>
                            <td className="py-3 px-4 text-slate-400 max-w-md truncate">
                              {item.shortDescription || item.introText || item.body || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditItem('blog', item)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="PUT Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContentItem('blog', item.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                  title="DELETE Blog"
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
            )}

            {/* GALLERY TAB */}
            {contentTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Manage Gallery Items (/gallery)</span>
                  <button
                    onClick={() => navigate('/org/gallery')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Gallery View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {galleryList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#10111a] rounded-xl">
                    No gallery items available. Click "+ Upload Asset" above to add one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryList.map((item) => {
                      const displayImg = item.mediaUrl || item.thumbnailUrl || item.imageUrl || ''
                      return (
                        <div key={item.id} className="bg-[#10111a] border border-[#222437] rounded-xl p-3 space-y-2 flex flex-col justify-between">
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 relative">
                            <img
                              src={displayImg}
                              alt={item.title || 'Gallery Item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60'
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-bold text-white truncate">{item.title || 'Asset'}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditItem('gallery', item)}
                                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteContentItem('gallery', item.id)}
                                className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL HANDLERS */}
      {/* XEBER MODAL */}
      {activeModal === 'xeber' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'PUT Edit News Item (/xeber)' : 'POST Create News Item (/xeber)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveXeber} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="News title..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Category..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Short Description</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Summary..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Main Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="News text..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isSavingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save (PUT)' : 'Create (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEQALE MODAL */}
      {activeModal === 'meqale' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'PUT Edit Article (/meqale)' : 'POST Create Article (/meqale)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMeqale} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Article title..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Author</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Author..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Short Description</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Summary..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Article text..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isSavingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save (PUT)' : 'Create (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {activeModal === 'blog' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'PUT Edit Blog Post (/blog)' : 'POST Create Blog Post (/blog)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Blog Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Blog title..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Author Name</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Author..."
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Post Body *</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Blog post body..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isSavingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save (PUT)' : 'Create (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {activeModal === 'gallery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[#141521] border border-[#2e3146] rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#2e3146] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'PUT Edit Gallery Item (/gallery)' : 'POST Create Gallery Item (/gallery)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Asset title..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Media Type</label>
                  <select
                    value={formMediaType}
                    onChange={(e) => setFormMediaType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IMAGE">IMAGE</option>
                    <option value="VIDEO">VIDEO</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. TERAPIYALAR"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Media URL *</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e3146]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isSavingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save (PUT)' : 'Create (POST)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  const renderOrgAdminDashboard = () => (
    <div className="space-y-8">
      {/* Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Organization Overview</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            BPM Admin Portal - Content Management & Organization Operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/org/xeber')}
            className="flex items-center gap-2 py-2 px-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {/* Content KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/org/xeber')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-violet-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-violet-600/10 text-violet-400 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-all">
              <Newspaper className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Controller
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">News Management (Xəbər)</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{xeberList.length} Announcements</h3>
          </div>
        </div>

        <div 
          onClick={() => navigate('/org/meqale')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-indigo-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Controller
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Articles (Məqalə)</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{meqaleList.length} Articles</h3>
          </div>
        </div>

        <div 
          onClick={() => navigate('/org/blogs')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-purple-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-600/10 text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Controller
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blog Management</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{blogList.length} Blog Posts</h3>
          </div>
        </div>

        <div 
          onClick={() => navigate('/org/gallery')}
          className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-emerald-500/50 cursor-pointer transition-colors relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ImageIcon className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Controller
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gallery Management</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{galleryList.length} Gallery Photos</h3>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPsychologistDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Clinical Overview</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Psychologist Workspace & Content Catalog
        </p>
      </div>
    </div>
  )

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'platform_admin':
        return renderSuperAdminDashboard()
      case 'org_admin':
        return renderOrgAdminDashboard()
      case 'psychologist':
        return renderPsychologistDashboard()
      default:
        return renderSuperAdminDashboard()
    }
  }

  return (
    <div className="space-y-6">
      {profile?.role !== 'platform_admin' && profile?.role !== 'psychologist' && (
        <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.name || 'User'}!
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Here's an overview of the activities, schedules, and metrics under your control today.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>
        </div>
      )}

      {renderDashboard()}
    </div>
  )
}
