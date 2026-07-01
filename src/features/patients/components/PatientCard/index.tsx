import { Calendar, Clock, Phone, Mail, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Patient } from '../../types/patient'

interface PatientCardProps {
  patient: Patient
  onViewProfile?: (id: string) => void
}

export default function PatientCard({ patient, onViewProfile }: PatientCardProps) {
  const { t } = useTranslation()

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

  const getMoodStyles = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'anxious':
      case 'stressed':
        return 'bg-amber-500 text-amber-400'
      case 'improving':
        return 'bg-emerald-500 text-emerald-400'
      default:
        return 'bg-purple-500 text-purple-400'
    }
  }

  return (
    <div className="bg-[#141521] border border-[#222437] hover:border-[#323652] transition-all duration-300 rounded-xl shadow-md hover:shadow-lg flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Custom Initials Avatar */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${patient.avatarColor} border border-white/5 flex items-center justify-center font-bold text-sm text-white shadow-inner`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">
                {patient.name}
              </h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{patient.tag}</span>
            </div>
          </div>
          <span className={`text-[9px] font-bold border px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityStyles(patient.priority)}`}>
            {patient.priority}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 pt-1 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{patient.phone}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#222437]"></div>

        {/* Sessions Details */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{t('patients.lastSessionLabel')}</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{patient.lastSession}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{t('patients.nextSessionLabel')}</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{patient.nextSession}</span>
            </div>
          </div>
        </div>

        {/* Mood Indicator */}
        <div className="bg-[#1b1c2b] border border-[#222437] p-2.5 rounded-lg flex items-center justify-between text-xs mt-2">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">{t('patients.moodIndicator')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${getMoodStyles(patient.mood).split(' ')[0]}`}></span>
            <span className="text-white font-bold text-[10px]">{patient.mood}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 pt-1 shrink-0">
        <button
          onClick={() => onViewProfile?.(patient.id)}
          className="w-full py-2 bg-[#1b1c2b] hover:bg-[#202237] border border-[#2e3146] text-center text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          {t('patients.viewProfile')}
        </button>
      </div>

    </div>
  )
}
