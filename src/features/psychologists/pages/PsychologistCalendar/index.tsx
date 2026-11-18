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
  ChevronLeft,
  ChevronRight,
  Copy,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { doctorService } from '../../../../api';
import type { WorkingRangeDto } from '../../../../types/portalDtos';
import {
  formatLocalTime,
  groupRangesByDate,
  hoursToBlocks,
  rangesToHourMap,
  sameHours,
  toEndLocalTimeString,
  toLocalTimeString,
} from '../../utils/workingHoursUtils';

dayjs.extend(isoWeek);

const DATE_FMT = 'YYYY-MM-DD';
const STANDARD_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DAY_LABELS = [
  { azName: 'Bazar ertəsi', shortAz: 'B.E', shortEn: 'MON' },
  { azName: 'Çərşənbə axşamı', shortAz: 'Ç.A', shortEn: 'TUE' },
  { azName: 'Çərşənbə', shortAz: 'ÇƏR', shortEn: 'WED' },
  { azName: 'Cümə axşamı', shortAz: 'C.A', shortEn: 'THU' },
  { azName: 'Cümə', shortAz: 'CÜM', shortEn: 'FRI' },
  { azName: 'Şənbə', shortAz: 'ŞƏN', shortEn: 'SAT' },
  { azName: 'Bazar', shortAz: 'BAZ', shortEn: 'SUN' },
];

type HourMap = Record<string, number[]>;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (data && typeof data === 'object' && 'message' in data && typeof (data as { message: unknown }).message === 'string') {
    return (data as { message: string }).message;
  }
  if (typeof data === 'string' && data.trim()) return data;
  return (error as Error)?.message || fallback;
};

export function PsychologistCalendar() {
  const [weekStart, setWeekStart] = useState<Dayjs>(() => dayjs().startOf('isoWeek'));
  // Server state for the visible week
  const [ranges, setRanges] = useState<WorkingRangeDto[]>([]);
  // Editable state: date -> selected hours
  const [selected, setSelected] = useState<HourMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')), [weekStart]);
  const weekEnd = weekDays[6];
  const today = dayjs().startOf('day');

  const originalMap = useMemo(() => rangesToHourMap(ranges), [ranges]);
  const rangesByDate = useMemo(() => groupRangesByDate(ranges), [ranges]);

  const isPast = useCallback((day: Dayjs) => day.isBefore(today, 'day'), [today]);

  const dirtyDates = useMemo(
    () =>
      weekDays
        .map((d) => d.format(DATE_FMT))
        .filter((date) => !sameHours(selected[date] ?? [], originalMap[date] ?? [])),
    [weekDays, selected, originalMap]
  );
  const isDirty = dirtyDates.length > 0;

  // GET /doctors/me/working-hours?from&to for the visible week
  const fetchWeek = useCallback(async (start: Dayjs) => {
    setIsLoading(true);
    try {
      const data = await doctorService.getMyWorkingRanges(
        start.format(DATE_FMT),
        start.add(6, 'day').format(DATE_FMT)
      );
      setRanges(data);
      setSelected(rangesToHourMap(data));
    } catch (error: unknown) {
      console.error('Failed to fetch working ranges:', error);
      setRanges([]);
      setSelected({});
      setFeedback({ type: 'error', message: getErrorMessage(error, 'İş saatlarını serverdən yükləmək mümkün olmadı.') });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeek(weekStart);
  }, [fetchWeek, weekStart]);

  const confirmDiscard = () =>
    !isDirty || window.confirm('Yadda saxlanılmamış dəyişikliklər var. Davam etsəniz itəcək. Davam edilsin?');

  const goToWeek = (start: Dayjs) => {
    if (!confirmDiscard()) return;
    setFeedback(null);
    setWeekStart(start.startOf('isoWeek'));
  };

  const updateDay = (date: string, updater: (hours: number[]) => number[]) => {
    setSelected((prev) => {
      const next = [...new Set(updater(prev[date] ?? []))].sort((a, b) => a - b);
      return { ...prev, [date]: next };
    });
  };

  const toggleHour = (day: Dayjs, hour: number) => {
    if (isPast(day)) return;
    const date = day.format(DATE_FMT);
    updateDay(date, (hours) => (hours.includes(hour) ? hours.filter((h) => h !== hour) : [...hours, hour]));
  };

  const toggleStandardHoursForDay = (day: Dayjs) => {
    if (isPast(day)) return;
    const date = day.format(DATE_FMT);
    updateDay(date, (hours) => {
      const allSelected = STANDARD_HOURS.every((h) => hours.includes(h));
      return allSelected ? hours.filter((h) => !STANDARD_HOURS.includes(h)) : [...hours, ...STANDARD_HOURS];
    });
  };

  const clearDay = (day: Dayjs) => {
    if (isPast(day)) return;
    updateDay(day.format(DATE_FMT), () => []);
  };

  const applyToEditableDays = (dayIndexes: number[], updater: (hours: number[]) => number[]) => {
    setSelected((prev) => {
      const next = { ...prev };
      dayIndexes.forEach((i) => {
        const day = weekDays[i];
        if (isPast(day)) return;
        const date = day.format(DATE_FMT);
        next[date] = [...new Set(updater(prev[date] ?? []))].sort((a, b) => a - b);
      });
      return next;
    });
  };

  const handleSelectStandardWeekdays = () => applyToEditableDays([0, 1, 2, 3, 4], (h) => [...h, ...STANDARD_HOURS]);
  const handleSelectAllDaysStandard = () => applyToEditableDays([0, 1, 2, 3, 4, 5, 6], (h) => [...h, ...STANDARD_HOURS]);
  const handleClearAll = () => applyToEditableDays([0, 1, 2, 3, 4, 5, 6], () => []);
  const handleResetChanges = () => setSelected(originalMap);

  // Copies the previous week's ranges onto the editable days of the visible week (local only until saved)
  const handleCopyPreviousWeek = async () => {
    setIsCopying(true);
    setFeedback(null);
    try {
      const prevStart = weekStart.subtract(7, 'day');
      const prevRanges = await doctorService.getMyWorkingRanges(
        prevStart.format(DATE_FMT),
        prevStart.add(6, 'day').format(DATE_FMT)
      );
      const prevMap = rangesToHourMap(prevRanges);
      if (Object.keys(prevMap).length === 0) {
        setFeedback({ type: 'error', message: 'Əvvəlki həftə üçün heç bir iş saatı tapılmadı.' });
        return;
      }
      setSelected((prev) => {
        const next = { ...prev };
        weekDays.forEach((day) => {
          if (isPast(day)) return;
          const source = day.subtract(7, 'day').format(DATE_FMT);
          next[day.format(DATE_FMT)] = prevMap[source] ?? [];
        });
        return next;
      });
      setFeedback({ type: 'success', message: 'Əvvəlki həftənin qrafiki köçürüldü. Təsdiqləmək üçün "Yadda Saxla" düyməsini basın.' });
    } catch (error: unknown) {
      setFeedback({ type: 'error', message: getErrorMessage(error, 'Əvvəlki həftəni yükləmək mümkün olmadı.') });
    } finally {
      setIsCopying(false);
    }
  };

  // Persists changed days: removes the day's existing ranges, then posts merged contiguous blocks.
  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    setFeedback(null);
    const failed: string[] = [];
    for (const date of dirtyDates) {
      try {
        const existing = rangesByDate[date] ?? [];
        await Promise.all(existing.map((r) => doctorService.deleteMyWorkingRange(r.id)));
        for (const block of hoursToBlocks(selected[date] ?? [])) {
          await doctorService.addMyWorkingRange({
            date,
            startTime: toLocalTimeString(block.startHour),
            endTime: toEndLocalTimeString(block.endHour),
          });
        }
      } catch (error: unknown) {
        console.error(`Failed to save working ranges for ${date}:`, error);
        failed.push(`${dayjs(date).format('D MMM')}: ${getErrorMessage(error, 'xəta')}`);
      }
    }
    await fetchWeek(weekStart);
    setIsSaving(false);
    if (failed.length) {
      setFeedback({ type: 'error', message: `Bəzi günlər yadda saxlanılmadı — ${failed.join('; ')}` });
    } else {
      setFeedback({ type: 'success', message: 'İş qrafiki uğurla yadda saxlanıldı! Seçilmiş tarixlər pasiyentlər üçün aktivdir.' });
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const totalHours = weekDays.reduce((sum, d) => sum + (selected[d.format(DATE_FMT)]?.length ?? 0), 0);
  const isCurrentWeek = weekStart.isSame(dayjs().startOf('isoWeek'), 'day');
  const busy = isLoading || isSaving || isCopying;

  const btnBase =
    'flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1c2b] hover:bg-[#222437] border border-[#2e3146] text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto h-full flex flex-col relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-emerald-400" />
              İş Saatları Cədvəli
            </h1>
            {isDirty && (
              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                {dirtyDates.length} gün dəyişib
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-400 tracking-wide mt-1">
            Konkret tarixlər üzrə iş saatlarını təyin edin. Bu saatlar pasiyentlər üçün qəbul intervalları kimi təqdim olunur.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto flex-wrap">
          {/* Week navigation */}
          <div className="flex items-center gap-1.5 bg-[#141521] border border-[#2e3146] rounded-xl px-1.5 py-1.5">
            <button
              type="button"
              onClick={() => goToWeek(weekStart.subtract(7, 'day'))}
              disabled={busy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222437] cursor-pointer disabled:opacity-50"
              title="Əvvəlki həftə"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-1.5">
              <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {isCurrentWeek ? 'Cari Həftə' : 'Həftə'}
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {weekStart.format('D MMM')} – {weekEnd.format('D MMM, YYYY')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goToWeek(weekStart.add(7, 'day'))}
              disabled={busy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222437] cursor-pointer disabled:opacity-50"
              title="Növbəti həftə"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isCurrentWeek && (
              <button
                type="button"
                onClick={() => goToWeek(dayjs())}
                disabled={busy}
                className="text-[10px] font-bold uppercase text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/30 cursor-pointer disabled:opacity-50"
              >
                Bu gün
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 border-l-0 sm:border-l border-[#202235] pl-0 sm:pl-5 w-full sm:w-auto flex-wrap">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{totalHours} Saat Seçilib</span>
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty || isLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide uppercase transition-all rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isSaving ? 'Saxlanılır...' : 'Yadda Saxla'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#141521]/70 border border-[#202235] p-3 rounded-xl flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">Tez Təyinat:</span>
          <button type="button" onClick={handleSelectStandardWeekdays} disabled={busy} className={`${btnBase} hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Həftəiçi 09:00 - 18:00</span>
          </button>
          <button type="button" onClick={handleSelectAllDaysStandard} disabled={busy} className={`${btnBase} hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400`}>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bütün Həftə 09:00 - 18:00</span>
          </button>
          <button type="button" onClick={handleCopyPreviousWeek} disabled={busy} className={`${btnBase} hover:border-sky-500/50 text-slate-300 hover:text-sky-400`}>
            {isCopying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
            <span>Əvvəlki Həftəni Köçür</span>
          </button>
          <button type="button" onClick={handleClearAll} disabled={busy} className={`${btnBase} hover:border-rose-500/50 text-slate-400 hover:text-rose-400`}>
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hamısını Təmizlə</span>
          </button>
          {isDirty && (
            <button type="button" onClick={handleResetChanges} disabled={busy} className={`${btnBase} hover:border-amber-500/50 text-slate-400 hover:text-amber-300`}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dəyişiklikləri Ləğv Et</span>
            </button>
          )}
        </div>

        <div className="items-center gap-1.5 text-[11px] text-slate-400 font-medium hidden md:flex">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saatlar yalnız göstərilən həftənin tarixlərinə tətbiq olunur. Keçmiş günlər redaktə edilə bilməz.</span>
        </div>
      </div>

      {/* Feedback banner */}
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
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 bg-[#11121d] border border-[#202235] rounded-xl overflow-hidden shadow-lg relative z-10 flex flex-col min-h-[500px]">
        {(isLoading || isSaving) && (
          <div className="absolute inset-0 bg-[#11121d]/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col">
          <div className="min-w-[760px] flex-1 flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
              <div className="p-3 border-r border-[#202235] flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saat</span>
              </div>
              {weekDays.map((day, idx) => {
                const date = day.format(DATE_FMT);
                const label = DAY_LABELS[idx];
                const isToday = day.isSame(today, 'day');
                const past = isPast(day);
                const dayCount = selected[date]?.length ?? 0;
                const changed = dirtyDates.includes(date);
                const savedRanges = rangesByDate[date] ?? [];

                return (
                  <div
                    key={date}
                    className={`p-2.5 text-center border-r border-[#202235] last:border-0 flex flex-col items-center justify-between gap-1 transition-colors ${
                      isToday ? 'bg-emerald-500/[0.04]' : ''
                    } ${past ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-black uppercase tracking-wider ${isToday ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {label.shortAz}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{day.format('D MMM')}</span>
                      {isToday && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[8px] font-extrabold px-1.5 rounded uppercase">Bugün</span>
                      )}
                      {past && <Lock className="w-3 h-3 text-slate-500" />}
                      {changed && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Yadda saxlanılmayıb" />}
                    </div>

                    <p className="text-[10px] font-semibold text-slate-500 truncate max-w-full" title={savedRanges.map((r) => `${formatLocalTime(r.startTime)}–${formatLocalTime(r.endTime, true)}`).join(', ')}>
                      {savedRanges.length
                        ? savedRanges.map((r) => `${formatLocalTime(r.startTime)}–${formatLocalTime(r.endTime, true)}`).join(', ')
                        : label.azName}
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 bg-[#141521] px-2 py-0.5 rounded border border-[#202235]">
                        {dayCount} saat
                      </span>
                      {!past && (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleStandardHoursForDay(day)}
                            title={`${label.azName} üçün 09:00 - 18:00 seç/ləğv et`}
                            className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 transition-all cursor-pointer"
                          >
                            09-18
                          </button>
                          {dayCount > 0 && (
                            <button
                              type="button"
                              onClick={() => clearDay(day)}
                              title={`${label.azName} saatlarını təmizlə`}
                              className="text-[9px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/30 transition-all cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hour rows */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-[#202235]/50 hover:bg-[#1a1b2b]/50 transition-colors h-14">
                  <div className="p-3 border-r border-[#202235] flex items-center justify-end select-none bg-[#141521]/30">
                    <span className="text-xs font-semibold text-slate-400">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                  {weekDays.map((day, idx) => {
                    const date = day.format(DATE_FMT);
                    const past = isPast(day);
                    const isSelected = !!selected[date]?.includes(hour);
                    return (
                      <div
                        key={`${date}-${hour}`}
                        onClick={() => toggleHour(day, hour)}
                        className={`border-r border-[#202235]/50 last:border-0 p-1 transition-colors ${
                          past ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${isSelected ? 'bg-emerald-500/10' : past ? '' : 'hover:bg-[#1c1d2e]/50'}`}
                        title={`${DAY_LABELS[idx].azName}, ${day.format('D MMM')} ${hour.toString().padStart(2, '0')}:00`}
                      >
                        <div
                          className={`w-full h-full rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? `bg-emerald-500/20 border border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)] ${past ? 'opacity-50' : ''}`
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
