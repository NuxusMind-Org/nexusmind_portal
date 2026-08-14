import { useTranslation } from 'react-i18next';
import Schedule from '../../components/Schedule';
import Notebook from '../../components/Notebook';
import ClockWidget from '../../components/ClockWidget';

export function PsychologistDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto h-full flex flex-col relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
            Psychologist Panel
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              WORKSPACE
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-400 tracking-wide mt-1">
            Manage your schedule and take quick notes for your sessions.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 relative z-10">
        
        {/* Left Column: Schedule (Takes 8 cols out of 12) */}
        <div className="lg:col-span-8 h-full min-h-0">
          <Schedule />
        </div>

        {/* Right Column: Clock Widget & Notebook (Takes 4 cols out of 12) */}
        <div className="lg:col-span-4 h-full min-h-0 flex flex-col gap-6">
          <ClockWidget />
          <Notebook />
        </div>
        
      </div>
    </div>
  );
}
