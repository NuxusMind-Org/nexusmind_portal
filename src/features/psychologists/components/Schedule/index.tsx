import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Eye,
  Smartphone,
  X,
  RefreshCw,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { doctorService, appointmentService } from '../../../../api'
import { useUserStore } from '../../../../store/userStore'
import type { AppointmentDto, DayOfWeek } from '../../../../types/portalDtos'
import {
  extractHourMinute,
  formatAppointmentTime,
  formatAppointmentMode,
  formatAppointmentStatus,
  getPatientInitials,
  normalizeDate,
  getAppointmentsForDate,
} from '../../utils/appointmentUtils'

dayjs.extend(isoWeek)

type ViewMode = 'day' | 'week' | 'month'

export interface ScheduleProps {
  psychologistId?: string | number
}

const DISPLAY_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const WEEK_DAY_KEYS: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]

const resolveNumericId = (val: unknown): number | null => {
  if (typeof val === 'number' && !isNaN(val)) return val
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return null
}

export default function Schedule({ psychologistId }: ScheduleProps = {}) {
  const { profile } = useUserStore()
  const activePsychologistId =
    resolveNumericId(psychologistId) ??
    resolveNumericId(profile?.doctorId) ??
    resolveNumericId(profile?.id) ??
    1

  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [appointments, setAppointments] = useState<AppointmentDto[]>([])
  const [workingHours, setWorkingHours] = useState<Record<DayOfWeek, number[]>>({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selected session for detailed view modal (via /appointments/{id})
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null)
  const [detailedAppointment, setDetailedAppointment] = useState<AppointmentDto | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  // Fetch Working Hours
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await doctorService.getMyWorkingHours()
        const map: Record<DayOfWeek, number[]> = {
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
          SATURDAY: [],
          SUNDAY: [],
        }
        ;(response.days ?? []).forEach(({ dayOfWeek, hours }) => {
          map[dayOfWeek] = hours ?? []
        })
        setWorkingHours(map)
      } catch {
        // Silently fail — working hours are supplementary display info
      }
    }
    fetchWorkingHours()
  }, [])

  // Fetch Appointments from GET /appointments/{id} using Psychologist ID
  const loadAppointments = useCallback(async () => {
    if (!activePsychologistId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await appointmentService.getAppointmentsByPsychologistId(activePsychologistId)
      setAppointments(data)
    } catch (err: unknown) {
      console.error('Failed to load appointments:', err)
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load schedule appointments.'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [activePsychologistId])

  useEffect(() => {
    if (!activePsychologistId) return
    let isMounted = true
    appointmentService
      .getAppointmentsByPsychologistId(activePsychologistId)
      .then((data) => {
        if (isMounted) {
          setAppointments(data)
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load appointments:', err)
          const errorMsg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to load schedule appointments.'
          setError(errorMsg)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activePsychologistId])

  // Open modal and fetch full details via GET /appointments/{id}
  const handleOpenSession = async (app: AppointmentDto) => {
    setSelectedAppointment(app)
    setDetailedAppointment(app)
    setIsDetailsLoading(true)

    try {
      const fullDetails = await appointmentService.getAppointmentById(app.id)
      setDetailedAppointment(fullDetails)
    } catch (err) {
      console.error(`Failed to fetch appointment details for ID ${app.id}:`, err)
      // Retain already present appointment data as fallback
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedAppointment(null)
    setDetailedAppointment(null)
  }

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'day') setCurrentDate((prev) => prev.subtract(1, 'day'))
    else if (viewMode === 'week') setCurrentDate((prev) => prev.subtract(1, 'week'))
    else if (viewMode === 'month') setCurrentDate((prev) => prev.subtract(1, 'month'))
  }

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate((prev) => prev.add(1, 'day'))
    else if (viewMode === 'week') setCurrentDate((prev) => prev.add(1, 'week'))
    else if (viewMode === 'month') setCurrentDate((prev) => prev.add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentDate(dayjs())
  }

  const handleSelectDayFromMonth = (targetDate: dayjs.Dayjs) => {
    setCurrentDate(targetDate)
    setViewMode('day')
  }

  // Current day details for Day View
  const currentDateStr = currentDate.format('YYYY-MM-DD')
  const todayDayOfWeek = currentDate.format('dddd').toUpperCase() as DayOfWeek
  const todayHours = workingHours[todayDayOfWeek] ?? []
  const dayAppointments = useMemo(
    () => getAppointmentsForDate(appointments, currentDateStr),
    [appointments, currentDateStr]
  )

  // Current week details for Week View
  const currentWeekStart = useMemo(() => currentDate.startOf('isoWeek'), [currentDate])
  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => currentWeekStart.add(i, 'day')),
    [currentWeekStart]
  )
  const weekAppointments = useMemo(() => {
    const weekStartStr = currentWeekStart.format('YYYY-MM-DD')
    const weekEndStr = currentWeekStart.add(6, 'day').format('YYYY-MM-DD')
    return appointments.filter((app) => {
      const d = normalizeDate(app.appointmentDate)
      return d >= weekStartStr && d <= weekEndStr
    })
  }, [appointments, currentWeekStart])

  // Month View calculations
  const monthStart = useMemo(() => currentDate.startOf('month'), [currentDate])
  const monthAppointments = useMemo(() => {
    const monthPrefix = currentDate.format('YYYY-MM')
    return appointments.filter((app) => normalizeDate(app.appointmentDate).startsWith(monthPrefix))
  }, [appointments, currentDate])

  const calendarGridDays = useMemo(() => {
    const startOfCalendar = monthStart.startOf('isoWeek')
    const totalDays = 35 // 5 weeks x 7 days
    return Array.from({ length: totalDays }).map((_, i) => startOfCalendar.add(i, 'day'))
  }, [monthStart])

  // Header Title Formatting
  const headerTitle = useMemo(() => {
    if (viewMode === 'day') {
      return currentDate.format('MMMM D, YYYY')
    }
    if (viewMode === 'week') {
      const endOfWeek = currentWeekStart.add(6, 'day')
      if (currentWeekStart.month() === endOfWeek.month()) {
        return `${currentWeekStart.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`
      }
      return `${currentWeekStart.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`
    }
    return currentDate.format('MMMM YYYY')
  }, [viewMode, currentDate, currentWeekStart])

  return (
    <div className="bg-[#11121d] border border-[#202235] rounded-xl flex flex-col h-[calc(100vh-8rem)] shadow-lg overflow-hidden relative">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 border-b border-[#202235] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 bg-[#141521]/60">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-600/10 border border-violet-500/20 rounded-lg text-violet-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{headerTitle}</h2>
              <p className="text-[11px] font-semibold text-slate-400">
                {viewMode === 'day' && currentDate.format('dddd')}
                {viewMode === 'week' && 'Weekly Schedule Overview'}
                {viewMode === 'month' && 'Monthly Caseload Calendar'}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 bg-[#141521] border border-[#2e3146] rounded-lg p-1">
            <button
              onClick={handlePrev}
              title="Previous"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              title="Next"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#202235]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadAppointments}
            disabled={isLoading}
            title="Refresh appointments"
            className="p-2 bg-[#141521] border border-[#2e3146] text-slate-400 hover:text-white rounded-lg hover:bg-[#202235] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>

        {/* View Mode Toggles */}
        <div className="flex p-1 bg-[#141521] border border-[#2e3146] rounded-lg self-end sm:self-auto">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-bold capitalize rounded-md transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#202235]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center justify-between text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadAppointments}
            className="underline hover:text-white font-bold cursor-pointer ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar relative">
        {/* Loading Overlay Spinner for initial or refreshing load */}
        {isLoading && appointments.length === 0 && (
          <div className="absolute inset-0 bg-[#11121d]/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Loading active sessions...
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* DAY VIEW                                                 */}
        {/* ========================================================= */}
        {viewMode === 'day' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>{currentDate.format('dddd, MMMM D, YYYY')}</span>
                {currentDate.isSame(dayjs(), 'day') && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    TODAY
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {todayHours.length > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {todayHours.length}h Available
                  </span>
                )}
                <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {dayAppointments.length} {dayAppointments.length === 1 ? 'Session' : 'Sessions'}{' '}
                  Today
                </span>
              </div>
            </div>

            <div className="relative border border-[#202235] rounded-xl bg-[#141521]/30 overflow-hidden">
              {/* Time grid lines */}
              <div className="absolute top-0 bottom-0 left-16 right-0 border-l border-[#202235]"></div>

              {DISPLAY_HOURS.map((hour) => {
                const isWorkingHour = todayHours.includes(hour)
                // Filter appointments starting in this hour slot
                const slotAppointments = dayAppointments.filter((app) => {
                  const { hour: appHour } = extractHourMinute(app.appointmentTime)
                  return appHour === hour
                })

                return (
                  <div
                    key={hour}
                    className={`flex min-h-20 border-b border-[#202235]/60 relative group transition-colors ${
                      isWorkingHour ? 'bg-emerald-500/[0.03]' : ''
                    }`}
                  >
                    {/* Hour Label */}
                    <div className="w-16 pr-3 text-right pt-2.5 shrink-0 select-none">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          isWorkingHour ? 'text-emerald-400/90' : 'text-slate-500'
                        }`}
                      >
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>

                    {/* Hour Content Column */}
                    <div className="flex-1 relative p-1.5 min-h-20">
                      {/* Left accent bar indicating doctor's active working hours */}
                      {isWorkingHour && (
                        <div
                          className="absolute left-0 top-1 bottom-1 w-1 bg-emerald-500/40 rounded-full"
                          title="Working Hour"
                        />
                      )}

                      {/* Render real appointments */}
                      <div className="space-y-2">
                        {slotAppointments.map((app) => {
                          const { minute } = extractHourMinute(app.appointmentTime)
                          const modeBadge = formatAppointmentMode(app.mode)
                          const statusBadge = formatAppointmentStatus(app.status)
                          const initials = getPatientInitials(app.patientName)
                          const timeStr = formatAppointmentTime(app.appointmentTime, true)

                          return (
                            <div
                              key={app.id}
                              onClick={() => handleOpenSession(app)}
                              className="relative bg-gradient-to-r from-[#191b2e] to-[#141525] hover:from-[#21243d] hover:to-[#1a1b30] border border-violet-500/30 hover:border-violet-500/60 rounded-xl p-3.5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-violet-500/10 group/card z-10"
                            >
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-white group-hover/card:text-violet-300 transition-colors flex items-center gap-2">
                                      {app.patientName || 'Anonymous Patient'}
                                      {app.hasNote && (
                                        <span title="Notes Logged">
                                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                        </span>
                                      )}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-0.5">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      <span>{timeStr}</span>
                                      {minute > 0 && (
                                        <span className="text-[10px] text-slate-500">
                                          (+{minute}m)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Mode Badge */}
                                  <span
                                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border ${modeBadge.bg} ${modeBadge.text} ${modeBadge.border}`}
                                  >
                                    {app.mode === 'VR' && <Eye className="w-3 h-3" />}
                                    {app.mode === 'VIDEO_CALL' && <Video className="w-3 h-3" />}
                                    {app.mode === 'APP' && <Smartphone className="w-3 h-3" />}
                                    {modeBadge.shortLabel}
                                  </span>

                                  {/* Status Badge */}
                                  <span
                                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                                  >
                                    {statusBadge.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* WEEK VIEW                                                */}
        {/* ========================================================= */}
        {viewMode === 'week' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Active Week: {currentWeekStart.format('MMM D')} &ndash;{' '}
                {currentWeekStart.add(6, 'day').format('MMM D, YYYY')}
              </h3>
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {weekAppointments.length}{' '}
                {weekAppointments.length === 1 ? 'Session' : 'Sessions'} This Week
              </span>
            </div>

            <div className="flex-1 min-h-[500px] border border-[#202235] rounded-xl overflow-hidden flex flex-col bg-[#141521]/50">
              {/* Days Header */}
              <div className="grid grid-cols-8 border-b border-[#202235] bg-[#1a1b2b] shrink-0 sticky top-0 z-20">
                <div className="p-3 border-r border-[#202235] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    TIME
                  </span>
                </div>
                {weekDays.map((day) => {
                  const isToday = day.isSame(dayjs(), 'day')
                  return (
                    <div
                      key={day.format('YYYY-MM-DD')}
                      onClick={() => handleSelectDayFromMonth(day)}
                      className={`p-2.5 text-center border-r border-[#202235] last:border-0 cursor-pointer transition-colors hover:bg-violet-500/5 ${
                        isToday ? 'bg-violet-500/15' : ''
                      }`}
                    >
                      <p
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isToday ? 'text-violet-300 font-black' : 'text-slate-400'
                        }`}
                      >
                        {day.format('ddd')}
                      </p>
                      <p
                        className={`text-base font-black mt-0.5 ${
                          isToday ? 'text-violet-400 font-black' : 'text-slate-200'
                        }`}
                      >
                        {day.format('D')}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Time Grid (scrollable) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative divide-y divide-[#202235]/50">
                {DISPLAY_HOURS.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 min-h-16 group">
                    {/* Time Column */}
                    <div className="p-2 border-r border-[#202235] text-right flex items-start justify-end shrink-0 select-none bg-[#141521]/20">
                      <span className="text-[10px] font-bold text-slate-500">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>

                    {/* 7 Day Columns */}
                    {weekDays.map((day, dayIdx) => {
                      const dayKey = WEEK_DAY_KEYS[dayIdx]
                      const isWorkingHour = workingHours[dayKey]?.includes(hour)
                      const dayDateStr = day.format('YYYY-MM-DD')
                      const isToday = day.isSame(dayjs(), 'day')

                      // Appointments on this date and hour
                      const slotAppointments = appointments.filter((app) => {
                        const dateMatches = normalizeDate(app.appointmentDate) === dayDateStr
                        const { hour: appHour } = extractHourMinute(app.appointmentTime)
                        return dateMatches && appHour === hour
                      })

                      return (
                        <div
                          key={dayDateStr}
                          className={`border-r border-[#202235]/50 last:border-0 p-1 relative min-h-16 flex flex-col gap-1 transition-colors ${
                            isToday ? 'bg-violet-950/[0.04]' : ''
                          } ${isWorkingHour ? 'bg-emerald-500/[0.05]' : ''}`}
                        >
                          {/* Working hour edge accent */}
                          {isWorkingHour && (
                            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-emerald-500/40 rounded-full" />
                          )}

                          {slotAppointments.map((app) => {
                            const modeBadge = formatAppointmentMode(app.mode)
                            const timeStr = formatAppointmentTime(app.appointmentTime)
                            return (
                              <div
                                key={app.id}
                                onClick={() => handleOpenSession(app)}
                                className="bg-[#1b1d2e] hover:bg-[#252840] border border-violet-500/30 hover:border-violet-400 rounded-lg p-1.5 transition-all cursor-pointer z-10 shadow-sm overflow-hidden group/event"
                              >
                                <p className="text-[11px] font-bold text-white group-hover/event:text-violet-300 truncate">
                                  {app.patientName || 'Patient'}
                                </p>
                                <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400 mt-0.5">
                                  <span>{timeStr}</span>
                                  <span className={`font-bold ${modeBadge.text}`}>
                                    {modeBadge.shortLabel}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MONTH VIEW                                               */}
        {/* ========================================================= */}
        {viewMode === 'month' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {currentDate.format('MMMM YYYY')} Overview
              </h3>
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {monthAppointments.length}{' '}
                {monthAppointments.length === 1 ? 'Session' : 'Sessions'} This Month
              </span>
            </div>

            <div className="flex-1 min-h-[500px] border border-[#202235] rounded-xl overflow-hidden flex flex-col bg-[#141521]/50">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-[#202235] bg-[#1a1b2b] shrink-0">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center border-r border-[#202235] last:border-0 text-slate-400"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest">{day}</p>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 grid grid-cols-7 grid-rows-5">
                {calendarGridDays.map((cellDay) => {
                  const dateStr = cellDay.format('YYYY-MM-DD')
                  const isCurrentMonth = cellDay.month() === currentDate.month()
                  const isToday = cellDay.isSame(dayjs(), 'day')

                  const daySessions = appointments.filter(
                    (app) => normalizeDate(app.appointmentDate) === dateStr
                  )
                  const count = daySessions.length

                  return (
                    <div
                      key={dateStr}
                      onClick={() => handleSelectDayFromMonth(cellDay)}
                      className={`border-r border-b border-[#202235]/60 p-2 relative hover:bg-[#1a1b2b]/80 transition-colors cursor-pointer flex flex-col justify-between min-h-[90px] ${
                        !isCurrentMonth ? 'bg-[#0b0c14]/60 opacity-40' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-xs font-bold ${
                            isToday
                              ? 'bg-violet-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm'
                              : isCurrentMonth
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {cellDay.format('D')}
                        </span>

                        {count > 0 && (
                          <span className="text-[10px] font-extrabold text-violet-300 bg-violet-500/20 border border-violet-500/30 px-1.5 py-0.5 rounded-full">
                            {count} {count === 1 ? 'session' : 'sessions'}
                          </span>
                        )}
                      </div>

                      {/* Session Mini Previews */}
                      {count > 0 && (
                        <div className="mt-1 space-y-1 overflow-hidden">
                          {daySessions.slice(0, 2).map((s) => {
                            const timeStr = formatAppointmentTime(s.appointmentTime)
                            return (
                              <div
                                key={s.id}
                                className="text-[9px] font-semibold text-slate-300 bg-[#1e2035] border border-violet-500/20 rounded px-1.5 py-0.5 truncate flex items-center justify-between"
                              >
                                <span className="truncate">{s.patientName || 'Patient'}</span>
                                <span className="text-violet-400 font-bold ml-1">{timeStr}</span>
                              </div>
                            )
                          })}
                          {count > 2 && (
                            <p className="text-[8px] font-bold text-slate-500 text-right pr-1">
                              +{count - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SESSION DETAILS MODAL (Via /appointments/{id})            */}
      {/* ========================================================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-[#090a0f]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={handleCloseModal} />

          <div className="bg-[#141521] border border-[#222437] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col p-6 z-10 animate-in fade-in zoom-in-95 duration-200 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Appointment Details
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-[#1b1c2b] px-2 py-0.5 rounded border border-[#2e3146]">
                    #{selectedAppointment.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Synchronized live session data via Appointments API
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 bg-[#1b1c2b] border border-[#2e3146] hover:border-slate-500 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isDetailsLoading && (
              <div className="flex items-center justify-center py-4 text-violet-400 gap-2 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching real-time session metadata...</span>
              </div>
            )}

            {/* Patient Header Card */}
            {detailedAppointment && (
              <div className="flex items-center gap-4 bg-[#1b1c2b]/60 border border-[#222437] p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-extrabold text-sm text-white shadow-md shrink-0">
                  {getPatientInitials(detailedAppointment.patientName)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-base">
                    {detailedAppointment.patientName || 'Anonymous Patient'}
                  </h4>
                  {detailedAppointment.doctorName && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assigned Doctor: {detailedAppointment.doctorName}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      formatAppointmentStatus(detailedAppointment.status).bg
                    } ${formatAppointmentStatus(detailedAppointment.status).text} ${
                      formatAppointmentStatus(detailedAppointment.status).border
                    }`}
                  >
                    {formatAppointmentStatus(detailedAppointment.status).label}
                  </span>
                </div>
              </div>
            )}

            {/* Session Metadata Grid */}
            {detailedAppointment && (
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
                {/* Date */}
                <div className="space-y-1 bg-[#1b1c2b]/40 p-3 rounded-xl border border-[#222437]/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Session Date
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-200 mt-1 font-bold">
                    <CalendarIcon className="w-3.5 h-3.5 text-violet-400" />
                    <span>
                      {detailedAppointment.appointmentDate
                        ? dayjs(detailedAppointment.appointmentDate).format('MMMM D, YYYY')
                        : 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-1 bg-[#1b1c2b]/40 p-3 rounded-xl border border-[#222437]/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Scheduled Time
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-200 mt-1 font-bold">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span>{formatAppointmentTime(detailedAppointment.appointmentTime, true)}</span>
                  </div>
                </div>

                {/* Delivery Mode */}
                <div className="space-y-1 bg-[#1b1c2b]/40 p-3 rounded-xl border border-[#222437]/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Delivery Mode
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-200 mt-1 font-bold">
                    {detailedAppointment.mode === 'VR' && (
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    {detailedAppointment.mode === 'VIDEO_CALL' && (
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {detailedAppointment.mode === 'APP' && (
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{formatAppointmentMode(detailedAppointment.mode).label}</span>
                  </div>
                </div>

                {/* Clinical Notes Status */}
                <div className="space-y-1 bg-[#1b1c2b]/40 p-3 rounded-xl border border-[#222437]/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Clinical Notes
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold">
                    {detailedAppointment.hasNote ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Notes Recorded
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        Pending Notes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Room URL / Action Buttons */}
            {detailedAppointment && (
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#222437]">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#1b1c2b] hover:bg-[#252840] border border-[#2e3146] rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>

                {detailedAppointment.roomUrl ? (
                  <a
                    href={detailedAppointment.roomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-md shadow-violet-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join Clinical Room
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      alert(`Session room for Appointment #${detailedAppointment.id} will open shortly.`)
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-violet-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    Start Session
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
