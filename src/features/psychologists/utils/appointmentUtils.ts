import type { AppointmentDto, AppointmentMode, AppointmentStatus, LocalTime } from '../../../types/portalDtos'

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
 * Formats time as "HH:mm" or "HH:mm (50 min)"
 */
export function formatAppointmentTime(
  time: LocalTime | string | number[] | undefined | null,
  includeDuration = false,
  durationMinutes = 50
): string {
  const { hour, minute } = extractHourMinute(time)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timeStr = `${pad(hour)}:${pad(minute)}`

  if (includeDuration) {
    return `${timeStr} (${durationMinutes} min)`
  }
  return timeStr
}

/**
 * Returns styled badge properties for appointment modes (VR, VIDEO_CALL, APP)
 */
export function formatAppointmentMode(mode?: AppointmentMode | string) {
  switch (mode?.toUpperCase()) {
    case 'VR':
      return {
        label: 'VR Session',
        shortLabel: 'VR',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20',
        dot: 'bg-purple-400',
      }
    case 'VIDEO_CALL':
      return {
        label: 'Online Video Call',
        shortLabel: 'Online',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
        dot: 'bg-blue-400',
      }
    case 'APP':
      return {
        label: 'App Session',
        shortLabel: 'App',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-400',
      }
    default:
      return {
        label: mode || 'General Session',
        shortLabel: mode || 'Session',
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
        dot: 'bg-slate-400',
      }
  }
}

/**
 * Returns styled badge properties for appointment status
 */
export function formatAppointmentStatus(status?: AppointmentStatus | string) {
  switch (status?.toUpperCase()) {
    case 'SCHEDULED':
      return {
        label: 'Scheduled',
        bg: 'bg-violet-500/10',
        text: 'text-violet-400',
        border: 'border-violet-500/20',
      }
    case 'WAITING':
      return {
        label: 'Waiting',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
      }
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/20',
      }
    case 'COMPLETED':
      return {
        label: 'Completed',
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
      }
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/20',
      }
    default:
      return {
        label: status || 'Scheduled',
        bg: 'bg-violet-500/10',
        text: 'text-violet-400',
        border: 'border-violet-500/20',
      }
  }
}

/**
 * Extracts initials from patient name
 */
export function getPatientInitials(name?: string): string {
  if (!name) return 'PT'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Normalize date string to "YYYY-MM-DD"
 */
export function normalizeDate(dateStr?: string): string {
  if (!dateStr) return ''
  // If date includes time e.g. "2026-06-30T10:00:00Z"
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0]
  }
  return dateStr
}

/**
 * Filter appointments matching a specific date "YYYY-MM-DD"
 */
export function getAppointmentsForDate(
  appointments: AppointmentDto[],
  dateStr: string
): AppointmentDto[] {
  const target = normalizeDate(dateStr)
  return appointments.filter((app) => normalizeDate(app.appointmentDate) === target)
}
