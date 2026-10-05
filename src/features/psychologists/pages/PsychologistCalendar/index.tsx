import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { doctorService } from '../../../../api';
import type { SaveWeeklyTemplateRequest, DaySchedule, DayOfWeek } from '../../../../types/portalDtos';

dayjs.extend(isoWeek);

interface DayConfig {
  key: DayOfWeek;
  azName: string;
  shortAz: string;
  shortEn: string;
  isoIndex: number; // 0 for Monday, 6 for Sunday
}

const WEEK_DAYS_CONFIG: DayConfig[] = [
  { key: 'MONDAY', azName: 'Bazar ertəsi', shortAz: 'B.E', shortEn: 'MON', isoIndex: 0 },
  { key: 'TUESDAY', azName: 'Çərşənbə axşamı', shortAz: 'Ç.A', shortEn: 'TUE', isoIndex: 1 },
  { key: 'WEDNESDAY', azName: 'Çərşənbə', shortAz: 'ÇƏR', shortEn: 'WED', isoIndex: 2 },
  { key: 'THURSDAY', azName: 'Cümə axşamı', shortAz: 'C.A', shortEn: 'THU', isoIndex: 3 },
  { key: 'FRIDAY', azName: 'Cümə', shortAz: 'CÜM', shortEn: 'FRI', isoIndex: 4 },
  { key: 'SATURDAY', azName: 'Şənbə', shortAz: 'ŞƏN', shortEn: 'SAT', isoIndex: 5 },
  { key: 'SUNDAY', azName: 'Bazar', shortAz: 'BAZ', shortEn: 'SUN', isoIndex: 6 },
];

export function PsychologistCalendar() {
  // Key format: `${dayOfWeek}-${hour}`, e.g. "MONDAY-9", "SUNDAY-14"
  const [selectedHours, setSelectedHours] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active week bounds (Monday to Sunday) for reference
  const currentWeekStart = useMemo(() => dayjs().startOf('isoWeek'), []);
  const currentWeekEnd = useMemo(() => currentWeekStart.add(6, 'day'), [currentWeekStart]);

  // Hours of the day available for configuration (00:00 to 23:00)
  const hours = useMemo(() => Array.from({ length: 24 }).map((_, i) => i), []);

  // Fetch saved weekly working hours from GET /doctors/me/working-hours/template
  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await doctorService.getMyWorkingHours();
      const newSelected: Record<string, boolean> = {};

      (response.days ?? []).forEach(({ dayOfWeek, hours: dayHours }) => {
        if (!dayOfWeek || !Array.isArray(dayHours)) return;
        dayHours.forEach((hour) => {
          if (typeof hour === 'number' && hour >= 0 && hour <= 23) {
            newSelected[`${dayOfWeek}-${hour}`] = true;
          }
        });
      });

      setSelectedHours(newSelected);
    } catch (error: unknown) {
      console.error('Failed to fetch working hours template:', error);
      const errMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Həftəlik iş saatlarını serverdən yükləmək mümkün olmadı.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const toggleHour = (dayOfWeek: DayOfWeek, hour: number) => {
    const key = `${dayOfWeek}-${hour}`;
    setSelectedHours((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getActiveCount = () => Object.values(selectedHours).filter(Boolean).length;

  const getDayActiveCount = (dayOfWeek: DayOfWeek) => {
    return hours.filter((h) => selectedHours[`${dayOfWeek}-${h}`]).length;
  };

  // Toggle standard hours (09:00 - 18:00) for a specific day
  const toggleStandardHoursForDay = (dayOfWeek: DayOfWeek) => {
    const standardHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const allSelected = standardHours.every((h) => selectedHours[`${dayOfWeek}-${h}`]);

    setSelectedHours((prev) => {
      const updated = { ...prev };
      standardHours.forEach((h) => {
        if (allSelected) {
          delete updated[`${dayOfWeek}-${h}`];
        } else {
          updated[`${dayOfWeek}-${h}`] = true;
        }
      });
      return updated;
    });
  };

  // Clear all hours for a specific day
  const clearHoursForDay = (dayOfWeek: DayOfWeek) => {
    setSelectedHours((prev) => {
      const updated = { ...prev };
      hours.forEach((h) => {
        delete updated[`${dayOfWeek}-${h}`];
      });
      return updated;
    });
  };

  // Quick preset: Select 09:00 - 18:00 for Monday through Friday
  const handleSelectStandardWeekdays = () => {
    const businessDays: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const businessHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const updated = { ...selectedHours };

    businessDays.forEach((dayOfWeek) => {
      businessHours.forEach((hour) => {
        updated[`${dayOfWeek}-${hour}`] = true;
      });
    });

    setSelectedHours(updated);
  };

  // Quick preset: Select 09:00 - 18:00 for all 7 days
  const handleSelectAllDaysStandard = () => {
    const allDays: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const standardHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const updated = { ...selectedHours };

    allDays.forEach((dayOfWeek) => {
      standardHours.forEach((hour) => {
        updated[`${dayOfWeek}-${hour}`] = true;
      });
    });

    setSelectedHours(updated);
  };

  // Quick preset: Clear all selected hours
  const handleClearAll = () => {
    setSelectedHours({});
  };

  // Save Schedule: POST /doctors/me/working-hours/template
  const handleSaveSchedule = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      // Build days array matching Swagger specification:
      // Send ONLY days that have selected hours (hours.length > 0)
      const days: DaySchedule[] = WEEK_DAYS_CONFIG.map(({ key }) => {
        const hoursInDay = hours
          .filter((h) => selectedHours[`${key}-${h}`])
          .sort((a, b) => a - b);
        return {
          dayOfWeek: key,
          hours: hoursInDay,
        };
      }).filter((d) => d.hours.length > 0);

      const payload: SaveWeeklyTemplateRequest = { days };
      await doctorService.saveMyWorkingHours(payload);

      setFeedback({
        type: 'success',
        message: 'Həftəlik iş qrafiki uğurla saxlanıldı! Sessiyalar üçün qəbul vaxtları aktivləşdirildi.',
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (error: unknown) {
      console.error('Failed to save schedule template:', error);
      const backendMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { response?: { data?: string } })?.response?.data ||
        (error as Error)?.message ||
        'Serverlə əlaqə xətası baş verdi.';
      setFeedback({
        type: 'error',
        message: `Yadda saxlamaq mümkün olmadı: ${typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg)}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto h-full flex flex-col relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-emerald-400" />
              Həftəlik İş Saatları Cədvəli
            </h1>
            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
              1 Həftəlik Qrafik
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-400 tracking-wide mt-1">
            Həkimin cari həftə üzrə iş saatlarını təyin edin. Bu saatlar pasiyentlər üçün qəbul intervalları kimi təqdim olunur.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto flex-wrap">
          {/* Static Current Week Info Badge (No confusing multi-week navigation) */}
          <div className="flex items-center gap-2 bg-[#141521] border border-[#2e3146] rounded-xl px-3.5 py-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Cari Həftə</span>
              <span className="text-xs font-bold text-slate-200">
                {currentWeekStart.format('D MMM')} – {currentWeekEnd.format('D MMM, YYYY')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 border-l-0 sm:border-l border-[#202235] pl-0 sm:pl-5 w-full sm:w-auto flex-wrap">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {getActiveCount()} Saat Seçilib
            </span>
            <button
              onClick={handleSaveSchedule}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide uppercase transition-all rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isSaving ? 'Saxlanılır...' : 'Qrafiki Yadda Saxla'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#141521]/70 border border-[#202235] p-3 rounded-xl flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">Tez Təyinat:</span>
          <button
            type="button"
            onClick={handleSelectStandardWeekdays}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Həftəiçi 09:00 - 18:00</span>
          </button>
          <button
            type="button"
            onClick={handleSelectAllDaysStandard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bütün Həftə 09:00 - 18:00</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hamısını Təmizlə</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium hidden md:flex">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bu saatlar 7 gün üçün təyin olunur və pasiyentlər seans vaxtı seçərkən bu aralıqlardan istifadə edir.</span>
        </div>
      </div>

      {/* In-app Feedback Toast / Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-xs font-bold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 bg-[#11121d] border border-[#202235] rounded-xl overflow-hidden shadow-lg relative z-10 flex flex-col min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 bg-[#11121d]/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col">
          <div className="min-w-[700px] flex-1 flex flex-col">
            {/* Header: Columns 1 to 7 corresponding to MONDAY .. SUNDAY */}
            <div className="grid grid-cols-8 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
              <div className="p-3 border-r border-[#202235] flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saat</span>
              </div>
              {WEEK_DAYS_CONFIG.map(({ key, azName, shortAz, shortEn, isoIndex }) => {
                const dayDate = currentWeekStart.add(isoIndex, 'day');
                const isToday = dayDate.isSame(dayjs(), 'day');
                const dayActiveCount = getDayActiveCount(key);

                return (
                  <div
                    key={key}
                    className={`p-3 text-center border-r border-[#202235] last:border-0 flex flex-col items-center justify-between gap-1 transition-colors ${
                      isToday ? 'bg-emerald-500/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-black uppercase tracking-wider ${isToday ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {shortAz}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">
                        ({shortEn})
                      </span>
                      {isToday && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                          Bugün
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-semibold text-slate-400 truncate max-w-full">
                      {azName}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 bg-[#141521] px-2 py-0.5 rounded border border-[#202235]">
                        {dayActiveCount} saat
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStandardHoursForDay(key)}
                        title={`${azName} üçün 09:00 - 18:00 seç/ləğv et`}
                        className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        09-18
                      </button>
                      {dayActiveCount > 0 && (
                        <button
                          type="button"
                          onClick={() => clearHoursForDay(key)}
                          title={`${azName} saatlarını təmizlə`}
                          className="text-[9px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/30 transition-all cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hours Rows */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-[#202235]/50 hover:bg-[#1a1b2b]/50 transition-colors h-14">
                  <div className="p-3 border-r border-[#202235] flex items-center justify-end select-none bg-[#141521]/30">
                    <span className="text-xs font-semibold text-slate-400">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                  {WEEK_DAYS_CONFIG.map(({ key, azName }) => {
                    const cellKey = `${key}-${hour}`;
                    const isSelected = !!selectedHours[cellKey];
                    return (
                      <div
                        key={cellKey}
                        onClick={() => toggleHour(key, hour)}
                        className={`border-r border-[#202235]/50 last:border-0 p-1 cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-500/10' : 'hover:bg-[#1c1d2e]/50'
                        }`}
                        title={`${azName} ${hour.toString().padStart(2, '0')}:00`}
                      >
                        <div
                          className={`w-full h-full rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]'
                              : 'border border-dashed border-[#202235]/0 hover:border-slate-600/50'
                          }`}
                        >
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
      </div>
    </div>
  );
}
