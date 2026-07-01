import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, UserPlus, SlidersHorizontal, AlertCircle } from 'lucide-react'
import PatientCard from '../../components/PatientCard'
import PatientDetailsModal from '../../components/PatientDetailsModal'
import type { Patient } from '../../types/patient'

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat_1',
    name: 'Sarah Miller',
    email: 's.miller@bpm.com',
    phone: '+1 (555) 019-2834',
    avatarColor: 'from-teal-500/20 to-emerald-500/20 text-emerald-400',
    status: 'Active',
    priority: 'Medium',
    tag: 'CBT Follow-up',
    lastSession: '2 days ago',
    nextSession: 'July 3, 2026',
    mood: 'Improving'
  },
  {
    id: 'pat_2',
    name: 'John Larson',
    email: 'j.larson@bpm.com',
    phone: '+1 (555) 014-9821',
    avatarColor: 'from-slate-700/50 to-slate-800/50 text-slate-400',
    status: 'Active',
    priority: 'High',
    tag: 'Anxiety Treatment',
    lastSession: '5 days ago',
    nextSession: 'July 2, 2026',
    mood: 'Anxious'
  },
  {
    id: 'pat_3',
    name: 'Alice Chen',
    email: 'a.chen@bpm.com',
    phone: '+1 (555) 012-7744',
    avatarColor: 'from-violet-600/20 to-indigo-600/20 text-violet-400',
    status: 'Active',
    priority: 'Normal',
    tag: 'Grief Integration',
    lastSession: '1 week ago',
    nextSession: 'Tomorrow',
    mood: 'Stable'
  },
  {
    id: 'pat_4',
    name: 'Emma Thompson',
    email: 'e.thompson@bpm.com',
    phone: '+1 (555) 015-8833',
    avatarColor: 'from-teal-600/20 to-cyan-600/20 text-teal-400',
    status: 'Active',
    priority: 'Normal',
    tag: 'Depression Therapy',
    lastSession: 'Today (09:00 AM)',
    nextSession: 'July 7, 2026',
    mood: 'Improving'
  },
  {
    id: 'pat_5',
    name: 'Michael Davis',
    email: 'm.davis@bpm.com',
    phone: '+1 (555) 018-4422',
    avatarColor: 'from-purple-600/20 to-pink-600/20 text-purple-400',
    status: 'Active',
    priority: 'High',
    tag: 'Intake Assessment',
    lastSession: 'Pending (11:00 AM)',
    nextSession: 'Today (11:00 AM)',
    mood: 'Stressed'
  }
]

export default function PatientsList() {
  const { t } = useTranslation()
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<string>('All')
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleAddPatient = () => {
    // Prevent adding duplicates
    if (patients.some(p => p.id === 'pat_new')) return

    const newPatient: Patient = {
      id: 'pat_new',
      name: 'Oliver Queen',
      email: 'o.queen@bpm.com',
      phone: '+1 (555) 017-7654',
      avatarColor: 'from-emerald-600/20 to-green-600/20 text-emerald-400',
      status: 'Active',
      priority: 'Medium',
      tag: 'Trauma recovery',
      lastSession: 'N/A',
      nextSession: 'July 10, 2026',
      mood: 'Stable'
    }

    setPatients([newPatient, ...patients])
    triggerFeedback('Success: Patient Oliver Queen added successfully!')
  }

  const handleViewProfile = (id: string) => {
    const p = patients.find(p => p.id === id)
    if (p) {
      setSelectedPatient(p)
    }
  }

  const handleScheduleSession = (id: string) => {
    const p = patients.find(p => p.id === id)
    if (p) {
      triggerFeedback(`Successfully requested session scheduling slot for ${p.name}.`)
    }
  }

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Filter patients based on search query and priority dropdown
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.tag.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPriority = 
      selectedPriority === 'All' || 
      patient.priority === selectedPriority

    return matchesSearch && matchesPriority
  })

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('patients.directory')}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {t('patients.subtitle')}
          </p>
        </div>
        <button 
          onClick={handleAddPatient}
          className="flex items-center gap-2 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>{t('patients.addPatient')}</span>
        </button>
      </div>

      {/* Caseload Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#141521]/45 border border-[#222437] p-5 rounded-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('patients.totalCaseActive')}</span>
          <span className="text-xl font-extrabold text-white">{patients.length}</span>
        </div>
        <div className="space-y-1 border-l border-[#222437] pl-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('patients.highPriority')}</span>
          <span className="text-xl font-extrabold text-rose-400">{patients.filter(p => p.priority === 'High').length}</span>
        </div>
        <div className="space-y-1 border-l border-[#222437] pl-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('patients.needNotesToday')}</span>
          <span className="text-xl font-extrabold text-amber-500">1</span>
        </div>
        <div className="space-y-1 border-l border-[#222437] pl-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('patients.completedWeekly')}</span>
          <span className="text-xl font-extrabold text-emerald-400">4</span>
        </div>
      </div>

      {/* Interactive Action Notifications */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold rounded-lg animate-fade-in transition-all">
          <AlertCircle className="w-4.5 h-4.5 text-violet-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter Control Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={t('patients.searchBarPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141521] border border-[#2e3146] focus:border-violet-500 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Filters dropdown */}
        <div className="w-full sm:w-auto flex items-center gap-3 justify-end shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('patients.priorityLabel')}</span>
          </div>
          <select 
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#141521] border border-[#2e3146] text-xs font-bold text-slate-300 py-2.5 px-4 rounded-lg focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="All">{t('patients.allCaseload')}</option>
            <option value="High">{t('patients.highPriorityFilter')}</option>
            <option value="Medium">{t('patients.mediumPriority')}</option>
            <option value="Normal">{t('patients.normalPriority')}</option>
          </select>
        </div>

      </div>

      {/* Grid List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-[#141521]/50 border border-[#222437] p-12 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-slate-400">{t('patients.noPatients')}</p>
          <p className="text-xs text-slate-500 font-medium">{t('patients.clearFilters')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}

      <PatientDetailsModal 
        patient={selectedPatient}
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
        onScheduleSession={handleScheduleSession}
      />
    </div>
  )
}
