import { useState, useEffect } from 'react'
import {
  Bell,
  Send,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  FileCode2,
} from 'lucide-react'
import { notificationService } from '../../../../api/services/notificationService'
import type { EmailTemplate, EmailNotificationResponse } from '../../../../types/portalDtos'

const FALLBACK_TEMPLATES: EmailTemplate[] = [
  'SESSION_REMINDER_24H',
  'SESSION_REMINDER_3H',
  'SESSION_REMINDER_30MIN',
  'OTP_CODE',
  'SESSION_CONFIRMED',
  'RESCHEDULE_CONFIRMED',
  'RESCHEDULE_REQUEST',
  'SPECIALIST_AVAILABILITY',
  'PAYMENT_RECEIPT',
  'SESSION_FEEDBACK',
  'RECOMMENDED_MATERIALS',
  'MILESTONE',
  'HABIT_DAILY',
  'MOOD_CHECK',
  'BREATHING',
  'JOURNAL',
  'PSYCH_FACT',
  'DAILY_RECOMMENDATION',
  'PODCAST_AND_BOOK_OF_DAY',
  'SCHEDULE_UPDATED',
  'FAVORITE_AVAILABLE',
  'WELCOME',
  'GUIDE_NEKSI',
  'FIRST_SESSION',
  'INACTIVE_15_DAYS',
  'INACTIVE_30_DAYS',
  'INACTIVE_60_DAYS',
  'NEW_SPECIALISTS',
]

interface ParamRow {
  key: string
  value: string
}

export default function NotificationsManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(FALLBACK_TEMPLATES)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [to, setTo] = useState('')
  const [template, setTemplate] = useState<EmailTemplate>('WELCOME')
  const [params, setParams] = useState<ParamRow[]>([{ key: 'name', value: '' }])
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<EmailNotificationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<EmailNotificationResponse & { to: string }>>([])

  useEffect(() => {
    let mounted = true
    notificationService
      .getTemplates()
      .then((list) => {
        if (mounted && list.length > 0) {
          setTemplates(list)
          setTemplate(list[0])
        }
      })
      .catch(() => {
        // Keep fallback template enum list
      })
      .finally(() => {
        if (mounted) setIsLoadingTemplates(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const addParam = () => setParams((prev) => [...prev, { key: '', value: '' }])
  const removeParam = (index: number) =>
    setParams((prev) => prev.filter((_, idx) => idx !== index))
  const updateParam = (index: number, field: 'key' | 'value', val: string) =>
    setParams((prev) => prev.map((row, idx) => (idx === index ? { ...row, [field]: val } : row)))

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!to.trim()) return

    setIsSending(true)
    setError(null)
    setResult(null)

    const paramsMap: Record<string, string> = {}
    params.forEach((p) => {
      if (p.key.trim()) paramsMap[p.key.trim()] = p.value
    })

    try {
      const res = await notificationService.sendEmail({
        to: to.trim(),
        template,
        params: Object.keys(paramsMap).length > 0 ? paramsMap : undefined,
      })
      setResult(res)
      setHistory((prev) => [{ ...res, to: to.trim() }, ...prev].slice(0, 15))
    } catch (err) {
      console.error('Failed to send email notification:', err)
      setError('Failed to send notification via POST /api/notifications/email.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Email Notifications</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
              /api/notifications/*
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Trigger templated email notifications using backend notification templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Form */}
        <form
          onSubmit={handleSend}
          className="lg:col-span-7 bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#222437] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Compose Templated Email</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">
              {isLoadingTemplates ? 'Loading templates...' : `${templates.length} templates`}
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {result.message || 'Notification sent'} ({result.template}) at {result.sentAt}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Recipient Email (to) *</label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="patient@example.com"
              className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Template (EmailTemplate) *</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as EmailTemplate)}
              className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-500"
            >
              {templates.map((tpl) => (
                <option key={tpl} value={tpl}>
                  {tpl}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Template Parameters (params)</label>
              <button
                type="button"
                onClick={addParam}
                className="px-2.5 py-1 rounded-lg bg-[#1b1c2b] hover:bg-amber-500/15 border border-[#2e3146] text-[11px] font-bold text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Param</span>
              </button>
            </div>
            <div className="space-y-2">
              {params.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => updateParam(idx, 'key', e.target.value)}
                    placeholder="Key (e.g. doctorName)"
                    className="w-1/3 px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateParam(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeParam(idx)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Email</span>
            </button>
          </div>
        </form>

        {/* Right Panel: Available Templates & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141521] border border-[#222437] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Available Templates (GET /api/notifications/templates)</span>
            </h2>
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
              {templates.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => setTemplate(tpl)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono border cursor-pointer transition-all ${
                    template === tpl
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-[#1b1c2b] border-[#2e3146] text-slate-400 hover:text-white'
                  }`}
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#141521] border border-[#222437] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Dispatches (This Session)
            </h2>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500">No emails dispatched in this session yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#10111a] border border-[#222437] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-white font-semibold truncate">{item.to}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.success ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {item.success ? 'SENT' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-mono">{item.template}</div>
                    <div className="text-[10px] text-slate-500">{item.sentAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
