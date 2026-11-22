import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { doctorService } from '../../../../api';
import type { WorkingRangeDto } from '../../../../types/portalDtos';
import {
  extractBackendError,
  groupRangesByDate,
  hoursToBlocks,
  rangeMatchesBlock,
  rangesToHourMap,
  sameHours,
  toEndLocalTimeString,
  toLocalTimeString,
} from '../../utils/workingHoursUtils';

dayjs.extend(isoWeek);

const DATE_FMT = 'YYYY-MM-DD';
const STANDARD_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
// Start hours 00:00..22:00 so every 1-hour slot [h, h+1] ends on a valid whole hour <= 23:00
const HOURS = Array.from({ length: 23 }, (_, i) => i);

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
  // Blocks editing already-elapsed hours on today's date so backend does not reject past startTime
  const isPastSlot = useCallback(
    (day: Dayjs, hour: number) => {
      if (day.isBefore(today, 'day')) return true;
      if (day.isSame(today, 'day')) return hour <= dayjs().hour();
      return false;
    },
    [today]
  );

  const filterFutureHoursForDay = useCallback(
    (day: Dayjs, hours: number[]) => hours.filter((h) => !isPastSlot(day, h)),
    [isPastSlot]
  );

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
      setFeedback({ type: 'error', message: extractBackendError(error, 'İş saatlarını serverdən yükləmək mümkün olmadı.') });
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
    if (isPastSlot(day, hour)) return;
    const date = day.format(DATE_FMT);
    updateDay(date, (hours) => (hours.includes(hour) ? hours.filter((h) => h !== hour) : [...hours, hour]));
  };

  const applyToEditableDays = (dayIndexes: number[], updater: (day: Dayjs, hours: number[]) => number[]) => {
    setSelected((prev) => {
      const next = { ...prev };
      dayIndexes.forEach((i) => {
        const day = weekDays[i];
        if (isPast(day)) return;
        const date = day.format(DATE_FMT);
        next[date] = [...new Set(updater(day, prev[date] ?? []))].sort((a, b) => a - b);
      });
      return next;
    });
  };

  const handleSelectStandardWeekdays = () =>
    applyToEditableDays([0, 1, 2, 3, 4], (day, h) => [...h, ...filterFutureHoursForDay(day, STANDARD_HOURS)]);
  const handleSelectAllDaysStandard = () =>
    applyToEditableDays([0, 1, 2, 3, 4, 5, 6], (day, h) => [...h, ...filterFutureHoursForDay(day, STANDARD_HOURS)]);
  const handleClearAll = () =>
    applyToEditableDays([0, 1, 2, 3, 4, 5, 6], (day, h) =>
      h.filter((hr) => isPastSlot(day, hr) && (originalMap[day.format(DATE_FMT)] ?? []).includes(hr))
    );
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
          const date = day.format(DATE_FMT);
          const preservedPast = (originalMap[date] ?? []).filter((hr) => isPastSlot(day, hr));
          const copiedFuture = filterFutureHoursForDay(day, prevMap[source] ?? []);
          next[date] = [...new Set([...preservedPast, ...copiedFuture])].sort((a, b) => a - b);
        });
        return next;
      });
      setFeedback({ type: 'success', message: 'Əvvəlki həftənin qrafiki köçürüldü. Təsdiqləmək üçün "Yadda Saxla" düyməsini basın.' });
    } catch (error: unknown) {
      setFeedback({ type: 'error', message: extractBackendError(error, 'Əvvəlki həftəni yükləmək mümkün olmadı.') });
    } finally {
      setIsCopying(false);
    }
  };

  // Persists changed days using diff-sync: preserves unchanged ranges, deletes removed ones, and posts only new blocks.
  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    setFeedback(null);
    const failed: string[] = [];
    for (const date of dirtyDates) {
      try {
        const dayObj = dayjs(date);
        const existing = rangesByDate[date] ?? [];
        const desiredHours = (selected[date] ?? []).filter(
          (hr) => !isPastSlot(dayObj, hr) || (originalMap[date] ?? []).includes(hr)
        );
        const desiredBlocks = hoursToBlocks(desiredHours);

        const toDelete = existing.filter(
          (range) => !desiredBlocks.some((block) => rangeMatchesBlock(range, block))
        );
        const toCreate = desiredBlocks.filter(
          (block) =>
            !existing.some((range) => rangeMatchesBlock(range, block)) &&
            !isPastSlot(dayObj, block.startHour)
        );

        await Promise.all(toDelete.map((r) => doctorService.deleteMyWorkingRange(r.id)));
        for (const block of toCreate) {
          await doctorService.addMyWorkingRange({
            date,
            startTime: toLocalTimeString(block.startHour),
            endTime: toEndLocalTimeString(block.endHour),
          });
        }
      } catch (error: unknown) {
        console.error(`Failed to save working ranges for ${date}:`, error);
        failed.push(`${dayjs(date).format('D MMM')}: ${extractBackendError(error, 'xəta')}`);
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

                return (
                  <div
                    key={date}
                    className={`py-3 px-2 text-center border-r border-[#202235] last:border-0 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                      isToday ? 'bg-emerald-500/[0.06]' : ''
                    } ${past ? 'opacity-60' : ''}`}
                  >
                    <span
                      className={`text-xs font-bold tracking-wide truncate max-w-full ${
                        isToday ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {label.azName}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isToday ? 'text-emerald-300/90' : 'text-slate-400'
                      }`}
                    >
                      {day.format('D MMM')}
                    </span>
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
                    const past = isPastSlot(day, hour);
                    const isSelected = !!selected[date]?.includes(hour);
                    return (
                      <div
                        key={`${date}-${hour}`}
                        onClick={() => toggleHour(day, hour)}
                        className={`border-r border-[#202235]/50 last:border-0 p-1 transition-colors ${
                          past ? 'cursor-not-allowed bg-[#0d0e17]/40' : 'cursor-pointer'
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
