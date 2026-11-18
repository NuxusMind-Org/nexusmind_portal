import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Users,
  Tag,
  RefreshCw,
} from 'lucide-react'
import { doctorService } from '../../../../api'
import { useUserStore } from '../../../../store/userStore'
import type { DoctorPriceRequest, DoctorPriceResponse } from '../../../../types/portalDtos'

export interface DoctorPricesPanelProps {
  doctorId?: number | string
  doctorName?: string
  compact?: boolean
}

const SESSION_TYPE_OPTIONS = ['INDIVIDUAL', 'COUPLE', 'FAMILY', 'CHILD', 'GROUP']
const CURRENCY_OPTIONS = ['AZN', 'USD', 'EUR']

const resolveNumericId = (val: unknown): number | null => {
  if (typeof val === 'number' && !isNaN(val) && val > 0) return val
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return null
}

const emptyForm: DoctorPriceRequest = {
  label: '',
  minAge: 18,
  maxAge: 65,
  sessionType: 'INDIVIDUAL',
  durationMin: 50,
  durationMax: 60,
  amount: 50,
  currency: 'AZN',
}

export function DoctorPricesPanel({ doctorId, doctorName, compact = false }: DoctorPricesPanelProps) {
  const { t } = useTranslation()
  const { profile } = useUserStore()

  const activeDoctorId =
    resolveNumericId(doctorId) ??
    resolveNumericId(profile?.doctorId) ??
    resolveNumericId(profile?.id) ??
    1

  const [prices, setPrices] = useState<DoctorPriceResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [ageFilter, setAgeFilter] = useState<string>('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState<DoctorPriceResponse | null>(null)
  const [formData, setFormData] = useState<DoctorPriceRequest>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!activeDoctorId) return
    setIsLoading(true)
    setFeedback(null)
    try {
      const parsedAge = ageFilter.trim() !== '' ? Number(ageFilter) : undefined
      const data = await doctorService.getPrices(
        activeDoctorId,
        parsedAge !== undefined && !isNaN(parsedAge) ? parsedAge : undefined
      )
      setPrices(data)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('pricing.fetchError', { defaultValue: 'Qiymət cədvəlini yükləmək mümkün olmadı.' })
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }, [activeDoctorId, ageFilter, t])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  const openCreateModal = () => {
    setEditingPrice(null)
    setFormData(emptyForm)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: DoctorPriceResponse) => {
    setEditingPrice(item)
    setFormData({
      label: item.label ?? '',
      minAge: item.minAge ?? 18,
      maxAge: item.maxAge ?? 65,
      sessionType: item.sessionType ?? 'INDIVIDUAL',
      durationMin: item.durationMin ?? 50,
      durationMax: item.durationMax ?? 60,
      amount: item.amount ?? 0,
      currency: item.currency ?? 'AZN',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const validateForm = (): string | null => {
    if (!formData.label.trim()) {
      return t('pricing.labelRequired', { defaultValue: 'Xidmət adı (label) mütləqdir.' })
    }
    if (formData.amount === undefined || isNaN(Number(formData.amount)) || Number(formData.amount) < 0) {
      return t('pricing.amountInvalid', { defaultValue: 'Məbləğ 0 və ya daha böyük olmalıdır.' })
    }
    if (
      formData.minAge !== undefined &&
      formData.maxAge !== undefined &&
      Number(formData.minAge) > Number(formData.maxAge)
    ) {
      return t('pricing.ageRangeInvalid', { defaultValue: 'Minimum yaş maksimum yaşdan böyük ola bilməz.' })
    }
    if (
      formData.durationMin !== undefined &&
      formData.durationMax !== undefined &&
      Number(formData.durationMin) > Number(formData.durationMax)
    ) {
      return t('pricing.durationRangeInvalid', {
        defaultValue: 'Minimum müddət maksimum müddətdən böyük ola bilməz.',
      })
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErr = validateForm()
    if (validationErr) {
      setFormError(validationErr)
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    const payload: DoctorPriceRequest = {
      label: formData.label.trim(),
      amount: Number(formData.amount),
      currency: formData.currency?.trim() || 'AZN',
      sessionType: formData.sessionType?.trim() || undefined,
      minAge: formData.minAge !== undefined && formData.minAge !== null ? Number(formData.minAge) : undefined,
      maxAge: formData.maxAge !== undefined && formData.maxAge !== null ? Number(formData.maxAge) : undefined,
      durationMin:
        formData.durationMin !== undefined && formData.durationMin !== null ? Number(formData.durationMin) : undefined,
      durationMax:
        formData.durationMax !== undefined && formData.durationMax !== null ? Number(formData.durationMax) : undefined,
    }

    try {
      if (editingPrice) {
        await doctorService.updatePrice(activeDoctorId, editingPrice.id, payload)
        setFeedback({
          type: 'success',
          message: t('pricing.updatedSuccess', { defaultValue: 'Tarif uğurla yeniləndi.' }),
        })
      } else {
        await doctorService.createPrice(activeDoctorId, payload)
        setFeedback({
          type: 'success',
          message: t('pricing.createdSuccess', { defaultValue: 'Yeni tarif uğurla əlavə edildi.' }),
        })
      }
      setIsModalOpen(false)
      await fetchPrices()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('pricing.saveError', { defaultValue: 'Tarifi yadda saxlamaq mümkün olmadı.' })
      setFormError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (priceId: number) => {
    setDeletingId(priceId)
    setFeedback(null)
    try {
      await doctorService.deletePrice(activeDoctorId, priceId)
      setPrices((prev) => prev.filter((p) => p.id !== priceId))
      setFeedback({
        type: 'success',
        message: t('pricing.deletedSuccess', { defaultValue: 'Tarif silindi.' }),
      })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('pricing.deleteError', { defaultValue: 'Tarifi silmək mümkün olmadı.' })
      setFeedback({ type: 'error', message: msg })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
              <span>
                {doctorName
                  ? `${doctorName} — ${t('pricing.title', { defaultValue: 'Seans Qiymətləri' })}`
                  : t('pricing.title', { defaultValue: 'Seans Qiymətləri və Tariflər' })}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                /doctors/{activeDoctorId}/prices
              </span>
            </h2>
            {!compact && (
              <p className="text-xs text-slate-400 mt-0.5">
                {t('pricing.subtitle', {
                  defaultValue: 'Yaş qrupu, seans növü və müddətə görə fərdi qəbul tariflərini idarə edin.',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl px-2.5 py-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="number"
              min={0}
              max={120}
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              placeholder={t('pricing.filterByAge', { defaultValue: 'Yaş filtri' })}
              className="w-20 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {ageFilter && (
              <button
                type="button"
                onClick={() => setAgeFilter('')}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={fetchPrices}
            disabled={isLoading}
            className="p-2 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title={t('common.refresh', { defaultValue: 'Yenilə' })}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('pricing.addPrice', { defaultValue: 'Yeni Tarif' })}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer px-2">
            ✕
          </button>
        </div>
      )}

      {/* Prices Grid / Table */}
      <div className="bg-[#11121d] border border-[#202235] rounded-2xl overflow-hidden relative min-h-[180px]">
        {isLoading && (
          <div className="absolute inset-0 bg-[#11121d]/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
          </div>
        )}

        {prices.length === 0 && !isLoading ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Tag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                {t('pricing.emptyTitle', { defaultValue: 'Hələ heç bir tarif əlavə edilməyib' })}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {t('pricing.emptySubtitle', {
                  defaultValue: 'Pasiyentlərin seans bron edərkən görə bilməsi üçün ilk qiymət tarifinizi yaradın.',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('pricing.addFirstPrice', { defaultValue: 'İlk Tarifi Əlavə Et' })}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#202235] bg-[#161827] text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">{t('pricing.colLabel', { defaultValue: 'Tarif Adı' })}</th>
                  <th className="py-3.5 px-4">{t('pricing.colSessionType', { defaultValue: 'Seans Növü' })}</th>
                  <th className="py-3.5 px-4">{t('pricing.colAgeRange', { defaultValue: 'Yaş Aralığı' })}</th>
                  <th className="py-3.5 px-4">{t('pricing.colDuration', { defaultValue: 'Müddət (dəq)' })}</th>
                  <th className="py-3.5 px-4">{t('pricing.colAmount', { defaultValue: 'Qiymət' })}</th>
                  <th className="py-3.5 px-4 text-right">{t('pricing.colActions', { defaultValue: 'Əməliyyat' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202235]/60 text-xs">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-[#161827]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{item.label || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {item.sessionType || 'INDIVIDUAL'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {item.minAge !== undefined || item.maxAge !== undefined
                        ? `${item.minAge ?? 0} – ${item.maxAge ?? '∞'} yaş`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {item.durationMin !== undefined || item.durationMax !== undefined
                          ? item.durationMin === item.durationMax
                            ? `${item.durationMin} dəq`
                            : `${item.durationMin ?? 0}–${item.durationMax ?? 0} dəq`
                          : '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-black text-emerald-400">
                        {item.amount ?? 0} {item.currency || 'AZN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-[#1b1c2b] hover:bg-[#25283e] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          title={t('common.edit', { defaultValue: 'Redaktə et' })}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title={t('common.delete', { defaultValue: 'Sil' })}
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141521] border border-[#222437] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222437] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPrice
                      ? t('pricing.editModalTitle', { defaultValue: 'Tarifi Redaktə Et' })
                      : t('pricing.createModalTitle', { defaultValue: 'Yeni Seans Tarifi' })}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingPrice ? `ID #${editingPrice.id}` : `Həkim ID #${activeDoctorId}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1b1c2b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {t('pricing.fieldLabel', { defaultValue: 'Tarif Adı *' })}
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Məs: Böyüklər üçün fərdi konsultasiya"
                  className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldAmount', { defaultValue: 'Məbləğ *' })}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldCurrency', { defaultValue: 'Valyuta' })}
                  </label>
                  <select
                    value={formData.currency || 'AZN'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  >
                    {CURRENCY_OPTIONS.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldSessionType', { defaultValue: 'Seans Növü' })}
                  </label>
                  <select
                    value={formData.sessionType || 'INDIVIDUAL'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sessionType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  >
                    {SESSION_TYPE_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldMinAge', { defaultValue: 'Min. Yaş' })}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minAge ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minAge: e.target.value === '' ? undefined : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldMaxAge', { defaultValue: 'Maks. Yaş' })}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxAge ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxAge: e.target.value === '' ? undefined : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldDurationMin', { defaultValue: 'Min. Müddət (dəq)' })}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.durationMin ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        durationMin: e.target.value === '' ? undefined : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {t('pricing.fieldDurationMax', { defaultValue: 'Maks. Müddət (dəq)' })}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.durationMax ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        durationMax: e.target.value === '' ? undefined : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#222437]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1b1c2b] hover:bg-[#25283e] border border-[#2e3146] text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {t('common.cancel', { defaultValue: 'Ləğv Et' })}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.25)] cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingPrice
                      ? t('common.saveChanges', { defaultValue: 'Yadda Saxla' })
                      : t('common.create', { defaultValue: 'Əlavə Et' })}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
