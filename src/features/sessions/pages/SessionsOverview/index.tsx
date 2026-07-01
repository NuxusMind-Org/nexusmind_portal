import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Video, Clock, AlertCircle } from 'lucide-react'
import SessionItem from '../../components/SessionItem'
import SessionDetailsModal from '../../components/SessionDetailsModal'
import type { Session } from '../../types/session'

const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses_1',
    patientName: 'Emma Thompson',
    patientAvatarColor: 'from-teal-600/20 to-cyan-600/20 text-teal-400',
    time: '09:00 AM - 10:00 AM',
    date: '2026-06-30',
    dateLabel: 'Today',
    type: 'CBT Follow-up',
    status: 'Completed',
    deliveryMethod: 'Online Meeting'
  },
  {
    id: 'ses_2',
    patientName: 'Michael Davis',
    patientAvatarColor: 'from-purple-600/20 to-pink-600/20 text-purple-400',
    time: '11:00 AM - 12:00 PM',
    date: '2026-06-30',
    dateLabel: 'Today',
    type: 'Intake Assessment',
    status: 'Waiting',
    deliveryMethod: 'VR Session'
  },
  {
    id: 'ses_3',
    patientName: 'Sarah Miller',
    patientAvatarColor: 'from-teal-500/20 to-emerald-500/20 text-emerald-400',
    time: '03:00 PM - 04:00 PM',
    date: '2026-06-30',
    dateLabel: 'Today',
    type: 'CBT Follow-up',
    status: 'Scheduled',
    deliveryMethod: 'Online Meeting'
  },
  {
    id: 'ses_4',
    patientName: 'John Larson',
    patientAvatarColor: 'from-slate-700/50 to-slate-800/50 text-slate-400',
    time: '10:00 AM - 11:00 AM',
    date: '2026-07-02',
    dateLabel: 'Thursday',
    type: 'Anxiety Treatment',
    status: 'Scheduled',
    deliveryMethod: 'VR Session'
  },
  {
    id: 'ses_5',
    patientName: 'Alice Chen',
    patientAvatarColor: 'from-violet-600/20 to-indigo-600/20 text-violet-400',
    time: '02:00 PM - 03:00 PM',
    date: '2026-07-03',
    dateLabel: 'Friday',
    type: 'Grief Integration',
    status: 'Scheduled',
    deliveryMethod: 'Online Meeting'
  },
  {
    id: 'ses_6',
    patientName: 'Oliver Queen',
    patientAvatarColor: 'from-emerald-600/20 to-green-600/20 text-emerald-400',
    time: '01:00 PM - 02:00 PM',
    date: '2026-07-10',
    dateLabel: 'July 10, 2026',
    type: 'Trauma recovery',
    status: 'Scheduled',
    deliveryMethod: 'VR Session'
  },
  {
    id: 'ses_7',
    patientName: 'Tony Stark',
    patientAvatarColor: 'from-amber-600/20 to-orange-600/20 text-amber-400',
    time: '09:00 AM - 10:00 AM',
    date: '2026-07-15',
    dateLabel: 'July 15, 2026',
    type: 'Post-trauma management',
    status: 'Scheduled',
    deliveryMethod: 'Online Meeting'
  },
  {
    id: 'ses_8',
    patientName: 'Peter Parker',
    patientAvatarColor: 'from-blue-600/20 to-indigo-600/20 text-blue-400',
    time: '04:00 PM - 05:00 PM',
    date: '2026-07-18',
    dateLabel: 'July 18, 2026',
    type: 'Identity Counselling',
    status: 'Scheduled',
    deliveryMethod: 'VR Session'
  }
]

type TimeFilter = 'today' | 'week' | 'month'

export default function SessionsOverview() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS)
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('today')
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const handleJoinRoom = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session) {
      setSessions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Completed' as const } : s))
      )
      triggerFeedback(`Successfully joined telehealth room for ${session.patientName}. Mark session completed.`)
    }
  }

  const handleCancelSession = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session) {
      setSessions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Cancelled' as const } : s))
      )
      triggerFeedback(`Cancelled therapy session for ${session.patientName}.`)
    }
  }

  const handleViewDetails = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session) {
      setSelectedSession(session)
    }
  }

  const handleStartSession = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session) {
      setSessions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Waiting' as const } : s))
      )
      triggerFeedback(`Successfully initiated ${session.deliveryMethod} session for ${session.patientName}.`)
    }
  }

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Filter helper functions
  const filterSessions = (filter: TimeFilter) => {
    switch (filter) {
      case 'today':
        return sessions.filter(s => s.dateLabel === 'Today')
      case 'week':
        // Today + Thursday + Friday count as this week
        return sessions.filter(s => ['Today', 'Thursday', 'Friday'].includes(s.dateLabel))
      default:
        // Everything in our mock represents this month
        return sessions
    }
  }

  const filteredSessions = filterSessions(activeFilter)

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('sessions.directory')}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {t('sessions.subtitle')}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[#141521]/45 border border-[#222437] p-5 rounded-xl">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('sessions.todayLoad')}</span>
            <span className="text-xl font-extrabold text-white">
              {sessions.filter(s => s.dateLabel === 'Today' && s.status !== 'Cancelled').length}
            </span>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="flex justify-between items-center sm:border-l border-[#222437] sm:pl-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('sessions.weekLoad')}</span>
            <span className="text-xl font-extrabold text-white">
              {sessions.filter(s => ['Today', 'Thursday', 'Friday'].includes(s.dateLabel) && s.status !== 'Cancelled').length}
            </span>
          </div>
          <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20">
            <Calendar className="w-4.5 h-4.5" />
          </div>
        </div>
        <div className="flex justify-between items-center sm:border-l border-[#222437] sm:pl-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('sessions.monthLoad')}</span>
            <span className="text-xl font-extrabold text-white">
              {sessions.filter(s => s.status !== 'Cancelled').length}
            </span>
          </div>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Video className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Notifications Alert */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold rounded-lg animate-fade-in transition-all">
          <AlertCircle className="w-4.5 h-4.5 text-violet-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Segmented Tab Controls */}
      <div className="flex justify-start border-b border-[#222437] gap-6">
        <button
          onClick={() => setActiveFilter('today')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'today' ? 'text-white font-extrabold border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.todayTab')} ({filterSessions('today').length})
        </button>
        <button
          onClick={() => setActiveFilter('week')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'week' ? 'text-white font-extrabold border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.weekTab')} ({filterSessions('week').length})
        </button>
        <button
          onClick={() => setActiveFilter('month')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'month' ? 'text-white font-extrabold border-b-2 border-violet-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.monthTab')} ({filterSessions('month').length})
        </button>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-[#141521]/50 border border-[#222437] p-12 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-slate-400">{t('sessions.noSessions')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map(session => (
            <SessionItem 
              key={session.id} 
              session={session} 
              onJoinRoom={handleJoinRoom}
              onCancelSession={handleCancelSession}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <SessionDetailsModal 
        session={selectedSession}
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        onStartSession={handleStartSession}
      />
    </div>
  )
}
