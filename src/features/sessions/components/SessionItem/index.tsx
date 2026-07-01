import { Calendar, Clock, Video, FileText, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Session } from '../../types/session'

interface SessionItemProps {
  session: Session
  onJoinRoom?: (id: string) => void
  onCancelSession?: (id: string) => void
  onViewDetails?: (id: string) => void
}

export default function SessionItem({ session, onJoinRoom, onCancelSession, onViewDetails }: SessionItemProps) {
  const { t } = useTranslation()

  const getStatusStyles = (status: Session['status']) => {
    switch (status) {
      case 'Completed':
        return 'text-slate-400 bg-slate-800/60 border-slate-700/50'
      case 'Waiting':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'Cancelled':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    }
  }

  return (
    <div 
      onClick={() => session.status !== 'Cancelled' && onViewDetails?.(session.id)}
      className={`bg-[#141521] border ${session.status === 'Cancelled' ? 'border-rose-500/10 opacity-60' : 'border-[#222437] hover:border-[#323652] cursor-pointer'} transition-all p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
    >
      
      {/* Date & Time Column */}
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2 md:gap-1 text-slate-400 text-xs shrink-0 w-full md:w-36 md:border-r border-[#222437] md:pr-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-white text-sm">{session.time}</span>
        </div>
        <div className="flex items-center gap-2 md:mt-0.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500 md:hidden" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{session.dateLabel}</span>
        </div>
      </div>

      {/* Patient Details */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${session.patientAvatarColor} flex items-center justify-center font-bold text-xs text-white shrink-0`}>
          {session.patientName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-white text-sm truncate">{session.patientName}</h4>
          <p className="text-xs text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{session.type}</p>
        </div>
      </div>

      {/* Status Pill */}
      <div className="shrink-0 flex items-center gap-2">
        <span className={`text-[9px] font-bold border px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${getStatusStyles(session.status)}`}>
          {session.status === 'Waiting' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
          {session.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-[#222437] pt-3 md:pt-0">
        {session.status === 'Waiting' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onJoinRoom?.(session.id)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_10px_rgba(16,185,129,0.15)]"
          >
            <Video className="w-3.5 h-3.5 text-white" />
            <span>{t('sessions.joinRoom')}</span>
          </button>
        )}
        
        {session.status === 'Completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.(session.id)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#202237] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('sessions.reviewSummary')}</span>
          </button>
        )}

        {session.status === 'Scheduled' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.(session.id)
            }}
            className="px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#202237] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            {t('sessions.details')}
          </button>
        )}

        {(session.status === 'Scheduled' || session.status === 'Waiting') && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCancelSession?.(session.id)
            }}
            className="p-1.5 bg-[#1b1c2b] hover:bg-rose-500/10 border border-[#2e3146] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
            title="Cancel Session"
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  )
}
