import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ViewMode = 'day' | 'week' | 'month';

export default function Schedule() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Static mock sessions
  const mockSessions = [
    { id: 1, patient: 'Aylin Məmmədova', time: '10:00', duration: '50 min', type: 'Online' },
    { id: 2, patient: 'Nurlan Həsənov', time: '13:00', duration: '50 min', type: 'Offline' },
    { id: 3, patient: 'Leyla Əliyeva', time: '15:30', duration: '50 min', type: 'Online' },
  ];

  return (
    <div className="bg-[#11121d] border border-[#202235] rounded-xl flex flex-col h-[calc(100vh-8rem)] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#202235] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1 bg-[#141521] border border-[#2e3146] rounded-lg p-1">
            <button className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              Today
            </button>
            <button className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex p-1 bg-[#141521] border border-[#2e3146] rounded-lg">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-bold capitalize rounded-md transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#202235]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        {viewMode === 'day' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {mockSessions.length} Sessions Today
              </span>
            </div>
            
            <div className="relative">
              {/* Time grid lines */}
              <div className="absolute top-0 bottom-0 left-16 right-0 border-l border-[#202235]"></div>
              
              {/* Mock 9 AM to 5 PM */}
              {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
                <div key={hour} className="flex h-20 border-b border-[#202235]/50 relative group">
                  <div className="w-16 pr-4 text-right pt-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {hour}:00
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    {/* Render mock sessions */}
                    {mockSessions.map((session) => {
                      const sessionHour = parseInt(session.time.split(':')[0]);
                      const sessionMinutes = parseInt(session.time.split(':')[1]);
                      
                      if (sessionHour === hour) {
                        return (
                          <div 
                            key={session.id}
                            className="absolute left-2 right-4 bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 hover:border-violet-500/40 transition-colors cursor-pointer z-10 shadow-[0_4px_12px_rgba(139,92,246,0.05)]"
                            style={{ top: `${(sessionMinutes / 60) * 100}%`, height: '70px' }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-white">{session.patient}</p>
                                <p className="text-xs font-semibold text-slate-400 mt-1">{session.time} ({session.duration})</p>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                                session.type === 'Online' 
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {session.type}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                This Week
              </h3>
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                12 Sessions
              </span>
            </div>
            
            <div className="flex-1 min-h-[400px] border border-[#202235] rounded-xl overflow-hidden flex flex-col bg-[#141521]/50">
              {/* Days Header */}
              <div className="grid grid-cols-8 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
                <div className="p-3 border-r border-[#202235]"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className={`p-3 text-center border-r border-[#202235] last:border-0 ${i === 2 ? 'bg-violet-500/10 text-violet-300' : 'text-slate-400'}`}>
                    <p className="text-xs font-bold uppercase tracking-wider">{day}</p>
                    <p className={`text-lg font-black mt-1 ${i === 2 ? 'text-violet-400' : 'text-slate-300'}`}>{14 + i}</p>
                  </div>
                ))}
              </div>
              
              {/* Time Grid (scrollable) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-[#202235]/50 h-16 group hover:bg-[#1a1b2b]/50 transition-colors">
                    <div className="p-2 border-r border-[#202235] text-right flex items-start justify-end">
                      <span className="text-[10px] font-semibold text-slate-500">{hour}:00</span>
                    </div>
                    {/* 7 day columns */}
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <div key={day} className="border-r border-[#202235]/50 last:border-0 p-1 relative">
                        {/* Mock an event on Wed (2) at 10:00 */}
                        {day === 2 && hour === 10 && (
                          <div className="absolute inset-1 bg-violet-500/20 border-l-2 border-violet-500 rounded p-1.5 hover:bg-violet-500/30 transition-colors cursor-pointer z-10 overflow-hidden">
                            <p className="text-[10px] font-bold text-white leading-tight truncate">Aylin M.</p>
                            <p className="text-[9px] text-violet-300 truncate">10:00 - Online</p>
                          </div>
                        )}
                        {/* Mock an event on Mon (0) at 14:00 */}
                        {day === 0 && hour === 14 && (
                          <div className="absolute inset-1 bg-emerald-500/20 border-l-2 border-emerald-500 rounded p-1.5 hover:bg-emerald-500/30 transition-colors cursor-pointer z-10 overflow-hidden">
                            <p className="text-[10px] font-bold text-white leading-tight truncate">Rəşad Ə.</p>
                            <p className="text-[9px] text-emerald-300 truncate">14:00 - Offline</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'month' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                This Month
              </h3>
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                48 Sessions
              </span>
            </div>
            
            <div className="flex-1 min-h-[400px] border border-[#202235] rounded-xl overflow-hidden flex flex-col bg-[#141521]/50">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-3 text-center border-r border-[#202235] last:border-0 text-slate-400">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{day}</p>
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="flex-1 grid grid-cols-7 grid-rows-5">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i - 2; // Offset to simulate month starting on Thu
                  const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                  const isToday = dayNum === 16; // arbitrary today
                  const mockSessionCount = (i % 7 !== 5 && i % 7 !== 6 && isCurrentMonth && (i % 3 === 0 || i % 5 === 0)) ? (i % 3) + 1 : 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`border-r border-b border-[#202235]/50 p-2 relative hover:bg-[#1a1b2b]/80 transition-colors ${!isCurrentMonth ? 'bg-[#0f1019] opacity-50' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${isToday ? 'bg-violet-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : (isCurrentMonth ? 'text-slate-300' : 'text-slate-600')}`}>
                          {isCurrentMonth ? dayNum : (dayNum <= 0 ? 30 + dayNum : dayNum - 31)}
                        </span>
                        {mockSessionCount > 0 && (
                          <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                            {mockSessionCount}
                          </span>
                        )}
                      </div>
                      
                      {mockSessionCount > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 w-full bg-violet-500/30 rounded-full"></div>
                          {mockSessionCount > 1 && <div className="h-1.5 w-full bg-emerald-500/30 rounded-full"></div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
