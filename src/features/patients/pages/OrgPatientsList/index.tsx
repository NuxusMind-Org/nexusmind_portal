import { useState, useMemo } from 'react'
import {
  Search,
  UserPlus,
  Users,
  AlertCircle,
  Activity,
  Calendar,
  ChevronDown,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react'

type Priority = 'High' | 'Medium' | 'Normal'
type PatientStatus = 'Active' | 'Inactive' | 'Discharged'

interface OrgPatient {
  id: string
  name: string
  email: string
  avatarInitials: string
  avatarColor: string
  status: PatientStatus
  priority: Priority
  treatmentTag: string
  assignedPsychologist: string
  lastSession: string
  nextSession: string
  sessionsTotal: number
  joinedDate: string
}

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_ORG_PATIENTS: OrgPatient[] = [
  { id: 'op_01', name: 'Sarah Miller',     email: 's.miller@email.com',    avatarInitials: 'SM', avatarColor: 'from-teal-500/20 to-emerald-500/20 text-emerald-400',  status: 'Active',    priority: 'Medium', treatmentTag: 'CBT Follow-up',       assignedPsychologist: 'Dr. Leyla Əliyeva',    lastSession: '2 days ago',  nextSession: 'Jul 3, 2026',  sessionsTotal: 12, joinedDate: 'Mar 2025' },
  { id: 'op_02', name: 'John Larson',      email: 'j.larson@email.com',     avatarInitials: 'JL', avatarColor: 'from-slate-700/50 to-slate-800/50 text-slate-400',      status: 'Active',    priority: 'High',   treatmentTag: 'Anxiety Treatment',   assignedPsychologist: 'Dr. Sevinc İsmayılova', lastSession: '5 days ago',  nextSession: 'Jul 2, 2026',  sessionsTotal: 24, joinedDate: 'Jan 2025' },
  { id: 'op_03', name: 'Alice Chen',       email: 'a.chen@email.com',       avatarInitials: 'AC', avatarColor: 'from-violet-600/20 to-indigo-600/20 text-violet-400',    status: 'Active',    priority: 'Normal', treatmentTag: 'Grief Integration',   assignedPsychologist: 'Dr. Aynur Qasımova',   lastSession: '1 week ago',  nextSession: 'Tomorrow',     sessionsTotal: 8,  joinedDate: 'Apr 2025' },
  { id: 'op_04', name: 'Emma Thompson',    email: 'e.thompson@email.com',   avatarInitials: 'ET', avatarColor: 'from-rose-600/20 to-pink-600/20 text-rose-400',           status: 'Active',    priority: 'High',   treatmentTag: 'Trauma Recovery',     assignedPsychologist: 'Dr. Nicat Hüseynov',   lastSession: 'Today',       nextSession: 'Jul 7, 2026',  sessionsTotal: 31, joinedDate: 'Nov 2024' },
  { id: 'op_05', name: 'Marcus Reid',      email: 'm.reid@email.com',       avatarInitials: 'MR', avatarColor: 'from-sky-500/20 to-blue-500/20 text-sky-400',             status: 'Active',    priority: 'Normal', treatmentTag: 'Mindfulness Program', assignedPsychologist: 'Dr. Nicat Hüseynov',   lastSession: '3 days ago',  nextSession: 'Jul 4, 2026',  sessionsTotal: 6,  joinedDate: 'May 2025' },
  { id: 'op_06', name: 'Aysel Rəhimova',  email: 'a.rahimova@email.com',   avatarInitials: 'AR', avatarColor: 'from-amber-500/20 to-orange-500/20 text-amber-400',       status: 'Active',    priority: 'Medium', treatmentTag: 'Couples Therapy',     assignedPsychologist: 'Dr. Rauf Məmmədzadə',  lastSession: '1 day ago',   nextSession: 'Jul 5, 2026',  sessionsTotal: 18, joinedDate: 'Feb 2025' },
  { id: 'op_07', name: 'Tural Babayev',   email: 't.babayev@email.com',    avatarInitials: 'TB', avatarColor: 'from-emerald-500/20 to-green-500/20 text-emerald-400',    status: 'Inactive',  priority: 'Normal', treatmentTag: 'CBT Follow-up',       assignedPsychologist: 'Dr. Leyla Əliyeva',    lastSession: '3 weeks ago', nextSession: 'N/A',          sessionsTotal: 9,  joinedDate: 'Jul 2024' },
  { id: 'op_08', name: 'Lily Park',        email: 'l.park@email.com',       avatarInitials: 'LP', avatarColor: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-400',   status: 'Active',    priority: 'High',   treatmentTag: 'Depression Treatment',assignedPsychologist: 'Dr. Sevinc İsmayılova', lastSession: 'Yesterday',   nextSession: 'Jul 6, 2026',  sessionsTotal: 20, joinedDate: 'Dec 2024' },
  { id: 'op_09', name: 'Farid Əliyev',    email: 'f.aliyev@email.com',     avatarInitials: 'FƏ', avatarColor: 'from-cyan-500/20 to-teal-500/20 text-cyan-400',            status: 'Active',    priority: 'Normal', treatmentTag: 'Addiction Recovery',  assignedPsychologist: 'Dr. Rauf Məmmədzadə',  lastSession: '4 days ago',  nextSession: 'Jul 8, 2026',  sessionsTotal: 14, joinedDate: 'Jan 2025' },
  { id: 'op_10', name: 'Nina Schulz',      email: 'n.schulz@email.com',     avatarInitials: 'NS', avatarColor: 'from-indigo-500/20 to-blue-500/20 text-indigo-400',       status: 'Discharged',priority: 'Normal', treatmentTag: 'Post-therapy Review', assignedPsychologist: 'Dr. Aynur Qasımova',   lastSession: '2 months ago',nextSession: 'N/A',          sessionsTotal: 22, joinedDate: 'Aug 2024' },
]

// ─── Constants ─────────────────────────────────────────────────────────────
const PRIORITY_STYLES: Record<Priority, string> = {
  High:   'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Normal: 'bg-slate-700/40 text-slate-400 border-slate-600/20',
}

const STATUS_STYLES: Record<PatientStatus, string> = {
  Active:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Inactive:   'bg-slate-700/40 text-slate-400 border-slate-600/20',
  Discharged: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function OrgPatientsList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All')
  const [psychFilter, setPsychFilter] = useState('All')

  const allPsychs = useMemo(() => {
    const set = new Set(MOCK_ORG_PATIENTS.map((p) => p.assignedPsychologist))
    return ['All', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    return MOCK_ORG_PATIENTS.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch = !search.trim() || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.treatmentTag.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'All' || p.status === statusFilter
      const matchPriority = priorityFilter === 'All' || p.priority === priorityFilter
      const matchPsych = psychFilter === 'All' || p.assignedPsychologist === psychFilter
      return matchSearch && matchStatus && matchPriority && matchPsych
    })
  }, [search, statusFilter, priorityFilter, psychFilter])

  const stats = {
    total: MOCK_ORG_PATIENTS.length,
    active: MOCK_ORG_PATIENTS.filter((p) => p.status === 'Active').length,
    high: MOCK_ORG_PATIENTS.filter((p) => p.priority === 'High').length,
    newThisMonth: 3,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Patients</h1>
            <p className="text-xs text-slate-500 mt-0.5">All registered patients across your organization</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)] shrink-0">
          <UserPlus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients',  value: stats.total,        icon: Users,         color: 'text-teal-400',    bg: 'bg-teal-500/10 border-teal-500/20' },
          { label: 'Active',          value: stats.active,       icon: Activity,      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'High Priority',   value: stats.high,         icon: AlertCircle,   color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'New This Month',  value: stats.newThisMonth, icon: TrendingUp,    color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or treatment…"
            className="w-full pl-9 pr-4 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        {[
          { value: statusFilter, onChange: setStatusFilter, options: [['All', 'All Statuses'], ['Active', 'Active'], ['Inactive', 'Inactive'], ['Discharged', 'Discharged']] },
          { value: priorityFilter, onChange: setPriorityFilter, options: [['All', 'All Priorities'], ['High', 'High Priority'], ['Medium', 'Medium'], ['Normal', 'Normal']] },
        ].map(({ value, onChange, options }, i) => (
          <div key={i} className="relative">
            <select
              value={value}
              onChange={(e) => (onChange as (v: string) => void)(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        ))}
        <div className="relative">
          <select
            value={psychFilter}
            onChange={(e) => setPsychFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[#141521] border border-[#222437] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer max-w-[200px]"
          >
            <option value="All">All Psychologists</option>
            {allPsychs.filter((p) => p !== 'All').map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-500">
        Showing <span className="text-slate-300 font-bold">{filtered.length}</span> of <span className="text-slate-300 font-bold">{MOCK_ORG_PATIENTS.length}</span> patients
      </p>

      {/* Patient Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-500">No patients match your filters</p>
          <p className="text-xs text-slate-600 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#222437] bg-[#0e0f1a]">
            {['Patient', 'Assigned To', 'Treatment', 'Status', 'Priority', 'Next Session', ''].map((h) => (
              <span key={h} className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#1e1f30]">
            {filtered.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-[#1a1b2e]/60 transition-colors group"
              >
                {/* Patient */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${patient.avatarColor} flex items-center justify-center font-bold text-[10px] shrink-0`}>
                    {patient.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{patient.name}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">{patient.email}</p>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-300 font-semibold truncate">{patient.assignedPsychologist}</p>
                  <p className="text-[9px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" /> {patient.sessionsTotal} sessions
                  </p>
                </div>

                {/* Treatment */}
                <span className="text-[9px] font-bold text-violet-300/70 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full w-fit">
                  {patient.treatmentTag}
                </span>

                {/* Status */}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border w-fit ${STATUS_STYLES[patient.status]}`}>
                  {patient.status}
                </span>

                {/* Priority */}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border w-fit ${PRIORITY_STYLES[patient.priority]}`}>
                  {patient.priority}
                </span>

                {/* Next Session */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3 text-violet-400 shrink-0" />
                  {patient.nextSession}
                </div>

                {/* Actions */}
                <button className="text-[10px] font-bold text-slate-400 hover:text-violet-300 opacity-0 group-hover:opacity-100 transition-all cursor-pointer px-2 py-1 rounded-lg hover:bg-violet-500/10">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
