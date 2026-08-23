import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Video, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import SessionItem from '../../components/SessionItem'
import SessionDetailsModal from '../../components/SessionDetailsModal'
import type { Session, TimeFilter } from '../../types/session'
import { useSessions } from '../../hooks/useSessions'

export default function SessionsOverview() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('today')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const {
    isLoading,
    error,
    feedbackMsg,
    todaySessions,
    weekSessions,
    monthSessions,
    todayActiveCount,
    weekActiveCount,
    monthActiveCount,
    getSessionsForFilter,
    handleJoinRoom,
    handleCancelSession,
    handleStartSession,
    refreshSessions,
  } = useSessions()

  const handleViewDetails = (id: string) => {
    const all = [...todaySessions, ...weekSessions, ...monthSessions]
    const session = all.find((s) => s.id === id)
    if (session) {
      setSelectedSession(session)
    }
  }

  const filteredSessions = getSessionsForFilter(activeFilter)

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshSessions()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141521] hover:bg-[#1b1c2b] border border-[#222437] hover:border-slate-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Sessions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
            <span>Yenilə</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[#141521]/45 border border-[#222437] p-5 rounded-xl">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('sessions.todayLoad')}
            </span>
            <span className="text-xl font-extrabold text-white">
              {isLoading ? (
                <span className="inline-block w-8 h-6 bg-slate-700/50 animate-pulse rounded"></span>
              ) : (
                todayActiveCount
              )}
            </span>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="flex justify-between items-center sm:border-l border-[#222437] sm:pl-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('sessions.weekLoad')}
            </span>
            <span className="text-xl font-extrabold text-white">
              {isLoading ? (
                <span className="inline-block w-8 h-6 bg-slate-700/50 animate-pulse rounded"></span>
              ) : (
                weekActiveCount
              )}
            </span>
          </div>
          <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20">
            <Calendar className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="flex justify-between items-center sm:border-l border-[#222437] sm:pl-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('sessions.monthLoad')}
            </span>
            <span className="text-xl font-extrabold text-white">
              {isLoading ? (
                <span className="inline-block w-8 h-6 bg-slate-700/50 animate-pulse rounded"></span>
              ) : (
                monthActiveCount
              )}
            </span>
          </div>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Video className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Notifications / Feedback Toast Alert */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold rounded-lg animate-fade-in transition-all">
          <AlertCircle className="w-4.5 h-4.5 text-violet-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between gap-2 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refreshSessions()}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            Yenidən yoxla
          </button>
        </div>
      )}

      {/* Segmented Tab Controls */}
      <div className="flex justify-start border-b border-[#222437] gap-6">
        <button
          onClick={() => setActiveFilter('today')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'today'
              ? 'text-white font-extrabold border-b-2 border-violet-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.todayTab')} ({todaySessions.length})
        </button>
        <button
          onClick={() => setActiveFilter('week')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'week'
              ? 'text-white font-extrabold border-b-2 border-violet-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.weekTab')} ({weekSessions.length})
        </button>
        <button
          onClick={() => setActiveFilter('month')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
            activeFilter === 'month'
              ? 'text-white font-extrabold border-b-2 border-violet-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('sessions.monthTab')} ({monthSessions.length})
        </button>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((skeletonIdx) => (
            <div
              key={skeletonIdx}
              className="bg-[#141521]/60 border border-[#222437] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse"
            >
              <div className="w-32 h-10 bg-slate-800/50 rounded-lg"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-full bg-slate-800/70"></div>
                <div className="space-y-2">
                  <div className="w-32 h-3.5 bg-slate-800/70 rounded"></div>
                  <div className="w-20 h-2.5 bg-slate-800/50 rounded"></div>
                </div>
              </div>
              <div className="w-20 h-6 bg-slate-800/50 rounded-full"></div>
              <div className="w-24 h-8 bg-slate-800/60 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#141521]/50 border border-[#222437] p-12 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-slate-400">{t('sessions.noSessions')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
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
        onJoinRoom={handleJoinRoom}
      />
    </div>
  )
}

