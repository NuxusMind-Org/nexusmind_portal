import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { doctorService } from '../../../../api';
import type { SaveScheduleRequest, DaySchedule, DayOfWeek } from '../../../../types/portalDtos';

dayjs.extend(isoWeek);

export function PsychologistCalendar() {
  const [selectedHours, setSelectedHours] = useState<Record<string, boolean>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('isoWeek'));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hours = Array.from({ length: 24 }).map((_, i) => i);

  // Generate the 7 days of the currently selected week
  const weekDays = Array.from({ length: 7 }).map((_, i) => currentWeekStart.add(i, 'day'));

  // Fetch saved working hours on mount and whenever the week view changes,
  // mapping dayOfWeek names back to the concrete dates of the visible week.
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await doctorService.getMyWorkingHours();
        const newSelected: Record<string, boolean> = {};

        (response.days ?? []).forEach(({ dayOfWeek, hours }) => {
          // Find the day in the current week that matches this dayOfWeek name
          const day = weekDays.find(
            d => d.format('dddd').toUpperCase() === dayOfWeek
          );
          if (!day || !hours?.length) return;
          const dateStr = day.format('YYYY-MM-DD');
          hours.forEach(hour => {
            newSelected[`${dateStr}-${hour}`] = true;
          });
        });

        setSelectedHours(newSelected);
      } catch (error) {
        console.error('Failed to fetch working hours:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [currentWeekStart]);

  const toggleHour = (dateStr: string, hour: number) => {
    const key = `${dateStr}-${hour}`;
    setSelectedHours(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getActiveCount = () => Object.values(selectedHours).filter(Boolean).length;

  const nextWeek = () => setCurrentWeekStart(prev => prev.add(1, 'week'));
  const prevWeek = () => setCurrentWeekStart(prev => prev.subtract(1, 'week'));
  const thisWeek = () => setCurrentWeekStart(dayjs().startOf('isoWeek'));

  const DAY_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      // Group selected hours by day-of-week
      const daysMap = new Map<DayOfWeek, number[]>();
      DAY_ORDER.forEach(day => daysMap.set(day, []));

      Object.entries(selectedHours).forEach(([key, isSelected]) => {
        if (!isSelected) return;
        // key format: "YYYY-MM-DD-H" — date parts are first 3 segments, hour is last
        const parts = key.split('-');
        const hour = parseInt(parts[parts.length - 1], 10);
        const dateStr = parts.slice(0, 3).join('-');
        const dayOfWeek = dayjs(dateStr).format('dddd').toUpperCase() as DayOfWeek;
        daysMap.get(dayOfWeek)?.push(hour);
      });

      const days: DaySchedule[] = DAY_ORDER.map(day => ({
        dayOfWeek: day,
        hours: (daysMap.get(day) ?? []).sort((a, b) => a - b),
      }));

      const payload: SaveScheduleRequest = { days };
      await doctorService.saveMyWorkingHours(payload);
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('Failed to save schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto h-full flex flex-col relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            Working Hours
          </h1>
          <p className="text-sm font-semibold text-slate-400 tracking-wide mt-1">
            Set your weekly availability. These hours will be shown to patients for booking.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Week Navigation */}
          <div className="flex items-center gap-1 bg-[#141521] border border-[#2e3146] rounded-lg p-1">
            <button onClick={prevWeek} className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={thisWeek} className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              {currentWeekStart.format('MMM D')} - {currentWeekStart.add(6, 'day').format('MMM D, YYYY')}
            </button>
            <button onClick={nextWeek} className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 border-l-0 sm:border-l border-[#202235] pl-0 sm:pl-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {getActiveCount()} Hours Selected
            </span>
            <button 
              onClick={handleSaveSchedule}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide uppercase transition-all rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-[#11121d] border border-[#202235] rounded-xl overflow-hidden shadow-lg relative z-10 flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 bg-[#11121d]/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-8 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
          <div className="p-4 border-r border-[#202235]"></div>
          {weekDays.map(day => {
            const isToday = day.isSame(dayjs(), 'day');
            return (
              <div key={day.format('YYYY-MM-DD')} className="p-3 text-center border-r border-[#202235] last:border-0 flex flex-col items-center justify-center">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {day.format('ddd')}
                </p>
                <p className={`text-lg font-black mt-0.5 ${isToday ? 'text-white' : 'text-slate-300'}`}>
                  {day.format('D')}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-[#202235]/50 hover:bg-[#1a1b2b]/50 transition-colors h-16">
              <div className="p-3 border-r border-[#202235] flex items-center justify-end">
                <span className="text-xs font-semibold text-slate-500">{hour}:00</span>
              </div>
              {weekDays.map(day => {
                const dateStr = day.format('YYYY-MM-DD');
                const key = `${dateStr}-${hour}`;
                const isSelected = selectedHours[key];
                return (
                  <div 
                    key={dateStr} 
                    onClick={() => toggleHour(dateStr, hour)}
                    className={`border-r border-[#202235]/50 last:border-0 p-1 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-500/10' : 'hover:bg-[#1c1d2e]/50'
                    }`}
                  >
                    <div className={`w-full h-full rounded-md flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'border border-dashed border-[#202235]/0 hover:border-slate-600/50'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
