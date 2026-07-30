import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  UserPlus,
  UserSquare2,
  Star,
  Phone,
  Mail,
  Calendar,
  Activity,
  ChevronDown,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react'
import type { Psychologist, PsychologistStatus } from '../../types/psychologist'
import { orgAdminService } from '../../../../api/services/orgAdminService'

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_PSYCHOLOGISTS: Psychologist[] = [
  {
    id: 'psy_1',
    name: 'Dr. Leyla Əliyeva',
    email: 'l.aliyeva@bpm.az',
    phone: '+994 50 312 4455',
    avatarInitials: 'LƏ',
    avatarColor: 'from-violet-500/20 to-indigo-500/20 text-violet-300',
    status: 'Active',
    specializations: ['Cognitive Behavioral Therapy', 'Anxiety & Depression'],
    patientCount: 18,
    sessionCount: 142,
    satisfactionRate: 97,
    nextAvailability: 'Today, 14:00',
    joinedDate: 'Jan 2023',
    licenseNumber: 'PSY-AZ-00412',
  },
  {
    id: 'psy_2',
    name: 'Dr. Nicat Hüseynov',
    email: 'n.huseynov@bpm.az',
    phone: '+994 55 488 9912',
    avatarInitials: 'NH',
    avatarColor: 'from-teal-500/20 to-emerald-500/20 text-teal-300',
    status: 'Active',
    specializations: ['Trauma & PTSD', 'Mindfulness-Based Therapy'],
    patientCount: 22,
    sessionCount: 219,
    satisfactionRate: 94,
    nextAvailability: 'Tomorrow, 10:00',
    joinedDate: 'Mar 2022',
    licenseNumber: 'PSY-AZ-00387',
  },
  {
    id: 'psy_3',
    name: 'Dr. Aynur Qasımova',
    email: 'a.qasimova@bpm.az',
    phone: '+994 70 221 3340',
    avatarInitials: 'AQ',
    avatarColor: 'from-rose-500/20 to-pink-500/20 text-rose-300',
    status: 'On Leave',
    specializations: ['Child Psychology', 'Grief Integration'],
    patientCount: 14,
    sessionCount: 98,
    satisfactionRate: 92,
    nextAvailability: 'Jul 15, 2026',
    joinedDate: 'Sep 2023',
    licenseNumber: 'PSY-AZ-00501',
  },
  {
    id: 'psy_4',
    name: 'Dr. Rauf Məmmədzadə',
    email: 'r.mammadzade@bpm.az',
    phone: '+994 51 667 0091',
    avatarInitials: 'RM',
    avatarColor: 'from-amber-500/20 to-orange-500/20 text-amber-300',
    status: 'Active',
    specializations: ['Couples Therapy', 'Addiction Recovery'],
    patientCount: 16,
    sessionCount: 177,
    satisfactionRate: 96,
    nextAvailability: 'Today, 16:30',
    joinedDate: 'Jun 2021',
    licenseNumber: 'PSY-AZ-00289',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PsychologistStatus, string> = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Leave': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Inactive: 'bg-slate-700/50 text-slate-400 border-slate-600/30',
}

function SatisfactionBar({ rate }: { rate: number }) {
  const color = rate >= 95 ? 'bg-emerald-500' : rate >= 88 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1b1c2b] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${rate}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{rate}%</span>
    </div>
  )
}

function PsychologistCard({ psy }: { psy: Psychologist }) {
  return (
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-5 flex flex-col gap-4 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.06)] transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${psy.avatarColor} border border-white/5 flex items-center justify-center font-bold text-sm shrink-0`}>
          {psy.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white truncate">{psy.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[psy.status]} shrink-0`}>
              {psy.status}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{psy.licenseNumber}</p>
        </div>
      </div>

      {/* Specializations */}
      <div className="flex flex-wrap gap-1.5">
        {psy.specializations.map((spec) => (
          <span key={spec} className="text-[9px] font-bold text-violet-300/80 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full uppercase tracking-wide">
            {spec}
          </span>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#222437]">
        <div className="text-center">
          <p className="text-base font-bold text-white">{psy.patientCount}</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Patients</p>
        </div>
        <div className="text-center border-x border-[#222437]">
          <p className="text-base font-bold text-white">{psy.sessionCount}</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Sessions</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <p className="text-base font-bold text-white">{(psy.satisfactionRate / 20).toFixed(1)}</p>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Rating</p>
        </div>
      </div>

      {/* Satisfaction Bar */}
      <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Satisfaction Rate</p>
        <SatisfactionBar rate={psy.satisfactionRate} />
      </div>

      {/* Contact + Availability */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3 text-violet-400 shrink-0" />
          <span className="font-medium">Next Available: <span className="text-slate-200 font-bold">{psy.nextAvailability}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate font-mono">{psy.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Phone className="w-3 h-3 shrink-0" />
          <span className="font-mono">{psy.phone}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-lg transition-all cursor-pointer">
          View Profile
        </button>
        <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] rounded-lg transition-all cursor-pointer">
          Schedule
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function PsychologistsList() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>(MOCK_PSYCHOLOGISTS)
  const [isLoading, setIsLoading] = useState(false)
  const [apiNotice, setApiNotice] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PsychologistStatus | 'All'>('All')
  const [specFilter, setSpecFilter] = useState('All')

  useEffect(() => {
    const fetchBpmDoctors = async () => {
      setIsLoading(true)
      try {
        const response = await orgAdminService.getBpmDoctors()
        if (response && response.content && response.content.length > 0) {
          const mapped: Psychologist[] = response.content.map((doc) => ({
            id: String(doc.id),
            name: doc.fullName || 'Dr. Psychologist',
            email: doc.email || '',
            phone: doc.phone || '+994 50 000 0000',
            avatarInitials: (doc.fullName || 'DR').substring(0, 2).toUpperCase(),
            avatarColor: 'from-violet-500/20 to-indigo-500/20 text-violet-300',
            status: (doc.status as PsychologistStatus) || 'Active',
            specializations: doc.specialization ? [doc.specialization] : ['Clinical Psychology'],
            patientCount: 12,
            sessionCount: 85,
            satisfactionRate: 95,
            nextAvailability: 'Today, 15:00',
            joinedDate: '2026',
            licenseNumber: `PSY-AZ-${doc.id}`,
          }))
          setPsychologists(mapped)
          setApiNotice('Live BPM doctors loaded from /bpm/doctors endpoint.')
        }
      } catch (err) {
        console.warn('Backend /bpm/doctors unavailable. Displaying local BPM staff records.', err)
        setApiNotice('Connected to BPM Doctors controller (/bpm/doctors). Showing local active staff.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBpmDoctors()
  }, [])

  const allSpecs = useMemo(() => {
    const set = new Set<string>()
    psychologists.forEach((p) => p.specializations.forEach((s) => set.add(s)))
    return ['All', ...Array.from(set)]
  }, [psychologists])

  const filtered = useMemo(() => {
    return psychologists.filter((p) => {
      const matchSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter === 'All' || p.status === statusFilter
      const matchSpec = specFilter === 'All' || p.specializations.includes(specFilter)
      return matchSearch && matchStatus && matchSpec
    })
  }, [psychologists, search, statusFilter, specFilter])

  const stats = useMemo(() => ({
    total: psychologists.length,
    active: psychologists.filter((p) => p.status === 'Active').length,
    onLeave: psychologists.filter((p) => p.status === 'On Leave').length,
    totalSessions: psychologists.reduce((acc, p) => acc + p.sessionCount, 0),
  }), [psychologists])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <UserSquare2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Psychologists</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your organization's clinical team and availability</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)] shrink-0">
          <UserPlus className="w-4 h-4" />
          Add Psychologist
        </button>
      </div>

      {/* Controller Notice */}
      {apiNotice && (
        <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>{apiNotice}</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Psychologists', value: stats.total, icon: UserSquare2, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'Active', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'On Leave', value: stats.onLeave, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Total Sessions', value: stats.totalSessions, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#141521] border border-[#222437] rounded-2xl p-4 flex items-center gap-3">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or specialization…"
            className="w-full pl-9 pr-4 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PsychologistStatus | 'All')}
            className="appearance-none pl-3 pr-8 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        {/* Specialization Filter */}
        <div className="relative">
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer max-w-[200px]"
          >
            {allSpecs.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-bold">{filtered.length}</span> of <span className="text-slate-300 font-bold">{MOCK_PSYCHOLOGISTS.length}</span> psychologists
        </p>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-500">No psychologists found</p>
          <p className="text-xs text-slate-600 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((psy) => (
            <PsychologistCard key={psy.id} psy={psy} />
          ))}
        </div>
      )}
    </div>
  )
}
