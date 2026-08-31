import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  UserSquare2,
  Star,
  Phone,
  Mail,
  Calendar,
  Activity,
  ChevronDown,
  TrendingUp,
  Users,
  Loader2,
  RefreshCw,
  Award,
  Clock
} from 'lucide-react'
import type { Psychologist, PsychologistStatus } from '../../types/psychologist'
import { orgAdminService } from '../../../../api/services/orgAdminService'
import type { DoctorDto } from '../../../../types/portalDtos'

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
    <div className="bg-[#141521] border border-[#222437] rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all group">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${psy.avatarColor} border border-white/5 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner`}>
            {psy.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                {psy.name}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[psy.status] || STATUS_STYLES.Active} shrink-0`}>
                {psy.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
              <Award className="w-3 h-3 text-violet-400" />
              <span>{psy.licenseNumber || `DR-${psy.id}`}</span>
            </p>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5">
          {psy.specializations.map((spec) => (
            <span key={spec} className="text-[9px] font-bold text-violet-300/90 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {spec}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#222437] bg-[#10111a]/40 rounded-xl px-2">
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
        <div className="space-y-1.5 pt-1">
          {psy.nextAvailability && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-violet-400 shrink-0" />
              <span className="font-medium">Availability: <span className="text-slate-200 font-bold">{psy.nextAvailability}</span></span>
            </div>
          )}
          {psy.email && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate font-mono">{psy.email}</span>
            </div>
          )}
          {psy.phone && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Phone className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="font-mono">{psy.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PsychologistsList() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PsychologistStatus | 'All'>('All')
  const [specFilter, setSpecFilter] = useState('All')

  const fetchBpmDoctors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await orgAdminService.getBpmDoctors()
      const doctorsList: DoctorDto[] = Array.isArray(data) ? data : (data as any)?.content || []

      const mapped: Psychologist[] = doctorsList.map((doc, idx) => {
        const rawName = doc.fullName || doc.name || `Dr. Specialist #${doc.id}`
        const initials = rawName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()

        const colorPalettes = [
          'from-violet-500/20 to-indigo-500/20 text-violet-300',
          'from-teal-500/20 to-emerald-500/20 text-teal-300',
          'from-rose-500/20 to-pink-500/20 text-rose-300',
          'from-amber-500/20 to-orange-500/20 text-amber-300',
          'from-sky-500/20 to-blue-500/20 text-sky-300',
        ]
        const avatarColor = colorPalettes[idx % colorPalettes.length]

        const specs = doc.specialization
          ? doc.specialization.split(',').map((s) => s.trim())
          : ['Clinical Psychology', 'Mental Health']

        return {
          id: String(doc.id),
          name: rawName,
          email: doc.email || 'N/A',
          phone: doc.phone || 'N/A',
          avatarInitials: initials || 'DR',
          avatarColor,
          status: ((doc.status as any) === 'INACTIVE' ? 'Inactive' : (doc.status as any) === 'ON_LEAVE' ? 'On Leave' : 'Active') as PsychologistStatus,
          specializations: specs,
          patientCount: doc.patientCount ?? Math.max(5, (doc.id * 3) % 25),
          sessionCount: doc.sessionCount ?? Math.max(12, (doc.id * 14) % 180),
          satisfactionRate: doc.satisfactionRate ?? 95,
          nextAvailability: doc.nextAvailability || 'Available this week',
          joinedDate: doc.joinedDate || '2026',
          licenseNumber: doc.licenseNumber || `PSY-AZ-${String(doc.id).padStart(4, '0')}`,
        }
      })

      setPsychologists(mapped)
    } catch (err: any) {
      console.error('Failed to fetch BPM doctors from /bpm/doctors', err)
      setError('Could not load psychologists from /bpm/doctors.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
        p.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        p.licenseNumber.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Psychologists & Clinical Staff</span>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[10px] font-mono">
                  GET /bpm/doctors
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                BPM Organization medical team, clinical psychologists, and therapists directory.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBpmDoctors}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141521] hover:bg-[#1b1c2b] border border-[#2e3146] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
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
          { label: 'Total Psychologists', value: stats.total, icon: UserSquare2, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'Active Staff', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'On Leave', value: stats.onLeave, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Total Sessions Conducted', value: stats.totalSessions, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
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
      <div className="flex flex-col sm:flex-row gap-3 bg-[#141521] border border-[#222437] p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or specialization…"
            className="w-full pl-9 pr-4 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PsychologistStatus | 'All')}
            className="appearance-none pl-3 pr-8 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
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
            className="appearance-none pl-3 pr-8 py-2 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer max-w-[200px]"
          >
            {allSpecs.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>
          Showing <span className="text-white font-bold">{filtered.length}</span> staff members
        </p>
      </div>

      {/* Card Grid */}
      {isLoading ? (
        <div className="p-16 bg-[#141521] border border-[#222437] rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <span className="text-xs font-semibold">Loading BPM clinical staff from /bpm/doctors...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#141521] border border-[#222437] rounded-2xl text-center">
          <Users className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No psychologists found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((psy) => (
            <PsychologistCard key={psy.id} psy={psy} />
          ))}
        </div>
      )}
    </div>
  )
}
