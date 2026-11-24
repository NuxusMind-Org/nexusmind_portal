import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Users,
  Activity,
  ChevronDown,
  TrendingUp,
  Loader2,
  RefreshCw,
  Phone,
  Mail,
  Smile,
  Frown,
  Meh,
  Sun,
  ShieldCheck
} from 'lucide-react'
import { orgAdminService } from '../../../../api/services/orgAdminService'
import { useUserStore } from '../../../../store/userStore'
import type { PasientRegisterEntity, PatientDto, PatientMood } from '../../../../types/portalDtos'

type Priority = 'High' | 'Medium' | 'Normal'
type PatientStatus = 'Active' | 'Inactive' | 'Discharged'

interface OrgPatient {
  id: string
  name: string
  email: string
  phone: string
  avatarInitials: string
  avatarColor: string
  status: PatientStatus
  priority: Priority
  treatmentTag: string
  assignedPsychologist: string
  mood?: PatientMood | string
  gender?: string
  birthDate?: string
  address?: string
  lastSession: string
  nextSession: string
  sessionsTotal: number
  joinedDate: string
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Normal: 'bg-slate-700/40 text-slate-400 border-slate-600/20',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  High: 'Yüksək',
  Medium: 'Orta',
  Normal: 'Normal',
}

const STATUS_STYLES: Record<PatientStatus, string> = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Inactive: 'bg-slate-700/40 text-slate-400 border-slate-600/20',
  Discharged: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

const STATUS_LABELS: Record<PatientStatus, string> = {
  Active: 'Aktiv',
  Inactive: 'Deaktiv',
  Discharged: 'Tamamlanmış',
}

function MoodBadge({ mood }: { mood?: string }) {
  if (!mood) return <span className="text-slate-500 text-xs">—</span>
  const m = mood.toUpperCase()
  if (m === 'HAPPY') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Smile className="w-3 h-3" />
        <span>Şən</span>
      </span>
    )
  }
  if (m === 'SAD') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Frown className="w-3 h-3" />
        <span>Kədərli</span>
      </span>
    )
  }
  if (m === 'CALM') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Sun className="w-3 h-3" />
        <span>Sakit</span>
      </span>
    )
  }
  if (m === 'TIRED') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Meh className="w-3 h-3" />
        <span>Yorğun</span>
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-[10px] font-medium w-fit">
      {mood}
    </span>
  )
}

export default function OrgPatientsList() {
  const profile = useUserStore((state) => state.profile)
  const isPlatformAdmin = profile?.role === 'platform_admin'

  const [patients, setPatients] = useState<OrgPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')
  const [psychFilter, setPsychFilter] = useState('All')

  const fetchPatients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const patientsList: Array<PasientRegisterEntity | PatientDto> = isPlatformAdmin
        ? await orgAdminService.getNexusmindPatients()
        : await orgAdminService.getBpmPatients()

      const mapped: OrgPatient[] = patientsList.map((raw, idx) => {
        const entity = raw as PasientRegisterEntity
        const dto = raw as PatientDto
        const combinedName = [entity.name, entity.surname].filter(Boolean).join(' ').trim()
        const rawName = combinedName || dto.fullName || `Pasiyent #${raw.id}`
        const initials = rawName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()

        const colorPalettes = [
          'from-teal-500/20 to-emerald-500/20 text-emerald-400',
          'from-violet-600/20 to-indigo-600/20 text-violet-400',
          'from-rose-600/20 to-pink-600/20 text-rose-400',
          'from-sky-600/20 to-blue-600/20 text-sky-400',
          'from-amber-600/20 to-orange-600/20 text-amber-400',
        ]
        const avatarColor = colorPalettes[idx % colorPalettes.length]

        const statusLabel: PatientStatus = entity.deletedAt
          ? 'Inactive'
          : entity.verified === false
            ? 'Inactive'
            : 'Active'

        const priority: Priority =
          entity.mood === 'SAD' ? 'High' : entity.mood === 'TIRED' ? 'Medium' : 'Normal'

        const statusTag =
          entity.status === 'TELEBE'
            ? 'Tələbə'
            : entity.status === 'ISCI'
              ? 'İşçi'
              : entity.status === 'DIGER'
                ? 'Digər'
                : dto.treatmentTag || 'Pasiyent'

        return {
          id: String(raw.id),
          name: rawName,
          email: raw.email || '—',
          phone: raw.phone || '—',
          avatarInitials: initials || 'PT',
          avatarColor,
          status: statusLabel,
          priority: (dto.priority as Priority) || priority,
          treatmentTag: statusTag,
          assignedPsychologist:
            dto.assignedPsychologist ||
            (entity.age ? `Yaş ${entity.age} • ${statusTag}` : statusTag),
          mood: raw.mood,
          gender: dto.gender,
          birthDate: dto.birthDate,
          address: dto.address,
          lastSession: entity.moodUpdatedDate || dto.lastSession || '—',
          nextSession: dto.nextSession || '—',
          sessionsTotal: Array.isArray(entity.appointments)
            ? entity.appointments.length
            : (dto.sessionsTotal ?? 0),
          joinedDate: entity.moodUpdatedDate || dto.registeredAt || dto.createdAt || '—',
        }
      })

      setPatients(mapped)
    } catch (err) {
      console.error('Failed to fetch patients', err)
      setError('Pasiyent siyahısı yüklənə bilmədi.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [isPlatformAdmin])

  const allPsychs = useMemo(() => {
    const set = new Set(patients.map((p) => p.assignedPsychologist))
    return ['All', ...Array.from(set)]
  }, [patients])

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.treatmentTag.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
      const matchStatus = statusFilter === 'All' || p.status === statusFilter
      const matchPriority = priorityFilter === 'All' || p.priority === priorityFilter
      const matchPsych = psychFilter === 'All' || p.assignedPsychologist === psychFilter
      return matchSearch && matchStatus && matchPriority && matchPsych
    })
  }, [patients, search, statusFilter, priorityFilter, psychFilter])

  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter((p) => p.status === 'Active').length,
    highPriority: patients.filter((p) => p.priority === 'High').length,
    totalSessions: patients.reduce((acc, p) => acc + p.sessionsTotal, 0),
  }), [patients])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Pasiyentlər və Müştərilər Kataloqu</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPlatformAdmin
                  ? 'NexusMind Super Admin tərəfindən idarə olunan platforma üzrə qeydiyyatlı pasiyent qeydləri.'
                  : 'BPM təşkilatının pasiyent qeydləri, terapiya müştəriləri və təyin edilmiş müalicə planları.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPatients}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141521] hover:bg-[#1b1c2b] border border-[#2e3146] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Siyahını yenilə"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            <span>Yenilə</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium rounded-xl">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ümumi Pasiyentlər', value: stats.total, icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
          { label: 'Aktiv Müalicələr', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Yüksək Prioritet', value: stats.highPriority, icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Tamamlanmış Sessiyalar', value: stats.totalSessions, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#141521] border border-[#222437] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pasiyent adı, e-poçt, telefon və ya ünvana görə axtarın…"
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PatientStatus | 'All')}
            className="appearance-none pl-3 pr-8 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
          >
            <option value="All">Bütün Statuslar</option>
            <option value="Active">Aktiv</option>
            <option value="Inactive">Deaktiv</option>
            <option value="Discharged">Tamamlanmış</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            className="appearance-none pl-3 pr-8 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
          >
            <option value="All">Bütün Prioritetlər</option>
            <option value="High">Yüksək</option>
            <option value="Medium">Orta</option>
            <option value="Normal">Normal</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Psychologist */}
        <div className="relative">
          <select
            value={psychFilter}
            onChange={(e) => setPsychFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer max-w-[200px]"
          >
            {allPsychs.map((p) => (
              <option key={p} value={p}>{p === 'All' ? 'Bütün Psixoloqlar' : p}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Patient Table */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
          <span className="text-xs font-semibold">Pasiyent kataloqu yüklənir...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#141521] border border-[#222437] rounded-2xl text-center">
          <Users className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">Pasiyent tapılmadı</p>
          <p className="text-xs text-slate-500 mt-1">Axtarış meyarlarını və ya filtrləri dəyişdirin.</p>
        </div>
      ) : (
        <div className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                  <th className="py-3.5 px-4">Pasiyent</th>
                  <th className="py-3.5 px-4">Əlaqə</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Prioritet</th>
                  <th className="py-3.5 px-4">Əhval-ruhiyyə</th>
                  <th className="py-3.5 px-4">Təyin Edilmiş Heyət</th>
                  <th className="py-3.5 px-4">Sessiyalar</th>
                  <th className="py-3.5 px-4">Qeydiyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222437] text-slate-300">
                {filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-[#191b2b] transition-colors group">
                    {/* Patient Name & Initials */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${patient.avatarColor} border border-white/5 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner`}>
                          {patient.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-teal-300 transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: #{patient.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="font-mono text-[11px]">{patient.email}</span>
                      </div>
                      {patient.phone !== '—' && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="font-mono text-[10px]">{patient.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[patient.status] || STATUS_STYLES.Active}`}>
                        {STATUS_LABELS[patient.status] || patient.status}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[patient.priority] || PRIORITY_STYLES.Normal}`}>
                        {PRIORITY_LABELS[patient.priority] || patient.priority}
                      </span>
                    </td>

                    {/* Mood */}
                    <td className="py-3.5 px-4">
                      <MoodBadge mood={patient.mood} />
                    </td>

                    {/* Assigned Psychologist */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-medium">
                        {patient.assignedPsychologist}
                      </span>
                    </td>

                    {/* Total Sessions */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{patient.sessionsTotal}</span>
                      <span className="text-slate-500 text-[10px] ml-1">sessiya</span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {patient.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
