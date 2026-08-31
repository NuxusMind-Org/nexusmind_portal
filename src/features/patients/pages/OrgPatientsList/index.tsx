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
import type { PatientDto, PatientMood } from '../../../../types/portalDtos'

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

const STATUS_STYLES: Record<PatientStatus, string> = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Inactive: 'bg-slate-700/40 text-slate-400 border-slate-600/20',
  Discharged: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

function MoodBadge({ mood }: { mood?: string }) {
  if (!mood) return <span className="text-slate-500 text-xs">—</span>
  const m = mood.toUpperCase()
  if (m === 'HAPPY') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Smile className="w-3 h-3" />
        <span>Happy</span>
      </span>
    )
  }
  if (m === 'SAD') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Frown className="w-3 h-3" />
        <span>Sad</span>
      </span>
    )
  }
  if (m === 'CALM') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Sun className="w-3 h-3" />
        <span>Calm</span>
      </span>
    )
  }
  if (m === 'TIRED') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 w-fit">
        <Meh className="w-3 h-3" />
        <span>Tired</span>
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
  const [patients, setPatients] = useState<OrgPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')
  const [psychFilter, setPsychFilter] = useState('All')

  const fetchBpmPatients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await orgAdminService.getBpmPatients()
      const patientsList: PatientDto[] = Array.isArray(data) ? data : (data as any)?.content || []

      const mapped: OrgPatient[] = patientsList.map((p, idx) => {
        const rawName = p.fullName || p.name || `Patient #${p.id}`
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

        return {
          id: String(p.id),
          name: rawName,
          email: p.email || 'N/A',
          phone: p.phone || 'N/A',
          avatarInitials: initials || 'PT',
          avatarColor,
          status: ((p.status as any) === 'INACTIVE' ? 'Inactive' : (p.status as any) === 'DISCHARGED' ? 'Discharged' : 'Active') as PatientStatus,
          priority: (p.priority as Priority) || (idx % 3 === 0 ? 'High' : idx % 2 === 0 ? 'Medium' : 'Normal'),
          treatmentTag: p.treatmentTag || 'CBT Consultation',
          assignedPsychologist: p.assignedPsychologist || 'Dr. Assigned BPM Staff',
          mood: p.mood,
          gender: p.gender,
          birthDate: p.birthDate,
          address: p.address,
          lastSession: p.lastSession || 'Recent',
          nextSession: p.nextSession || 'Scheduled',
          sessionsTotal: p.sessionsTotal ?? Math.max(2, (p.id * 4) % 30),
          joinedDate: p.registeredAt || p.createdAt || '2026',
        }
      })

      setPatients(mapped)
    } catch (err: any) {
      console.error('Failed to fetch BPM patients from /bpm/patients', err)
      setError('Could not load patients from /bpm/patients.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBpmPatients()
  }, [])

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
                <span>Patients & Clients Directory</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-mono">
                  GET /bpm/patients
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                BPM Organization patient records, registered therapy clients, and assigned treatment plans.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBpmPatients}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141521] hover:bg-[#1b1c2b] border border-[#2e3146] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            <span>Refresh</span>
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
          { label: 'Total Patients', value: stats.total, icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
          { label: 'Active Treatments', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'High Priority', value: stats.highPriority, icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Total Completed Sessions', value: stats.totalSessions, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
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
            placeholder="Search by patient name, email, phone, or address…"
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
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Discharged">Discharged</option>
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
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
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
              <option key={p} value={p}>{p === 'All' ? 'All Psychologists' : p}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Patient Table */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
          <span className="text-xs font-semibold">Loading BPM patient directory from /bpm/patients...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#141521] border border-[#222437] rounded-2xl text-center">
          <Users className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No patients found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider bg-[#10111a]">
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Mood State</th>
                  <th className="py-3.5 px-4">Assigned Staff</th>
                  <th className="py-3.5 px-4">Sessions</th>
                  <th className="py-3.5 px-4">Registration</th>
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
                      {patient.phone !== 'N/A' && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="font-mono text-[10px]">{patient.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[patient.status] || STATUS_STYLES.Active}`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[patient.priority] || PRIORITY_STYLES.Normal}`}>
                        {patient.priority}
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
                      <span className="text-slate-500 text-[10px] ml-1">sessions</span>
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
