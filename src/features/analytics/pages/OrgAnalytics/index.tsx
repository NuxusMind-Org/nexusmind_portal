import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Star,
  Activity,
  UserSquare2,
  Calendar,
  CheckCircle2,
  UserPlus,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────
interface MonthlyBar {
  month: string
  sessions: number
  completed: number
}

interface TopPsychologist {
  name: string
  initials: string
  color: string
  sessions: number
  patients: number
  satisfaction: number
}

interface RecentActivity {
  id: string
  type: 'session_complete' | 'new_patient' | 'session_scheduled'
  description: string
  time: string
  psychologist?: string
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MONTHLY_DATA: MonthlyBar[] = [
  { month: 'Jan', sessions: 82,  completed: 76 },
  { month: 'Feb', sessions: 94,  completed: 88 },
  { month: 'Mar', sessions: 110, completed: 103 },
  { month: 'Apr', sessions: 98,  completed: 91 },
  { month: 'May', sessions: 125, completed: 118 },
  { month: 'Jun', sessions: 142, completed: 135 },
  { month: 'Jul', sessions: 67,  completed: 63 },
]

const TOP_PSYCHOLOGISTS: TopPsychologist[] = [
  { name: 'Dr. Sevinc İsmayılova', initials: 'Sİ', color: 'from-sky-500/20 to-blue-500/20 text-sky-300',        sessions: 203, patients: 20, satisfaction: 98 },
  { name: 'Dr. Nicat Hüseynov',    initials: 'NH', color: 'from-teal-500/20 to-emerald-500/20 text-teal-300',    sessions: 219, patients: 22, satisfaction: 94 },
  { name: 'Dr. Rauf Məmmədzadə',   initials: 'RM', color: 'from-amber-500/20 to-orange-500/20 text-amber-300',   sessions: 177, patients: 16, satisfaction: 96 },
  { name: 'Dr. Leyla Əliyeva',     initials: 'LƏ', color: 'from-violet-500/20 to-indigo-500/20 text-violet-300', sessions: 142, patients: 18, satisfaction: 97 },
  { name: 'Dr. Aynur Qasımova',    initials: 'AQ', color: 'from-rose-500/20 to-pink-500/20 text-rose-300',       sessions: 98,  patients: 14, satisfaction: 92 },
]

const RECENT_ACTIVITY: RecentActivity[] = [
  { id: 'a1', type: 'session_complete',  description: 'Session completed with John Larson',       time: '12 min ago', psychologist: 'Dr. Sevinc İsmayılova' },
  { id: 'a2', type: 'new_patient',       description: 'New patient Lily Park registered',          time: '1 hr ago' },
  { id: 'a3', type: 'session_complete',  description: 'Session completed with Aysel Rəhimova',    time: '2 hr ago', psychologist: 'Dr. Rauf Məmmədzadə' },
  { id: 'a4', type: 'session_scheduled', description: 'Session scheduled for Emma Thompson',       time: '3 hr ago', psychologist: 'Dr. Nicat Hüseynov' },
  { id: 'a5', type: 'new_patient',       description: 'New patient Farid Əliyev registered',      time: '5 hr ago' },
  { id: 'a6', type: 'session_complete',  description: 'Session completed with Sarah Miller',       time: '6 hr ago', psychologist: 'Dr. Leyla Əliyeva' },
]

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function SessionBarChart() {
  const maxVal = Math.max(...MONTHLY_DATA.map((d) => d.sessions))
  const chartH = 120
  const barW = 28
  const gap = 16

  return (
    <div className="overflow-x-auto">
      <svg
        width={MONTHLY_DATA.length * (barW + gap) + gap}
        height={chartH + 40}
        className="min-w-full"
      >
        {MONTHLY_DATA.map((d, i) => {
          const x = gap + i * (barW + gap)
          const totalH = (d.sessions / maxVal) * chartH
          const completedH = (d.completed / maxVal) * chartH
          const isCurrentMonth = d.month === 'Jul'

          return (
            <g key={d.month}>
              {/* Total bar (background) */}
              <rect
                x={x}
                y={chartH - totalH}
                width={barW}
                height={totalH}
                rx={4}
                className={isCurrentMonth ? 'fill-violet-500/20' : 'fill-[#1b1c2b]'}
              />
              {/* Completed bar (foreground) */}
              <rect
                x={x}
                y={chartH - completedH}
                width={barW}
                height={completedH}
                rx={4}
                className={isCurrentMonth ? 'fill-violet-500' : 'fill-violet-500/50'}
              />
              {/* Month label */}
              <text
                x={x + barW / 2}
                y={chartH + 20}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize={10}
                fontWeight={isCurrentMonth ? 700 : 500}
              >
                {d.month}
              </text>
              {/* Value label */}
              <text
                x={x + barW / 2}
                y={chartH - completedH - 6}
                textAnchor="middle"
                className={isCurrentMonth ? 'fill-violet-300' : 'fill-slate-500'}
                fontSize={9}
                fontWeight={600}
              >
                {d.sessions}
              </text>
            </g>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-violet-500/50" />
          <span className="text-[10px] text-slate-500">Total Sessions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-violet-500" />
          <span className="text-[10px] text-slate-500">Completed</span>
        </div>
      </div>
    </div>
  )
}

// ─── Patient Status Donut ────────────────────────────────────────────────────
function PatientStatusDonut() {
  const segments = [
    { label: 'Active',     value: 72, color: '#10b981', trackColor: 'bg-emerald-500' },
    { label: 'Inactive',   value: 18, color: '#6b7280', trackColor: 'bg-slate-500' },
    { label: 'High Risk',  value: 10, color: '#f43f5e', trackColor: 'bg-rose-500' },
  ]

  const size = 120
  const strokeW = 18
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex items-center gap-8">
      <div className="relative shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1b1c2b" strokeWidth={strokeW} />
          {segments.map((seg) => {
            const dash = (seg.value / 100) * circ
            const el = (
              <circle
                key={seg.label}
                cx={size/2} cy={size/2} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeW}
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += dash
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">100</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase">Patients</span>
        </div>
      </div>
      <div className="space-y-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${seg.trackColor}`} />
            <div>
              <p className="text-xs font-bold text-slate-200">{seg.label}</p>
              <p className="text-[10px] text-slate-500">{seg.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Icon ──────────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  if (type === 'session_complete')  return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
  if (type === 'new_patient')       return <UserPlus className="w-4 h-4 text-violet-400" />
  return <Calendar className="w-4 h-4 text-sky-400" />
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrgAnalytics() {
  const kpiCards = [
    { label: 'Sessions This Month', value: '142', delta: '+14%', icon: Calendar,    color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', positive: true },
    { label: 'Satisfaction Rate',   value: '95%', delta: '+2%',  icon: Star,        color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',   positive: true },
    { label: 'Active Patients',     value: '72',  delta: '+5',   icon: Users,       color: 'text-teal-400',   bg: 'bg-teal-500/10 border-teal-500/20',     positive: true },
    { label: 'Avg Session Duration',value: '51m', delta: '-3m',  icon: Clock,       color: 'text-sky-400',    bg: 'bg-sky-500/10 border-sky-500/20',       positive: false },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Organization performance overview — BPM · July 2026</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, delta, icon: Icon, color, bg, positive }) => (
          <div key={label} className="bg-[#141521] border border-[#222437] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${bg}`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                positive
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}>
                {delta}
              </span>
            </div>
            <div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-[#141521] border border-[#222437] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Session Volume</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Total vs completed sessions per month</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-[#1b1c2b] border border-[#2e3146] rounded-lg">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400">+23% YoY</span>
            </div>
          </div>
          <SessionBarChart />
        </div>

        {/* Patient Status Donut */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Patient Status</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Breakdown across all enrolled patients</p>
          </div>
          <PatientStatusDonut />

          {/* Quick metric */}
          <div className="pt-3 border-t border-[#222437] flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Retention Rate</span>
            <span className="text-sm font-bold text-emerald-400">88%</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Psychologists Table */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#222437] flex items-center gap-2">
            <UserSquare2 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-slate-200">Top Psychologists</h3>
          </div>
          <div className="divide-y divide-[#1e1f30]">
            {TOP_PSYCHOLOGISTS.map((psy, i) => (
              <div key={psy.name} className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a1b2e]/60 transition-colors">
                <span className="text-[10px] font-bold text-slate-600 w-4">{i + 1}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${psy.color} flex items-center justify-center font-bold text-[10px] shrink-0`}>
                  {psy.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{psy.name}</p>
                  <p className="text-[9px] text-slate-500">{psy.patients} patients · {psy.sessions} sessions</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{(psy.satisfaction / 20).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#222437] flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-slate-200">Recent Activity</h3>
          </div>
          <div className="divide-y divide-[#1e1f30]">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#1a1b2e]/60 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#1b1c2b] border border-[#2e3146] flex items-center justify-center shrink-0 mt-0.5">
                  <ActivityIcon type={item.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200">{item.description}</p>
                  {item.psychologist && (
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.psychologist}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-600 shrink-0 mt-0.5 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
