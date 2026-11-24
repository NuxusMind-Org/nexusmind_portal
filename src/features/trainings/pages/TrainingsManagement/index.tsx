import { useState, useEffect, useCallback } from 'react'
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  List,
  MapPin,
  Clock,
  Tag,
  Radio,
  Loader2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import dayjs from 'dayjs'
import { trainingService } from '../../../../api/services/trainingService'
import type {
  TrainingRequest,
  TrainingResponse,
  TrainingTypeCountResponse,
  LocalTime,
} from '../../../../types/portalDtos'
import { ImageUploadInput } from '../../../../components/forms'

const getTrainingTypeLabel = (type?: string) => {
  switch (type) {
    case 'ONLINE':
      return 'Onlayn'
    case 'IN_PERSON':
      return 'Əyani'
    default:
      return type || 'Onlayn'
  }
}

function formatLocalTime(time?: LocalTime | string): string {
  if (!time) return '10:00'
  if (typeof time === 'string') return time.slice(0, 5)
  const hh = String(time.hour ?? 0).padStart(2, '0')
  const mm = String(time.minute ?? 0).padStart(2, '0')
  return `${hh}:${mm}`
}

function parseTimeToLocalTime(timeStr: string): LocalTime {
  const [h = '10', m = '00'] = timeStr.split(':')
  return {
    hour: Number(h) || 0,
    minute: Number(m) || 0,
    second: 0,
    nano: 0,
  }
}

export default function TrainingsManagement() {
  const [trainings, setTrainings] = useState<TrainingResponse[]>([])
  const [typeCounts, setTypeCounts] = useState<TrainingTypeCountResponse[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & view
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [typeFilter, setTypeFilter] = useState<'' | 'ONLINE' | 'IN_PERSON'>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Calendar state
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1)
  const [calendarItems, setCalendarItems] = useState<TrainingResponse[]>([])

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TrainingResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields (exact TrainingRequest schema)
  const [title, setTitle] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [type, setType] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE')
  const [trainingDate, setTrainingDate] = useState('')
  const [trainingTime, setTrainingTime] = useState('14:00')
  const [location, setLocation] = useState('')
  const [priceAzn, setPriceAzn] = useState<string>('0')
  const [imageUrl, setImageUrl] = useState('')
  const [live, setLive] = useState(false)

  const fetchListAndMeta = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [pageRes, countsRes, tagsRes] = await Promise.allSettled([
        trainingService.searchTrainings({
          type: typeFilter || undefined,
          search: search.trim() || undefined,
          page,
          size: 12,
        }),
        trainingService.getTypeCounts(),
        trainingService.getPopularTags(10),
      ])

      if (pageRes.status === 'fulfilled') {
        const p = pageRes.value
        setTrainings(Array.isArray(p?.content) ? p.content : Array.isArray(p) ? (p as unknown as TrainingResponse[]) : [])
        setTotalPages(Math.max(1, p?.totalPages || 1))
      } else {
        setError('Təlimləri yükləmək mümkün olmadı.')
      }

      if (countsRes.status === 'fulfilled') setTypeCounts(countsRes.value)
      if (tagsRes.status === 'fulfilled') setPopularTags(tagsRes.value)
    } catch {
      setError('Təlimləri yükləmək mümkün olmadı.')
    } finally {
      setIsLoading(false)
    }
  }, [typeFilter, search, page])

  const fetchCalendar = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const items = await trainingService.getMonthCalendar(calYear, calMonth)
      setCalendarItems(items)
    } catch {
      setError('Aylıq təlim təqvimini yükləmək mümkün olmadı.')
    } finally {
      setIsLoading(false)
    }
  }, [calYear, calMonth])

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        if (viewMode === 'list') {
          const [pageRes, countsRes, tagsRes] = await Promise.allSettled([
            trainingService.searchTrainings({
              type: typeFilter || undefined,
              search: search.trim() || undefined,
              page,
              size: 12,
            }),
            trainingService.getTypeCounts(),
            trainingService.getPopularTags(10),
          ])
          if (!active) return
          if (pageRes.status === 'fulfilled') {
            const p = pageRes.value
            setTrainings(Array.isArray(p?.content) ? p.content : Array.isArray(p) ? (p as unknown as TrainingResponse[]) : [])
            setTotalPages(Math.max(1, p?.totalPages || 1))
            setError(null)
          } else {
            setError('Təlimləri yükləmək mümkün olmadı.')
          }
          if (countsRes.status === 'fulfilled') setTypeCounts(countsRes.value)
          if (tagsRes.status === 'fulfilled') setPopularTags(tagsRes.value)
        } else {
          const items = await trainingService.getMonthCalendar(calYear, calMonth)
          if (!active) return
          setCalendarItems(items)
          setError(null)
        }
      } catch {
        if (active) setError('Təlimləri yükləmək mümkün olmadı.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [viewMode, typeFilter, search, page, calYear, calMonth])

  const openCreate = () => {
    setEditingItem(null)
    setTitle('')
    setTagsInput('')
    setType('ONLINE')
    setTrainingDate(new Date().toISOString().slice(0, 10))
    setTrainingTime('14:00')
    setLocation('Zoom / Onlayn')
    setPriceAzn('0')
    setImageUrl('')
    setLive(false)
    setIsModalOpen(true)
  }

  const openEdit = (item: TrainingResponse) => {
    setEditingItem(item)
    setTitle(item.title || '')
    setTagsInput(Array.isArray(item.tags) ? item.tags.join(', ') : '')
    setType(item.type === 'IN_PERSON' ? 'IN_PERSON' : 'ONLINE')
    setTrainingDate(item.trainingDate || new Date().toISOString().slice(0, 10))
    setTrainingTime(formatLocalTime(item.trainingTime))
    setLocation(item.location || '')
    setPriceAzn(String(item.priceAzn ?? 0))
    setImageUrl(item.imageUrl || '')
    setLive(Boolean(item.live))
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !trainingDate || !location.trim()) return
    setIsSaving(true)

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload: TrainingRequest = {
      title: title.trim(),
      tags: tags.length > 0 ? tags : undefined,
      type,
      trainingDate,
      trainingTime: parseTimeToLocalTime(trainingTime),
      location: location.trim(),
      priceAzn: Number(priceAzn) || 0,
      imageUrl: imageUrl.trim() || undefined,
      live,
    }

    try {
      if (editingItem) {
        await trainingService.updateTraining(editingItem.id, payload)
      } else {
        await trainingService.createTraining(payload)
      }
      setIsModalOpen(false)
      if (viewMode === 'list') fetchListAndMeta()
      else fetchCalendar()
    } catch (err) {
      console.error('Failed to save training', err)
      setError('Təlimi yadda saxlamaq mümkün olmadı. Zəhmət olmasa bütün vacib sahələri yoxlayın.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu təlimi silmək istədiyinizdən əminsiniz?')) return
    try {
      await trainingService.deleteTraining(id)
      setTrainings((prev) => prev.filter((t) => t.id !== id))
      setCalendarItems((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Failed to delete training', err)
      setError('Təlimi silmək mümkün olmadı.')
    }
  }

  const activeItems = viewMode === 'list' ? trainings : calendarItems

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Təlimlər və Seminarlar</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Onlayn vebinarlar və əyani psixologiya təlimlərini yaradın, planlaşdırın və idarə edin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#141521] border border-[#222437] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Siyahı</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'calendar' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Təqvim</span>
            </button>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Təlim</span>
          </button>
        </div>
      </div>

      {/* Type Counts & Popular Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {typeCounts.length > 0 ? (
          typeCounts.map((tc) => (
            <div key={tc.value || tc.label} className="bg-[#141521] border border-[#222437] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {getTrainingTypeLabel(tc.value) || tc.label}
                </p>
                <p className="text-2xl font-bold text-white mt-0.5">{tc.count ?? 0}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold">
                {getTrainingTypeLabel(tc.value)}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-[#141521] border border-[#222437] rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Yüklənmiş Təlimlər</p>
            <p className="text-2xl font-bold text-white mt-0.5">{activeItems.length}</p>
          </div>
        )}

        {popularTags.length > 0 && (
          <div className="bg-[#141521] border border-[#222437] rounded-2xl p-4 md:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-violet-400" />
              <span>Populyar Teqlər</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tg) => (
                <button
                  key={tg}
                  type="button"
                  onClick={() => {
                    setSearch(tg)
                    setPage(0)
                    setViewMode('list')
                  }}
                  className="px-2 py-0.5 rounded-full bg-[#1b1c2b] hover:bg-violet-500/20 border border-[#2e3146] text-[10px] font-semibold text-slate-300 cursor-pointer"
                >
                  #{tg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters / Calendar Bar */}
      {viewMode === 'list' ? (
        <div className="flex flex-col sm:flex-row gap-3 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Başlıq və ya teqə görə təlim axtar..."
              className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as '' | 'ONLINE' | 'IN_PERSON')
              setPage(0)
            }}
            className="px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="">Bütün Növlər</option>
            <option value="ONLINE">Onlayn</option>
            <option value="IN_PERSON">Əyani</option>
          </select>
          <button
            type="button"
            onClick={fetchListAndMeta}
            className="px-3 py-2 bg-[#1b1c2b] hover:bg-[#25283e] border border-[#2e3146] text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenilə</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-[#141521] border border-[#222437] p-4 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              if (calMonth === 1) {
                setCalMonth(12)
                setCalYear((y) => y - 1)
              } else {
                setCalMonth((m) => m - 1)
              }
            }}
            className="p-2 rounded-lg bg-[#1b1c2b] hover:bg-[#25283e] text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-bold text-white capitalize">
            {dayjs(`${calYear}-${String(calMonth).padStart(2, '0')}-01`).locale('az').format('MMMM YYYY')}
          </div>
          <button
            type="button"
            onClick={() => {
              if (calMonth === 12) {
                setCalMonth(1)
                setCalYear((y) => y + 1)
              } else {
                setCalMonth((m) => m + 1)
              }
            }}
            className="p-2 rounded-lg bg-[#1b1c2b] hover:bg-[#25283e] text-slate-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-2xl flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
          <span className="text-xs font-semibold">Təlimlər yüklənir...</span>
        </div>
      ) : activeItems.length === 0 ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-2xl text-center">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-300">Təlim tapılmadı</p>
          <p className="text-xs text-slate-500 mt-1">Yeni təlim yaradın və ya filtrləri dəyişdirin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-violet-500/40 transition-all"
            >
              <div>
                {item.imageUrl && (
                  <div className="h-40 bg-[#10111a] overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    {item.live && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        CANLI
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold shrink-0">
                      {getTrainingTypeLabel(item.type)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      <span>{item.trainingDate || '—'}</span>
                      <Clock className="w-3.5 h-3.5 text-violet-400 ml-2" />
                      <span>{formatLocalTime(item.trainingTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{item.location || '—'}</span>
                    </div>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tg) => (
                        <span key={tg} className="px-2 py-0.5 rounded bg-[#1b1c2b] text-slate-400 text-[10px]">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#222437] bg-[#10111a]/60 flex items-center justify-between">
                <span className="text-sm font-extrabold text-emerald-400">
                  {item.priceAzn ? `${item.priceAzn} AZN` : 'Pulsuz'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 cursor-pointer"
                    title="Təlimi redaktə et"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-[#1b1c2b] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Təlimi sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {viewMode === 'list' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-lg bg-[#141521] border border-[#222437] text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
          >
            Əvvəlki
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Səhifə {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg bg-[#141521] border border-[#222437] text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
          >
            Növbəti
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#141521] border border-[#2e3146] rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222437] pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Təlimi Redaktə Et' : 'Yeni Təlim Yarat'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Başlıq *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="məs. Koqnitiv Davranış Terapiyası Seminarı"
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Növ *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'ONLINE' | 'IN_PERSON')}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="ONLINE">Onlayn</option>
                    <option value="IN_PERSON">Əyani</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Tarix *</label>
                  <input
                    type="date"
                    required
                    value={trainingDate}
                    onChange={(e) => setTrainingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Saat *</label>
                  <input
                    type="time"
                    required
                    value={trainingTime}
                    onChange={(e) => setTrainingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Məkan *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bakı / Zoom Linki"
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Qiymət (AZN) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={priceAzn}
                    onChange={(e) => setPriceAzn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Teqlər (vergüllə ayrılmış)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="kbt, narahatlıq, fərqindəlik"
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <ImageUploadInput
                label="Üz Qabığı Şəkli"
                value={imageUrl}
                onChange={setImageUrl}
                folder="trainings"
                accentColor="violet"
                placeholder="https://... və ya təlim şəkli yükləyin"
              />

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={live}
                  onChange={(e) => setLive(e.target.checked)}
                  className="rounded border-[#2e3146] bg-[#1b1c2b]"
                />
                <span>Hazırda CANLI kimi işarələ</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222437]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1b1c2b] text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Təlimi Yenilə' : 'Təlim Yarat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
