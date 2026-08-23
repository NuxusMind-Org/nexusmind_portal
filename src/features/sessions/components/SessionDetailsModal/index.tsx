import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Video, Eye, Play, AlertCircle, FileText, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { appointmentService } from '../../../../api'
import type { Session } from '../../types/session'
import type { SessionNoteDto } from '../../../../types/portalDtos'

interface SessionDetailsModalProps {
  session: Session | null
  isOpen: boolean
  onClose: () => void
  onStartSession?: (id: string) => void
  onJoinRoom?: (id: string) => void
}

export default function SessionDetailsModal({
  session,
  isOpen,
  onClose,
  onStartSession,
  onJoinRoom,
}: SessionDetailsModalProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<SessionNoteDto | null>(null)
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!isOpen || !session?.id) {
      return
    }

    appointmentService
      .getAppointmentNotes(session.id)
      .then((res: SessionNoteDto) => {
        if (isMounted) {
          setNotes(res)
        }
      })
      .catch(() => {
        if (isMounted) {
          setNotes(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingNotes(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, session?.id])


  if (!isOpen || !session) return null

  const getPriorityStyles = (status: Session['status']) => {
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

  const hasSoapContent =
    Boolean(notes?.subjective || notes?.objective || notes?.assessment || notes?.plan)

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Backdrop overlay listener */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="bg-[#141521] border border-[#222437] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative flex flex-col p-6 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#1b1c2b] border border-[#2e3146] hover:border-slate-500 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            {t('sessions.overview', { defaultValue: 'Session Overview' })}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {t('sessions.reviewConfig', {
              defaultValue: 'Review clinical schedule configuration & details',
            })}
          </p>
        </div>

        {/* Patient Details Profile Row */}
        <div className="flex items-center gap-4 bg-[#1b1c2b]/50 border border-[#222437] p-4 rounded-xl">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-tr ${session.patientAvatarColor} flex items-center justify-center font-extrabold text-sm text-white shrink-0`}
          >
            {session.patientName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-white text-base truncate">{session.patientName}</h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
              {session.type}
            </span>
          </div>
        </div>

        {/* Delivery Method Accent Block */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            {t('sessions.deliveryChannel', { defaultValue: 'Delivery Channel' })}
          </span>

          {session.deliveryMethod === 'VR Session' ? (
            <div className="bg-violet-600/10 border border-violet-500/20 text-violet-400 p-4 rounded-xl flex items-start gap-3">
              <Eye className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  {t('sessions.vrExposure', { defaultValue: 'VR Exposure Therapy' })}
                </h5>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
                  {t('sessions.vrDescription', {
                    defaultValue:
                      'Conducting active virtual reality session. Headset synchronization and environment loading required prior to session launch.',
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
              <Video className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  {t('sessions.onlineCall', { defaultValue: 'Online Video Call' })}
                </h5>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
                  {t('sessions.onlineDescription', {
                    defaultValue:
                      'Conducting secure standard browser-based telehealth video call. Stable camera and microphone permissions are required.',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
          <div className="space-y-1 bg-[#1b1c2b]/30 p-3 rounded-lg border border-[#222437]/50">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              {t('sessions.scheduledTime', { defaultValue: 'Scheduled Time' })}
            </span>
            <div className="flex items-center gap-1.5 text-slate-200 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{session.time}</span>
            </div>
          </div>

          <div className="space-y-1 bg-[#1b1c2b]/30 p-3 rounded-lg border border-[#222437]/50">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              {t('sessions.scheduledDate', { defaultValue: 'Scheduled Date' })}
            </span>
            <div className="flex items-center gap-1.5 text-slate-200 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{session.dateLabel}</span>
            </div>
          </div>
        </div>

        {/* Clinical SOAP Notes (if available or completed) */}
        {isLoadingNotes ? (
          <div className="p-3 bg-[#1b1c2b]/30 border border-[#222437]/50 rounded-lg flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span>Loading clinical notes...</span>
          </div>
        ) : hasSoapContent ? (
          <div className="space-y-2 bg-[#1b1c2b]/40 border border-[#222437] p-3.5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span>Clinical Session Notes (SOAP)</span>
            </div>
            {notes?.subjective && (
              <p className="text-slate-400">
                <strong className="text-slate-300">S:</strong> {notes.subjective}
              </p>
            )}
            {notes?.objective && (
              <p className="text-slate-400">
                <strong className="text-slate-300">O:</strong> {notes.objective}
              </p>
            )}
            {notes?.assessment && (
              <p className="text-slate-400">
                <strong className="text-slate-300">A:</strong> {notes.assessment}
              </p>
            )}
            {notes?.plan && (
              <p className="text-slate-400">
                <strong className="text-slate-300">P:</strong> {notes.plan}
              </p>
            )}
          </div>
        ) : null}

        {/* Status indicator row */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {t('sessions.appointmentStatus', { defaultValue: 'Appointment Status' })}
          </span>
          <span
            className={`text-[9px] font-bold border px-3 py-1 rounded-full uppercase tracking-wider ${getPriorityStyles(
              session.status
            )}`}
          >
            {session.status}
          </span>
        </div>

        {/* Start / Join Action Triggers */}
        <div className="pt-2">
          {session.status === 'Cancelled' ? (
            <div className="flex items-center gap-1.5 p-3 bg-rose-500/5 text-rose-400 rounded-xl border border-rose-500/10 text-[10px] leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>
                {t('sessions.sessionCancelled', {
                  defaultValue: 'This session was cancelled and cannot be started.',
                })}
              </span>
            </div>
          ) : session.status === 'Waiting' ? (
            <button
              onClick={() => {
                onJoinRoom?.(session.id)
                onClose()
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-white" />
              <span>{t('sessions.joinRoom', { defaultValue: 'Join Telehealth Room' })}</span>
            </button>
          ) : session.status === 'Scheduled' ? (
            <button
              onClick={() => {
                onStartSession?.(session.id)
                onClose()
              }}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)] flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              <span>{t('sessions.startSession', { defaultValue: 'Start Session' })}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 p-3 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/10 text-[10px] leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                {t('sessions.sessionCompleted', {
                  defaultValue: 'This session has been completed.',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

