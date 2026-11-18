import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, DollarSign } from 'lucide-react';
import Schedule from '../../components/Schedule';
import Notebook from '../../components/Notebook';
import ClockWidget from '../../components/ClockWidget';
import { DoctorPricesPanel } from '../../components/DoctorPricesPanel';

export function PsychologistDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'schedule' | 'pricing'>('schedule');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto h-full flex flex-col relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
            {t('psychologistDashboard.panelTitle', { defaultValue: 'Psychologist Panel' })}
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {t('psychologistDashboard.workspaceBadge', { defaultValue: 'WORKSPACE' })}
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-400 tracking-wide mt-1">
            {t('psychologistDashboard.panelSubtitle', { defaultValue: 'Manage your schedule and take quick notes for your sessions.' })}
          </p>
        </div>

        {/* Workspace Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#141521] border border-[#2e3146] p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b1c2b]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('psychologistDashboard.tabSchedule', { defaultValue: 'Cədvəl' })}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b1c2b]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t('pricing.tabLabel', { defaultValue: 'Seans Tarifləri' })}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      {activeTab === 'schedule' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 relative z-10">
          {/* Left Column: Schedule (Takes 8 cols out of 12) */}
          <div className="lg:col-span-8 min-h-0 lg:h-full">
            <Schedule />
          </div>

          {/* Right Column: Clock Widget & Notebook (Takes 4 cols out of 12) */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-h-[480px] lg:h-full lg:min-h-0">
            <ClockWidget />
            <Notebook />
          </div>
        </div>
      ) : (
        <div className="flex-1 relative z-10">
          <DoctorPricesPanel />
        </div>
      )}
    </div>
  );
}
