import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import type { AppointmentDto, LocalTime } from '../../../types/portalDtos'
import type { Session, TimeFilter } from '../types/session'

dayjs.extend(isoWeek)

const AVATAR_PALETTES = [
  'from-teal-600/20 to-cyan-600/20 text-teal-400',
  'from-purple-600/20 to-pink-600/20 text-purple-400',
  'from-teal-500/20 to-emerald-500/20 text-emerald-400',
  'from-violet-600/20 to-indigo-600/20 text-violet-400',
  'from-amber-600/20 to-orange-600/20 text-amber-400',
  'from-blue-600/20 to-indigo-600/20 text-blue-400',
  'from-emerald-600/20 to-green-600/20 text-emerald-400',
  'from-rose-600/20 to-pink-600/20 text-rose-400',
  'from-cyan-600/20 to-blue-600/20 text-cyan-400',
  'from-fuchsia-600/20 to-purple-600/20 text-fuchsia-400',
]

/**
 * Deterministically pick an avatar gradient based on string name/ID
 */
export function getAvatarColor(seed: string | number = ''): string {
  const str = String(seed)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[index]
}

/**
 * Robustly parses backend LocalTime which could be an object ({hour, minute}),
 * an ISO string ("14:30:00" or "14:30"), or an array ([14, 30]).
 */
export function extractHourMinute(time: LocalTime | string | number[] | undefined | null): {
  hour: number
  minute: number
} {
  if (!time) {
    return { hour: 9, minute: 0 }
  }

  if (typeof time === 'object' && !Array.isArray(time)) {
    const h = typeof time.hour === 'number' ? time.hour : parseInt(String(time.hour ?? 0), 10)
    const m = typeof time.minute === 'number' ? time.minute : parseInt(String(time.minute ?? 0), 10)
    return {
      hour: isNaN(h) ? 9 : h,
      minute: isNaN(m) ? 0 : m,
    }
  }

  if (Array.isArray(time)) {
    const h = Number(time[0]) || 0
    const m = Number(time[1]) || 0
    return { hour: h, minute: m }
  }

  if (typeof time === 'string') {
    const parts = time.split(':')
    const h = parseInt(parts[0], 10)
    const m = parts.length > 1 ? parseInt(parts[1], 10) : 0
    return {
      hour: isNaN(h) ? 9 : h,
      minute: isNaN(m) ? 0 : m,
    }
  }

  return { hour: 9, minute: 0 }
}

/**
 * Format 24-hour hour & minute into 12-hour AM/PM string: e.g. "09:00 AM"
 */
export function formatTime12Hour(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(h12)}:${pad(minute)} ${period}`
}

/**
 * Format 24-hour hour & minute into HH:mm: e.g. "09:00"
 */
export function formatTime24Hour(hour: number, minute: number): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hour)}:${pad(minute)}`
}

/**
 * Computes end time given start hour/minute and duration
 */
export function calculateEndTime(startHour: number, startMinute: number, durationMinutes = 60): {
  hour: number
  minute: number
} {
  const totalStartMinutes = startHour * 60 + startMinute
  const totalEndMinutes = totalStartMinutes + durationMinutes
  const endHour = Math.floor(totalEndMinutes / 60) % 24
  const endMinute = totalEndMinutes % 60
  return { hour: endHour, minute: endMinute }
}

/**
 * Format session time interval e.g. "09:00 AM - 10:00 AM"
 */
export function formatSessionInterval(
  time: LocalTime | string | number[] | undefined | null,
  durationMinutes = 60
): {
  interval: string
  startTimeStr: string
  endTimeStr: string
} {
  const { hour: startHour, minute: startMinute } = extractHourMinute(time)
  const { hour: endHour, minute: endMinute } = calculateEndTime(startHour, startMinute, durationMinutes)

  const start12 = formatTime12Hour(startHour, startMinute)
  const end12 = formatTime12Hour(endHour, endMinute)

  return {
    interval: `${start12} - ${end12}`,
    startTimeStr: formatTime24Hour(startHour, startMinute),
    endTimeStr: formatTime24Hour(endHour, endMinute),
  }
}

/**
 * Normalize date string to "YYYY-MM-DD"
 */
export function normalizeDate(dateStr?: string): string {
  if (!dateStr) return dayjs().format('YYYY-MM-DD')
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0]
  }
  return dateStr
}

/**
 * Generates human friendly date label (e.g. "Today", "Tomorrow", "Thursday", "July 10, 2026")
 */
export function getDateLabel(dateStr: string): string {
  const target = dayjs(normalizeDate(dateStr))
  const today = dayjs().startOf('day')

  if (target.isSame(today, 'day')) {
    return 'Today'
  }
  if (target.isSame(today.add(1, 'day'), 'day')) {
    return 'Tomorrow'
  }
  if (target.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday'
  }

  // If in the same calendar week, return the day of week (e.g. "Thursday")
  if (target.isSame(today, 'isoWeek')) {
    return target.format('dddd')
  }

  // Otherwise return full formatted date (e.g. "July 10, 2026")
  return target.format('MMMM D, YYYY')
}

/**
 * Maps AppointmentDto from backend into UI Session presentation model
 */
export function mapAppointmentToSession(app: AppointmentDto, defaultDuration = 60): Session {
  const date = normalizeDate(app.appointmentDate)
  const dateLabel = getDateLabel(date)
  const { interval, startTimeStr, endTimeStr } = formatSessionInterval(app.appointmentTime, defaultDuration)

  const patientName = app.patientName?.trim() || 'Patient'
  const patientAvatarColor = getAvatarColor(app.id || patientName)

  // Status mapping
  const rawStatusUpper = app.status?.toUpperCase()
  const status: Session['status'] =
    rawStatusUpper === 'COMPLETED'
      ? 'Completed'
      : rawStatusUpper === 'WAITING' || rawStatusUpper === 'IN_PROGRESS'
      ? 'Waiting'
      : rawStatusUpper === 'CANCELLED'
      ? 'Cancelled'
      : 'Scheduled'


  // Mode and Delivery Method mapping
  const isVR = app.mode?.toUpperCase() === 'VR'
  const deliveryMethod: Session['deliveryMethod'] = isVR ? 'VR Session' : 'Online Meeting'
  
  // Determine clinical therapy type
  const type =
    (app.therapyType as string) ||
    (isVR ? 'VR Exposure Therapy' : (app.mode?.toUpperCase() === 'APP' ? 'App Intake' : 'CBT Follow-up'))

  return {
    id: String(app.id),
    numericId: typeof app.id === 'number' ? app.id : parseInt(String(app.id), 10) || undefined,
    patientName,
    patientAvatarColor,
    time: interval,
    startTime: startTimeStr,
    endTime: endTimeStr,
    date,
    dateLabel,
    type,
    status,
    rawStatus: app.status,
    deliveryMethod,
    rawMode: app.mode,
    roomUrl: app.roomUrl,
    hasNote: app.hasNote,
    rawAppointment: app,
  }
}

/**
 * Filter sessions by interval: 'today' | 'week' | 'month'
 */
export function filterSessionsByInterval(sessions: Session[], filter: TimeFilter): Session[] {
  const today = dayjs().startOf('day')

  switch (filter) {
    case 'today': {
      return sessions.filter((s) => dayjs(normalizeDate(s.date)).isSame(today, 'day'))
    }
    case 'week': {
      const startOfWeek = today.startOf('isoWeek')
      const endOfWeek = today.endOf('isoWeek')
      return sessions.filter((s) => {
        const sessionDate = dayjs(normalizeDate(s.date))
        return (
          sessionDate.isSame(startOfWeek, 'day') ||
          sessionDate.isSame(endOfWeek, 'day') ||
          (sessionDate.isAfter(startOfWeek) && sessionDate.isBefore(endOfWeek))
        )
      })
    }
    case 'month': {
      return sessions.filter((s) => dayjs(normalizeDate(s.date)).isSame(today, 'month'))
    }
    default:
      return sessions
  }
}

/**
 * Chronologically sort sessions by date and start time
 */
export function sortSessionsChronologically(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.startTime || '00:00'}`
    const dateTimeB = `${b.date} ${b.startTime || '00:00'}`
    return dateTimeA.localeCompare(dateTimeB)
  })
}
