import { X, Mail, Phone, Calendar, Clock, User, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Patient } from '../../types/patient'

interface PatientDetailsModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
  onScheduleSession?: (id: string) => void
}

export default function PatientDetailsModal({ patient, isOpen, onClose, onScheduleSession }: PatientDetailsModalProps) {
  const { t } = useTranslation()

  if (!isOpen || !patient) return null

  const getPriorityStyles = (priority: Patient['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const getStatusStyles = (status: Patient['status']) => {
    switch (status) {
      case 'Active':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'On Hold':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    }
  }

  const getMoodStyles = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'anxious':
      case 'stressed':
        return 'bg-amber-500'
      case 'improving':
        return 'bg-emerald-500'
      default:
        return 'bg-purple-500'
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="bg-[#141521] border border-[#222437] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative flex flex-col p-6 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#1b1c2b] border border-[#2e3146] hover:border-slate-500 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">{t('patients.profileOverview', { defaultValue: 'Patient Profile Overview' })}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">{t('patients.caseloadRecords', { defaultValue: 'Clinical caseload directory records' })}</p>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 bg-[#1b1c2b]/50 border border-[#222437] p-4 rounded-xl">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${patient.avatarColor} flex items-center justify-center font-extrabold text-sm text-white shadow-inner`}>
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-bold text-white text-base">{patient.name}</h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">{patient.tag}</span>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase tracking-widest">{t('patients.statusLabel', { defaultValue: 'Status:' })}</span>
            <span className={`border px-2 py-0.5 rounded uppercase tracking-wider ${getStatusStyles(patient.status)}`}>
              {patient.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-slate-500 uppercase tracking-widest">{t('patients.priorityLabel')}</span>
            <span className={`border px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityStyles(patient.priority)}`}>
              {patient.priority}
            </span>
          </div>
        </div>

        {/* Clinical data block */}
        <div className="space-y-3 bg-[#1b1c2b]/30 p-4 rounded-xl border border-[#222437]/50 text-xs font-semibold text-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest">{t('patients.emailLabel', { defaultValue: 'Email' })}</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{patient.email}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest">{t('patients.phoneLabel', { defaultValue: 'Phone' })}</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{patient.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest">{t('patients.lastSessionLabel')}</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{patient.lastSession}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest">{t('patients.nextSessionLabel')}</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{patient.nextSession}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#222437] pt-2 mt-1">
            <span className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {t('patients.moodState', { defaultValue: 'Mood State' })}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getMoodStyles(patient.mood)}`}></span>
              <span className="text-white font-bold">{patient.mood}</span>
            </div>
          </div>
        </div>

        {/* Clinical SOAP Notes details */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
            {t('patients.clinicalRecords', { defaultValue: 'Clinical Intake Records' })}
          </span>
          <div className="p-3 bg-[#1b1c2b]/30 rounded-lg border border-[#222437]/50 text-[11px] font-semibold text-slate-300 leading-relaxed">
            {t('patients.recordsDescription', { defaultValue: 'Case primary diagnostics focus covers anxiety regulation, CBT coping schemas, and stress integration. Patient currently exhibits strong cognitive resilience, practicing breathing protocols and daily journaling.' })}
          </div>
        </div>

        {/* Schedule session action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onScheduleSession?.(patient.id)
              onClose()
            }}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)] flex items-center justify-center gap-1.5"
          >
            {t('patients.scheduleSession', { defaultValue: 'Schedule Therapy Session' })}
          </button>
        </div>

      </div>
    </div>
  )
}
