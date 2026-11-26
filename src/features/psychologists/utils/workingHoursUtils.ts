import type {
  LocalTime,
  LocalTimeValue,
  WorkingHoursBatchRequest,
  WorkingRangeDto,
} from '../../../types/portalDtos'
import { extractHourMinute } from './appointmentUtils'

const pad = (n: number) => n.toString().padStart(2, '0')

/** Serializes hour/minute to the backend wire format "HH:mm" (e.g. "10:00"). */
export function toLocalTimeString(hour: number, minute = 0): string {
  const safeHour = Math.min(23, Math.max(0, hour))
  return `${pad(safeHour)}:${pad(minute)}`
}

/** Serializes hour/minute to ISO LocalTime wire format "HH:mm:ss" (e.g. "09:00:00"). */
export function toIsoLocalTimeString(hour: number, minute = 0): string {
  const safeHour = Math.min(23, Math.max(0, hour))
  return `${pad(safeHour)}:${pad(minute)}:00`
}

/** Builds a WorkingHoursBatchRequest payload for POST /doctors/me/working-hours/batch. */
export function buildWorkingHoursBatchPayload(
  entries: Array<{ date: string; hours: number[] }>
): WorkingHoursBatchRequest {
  return {
    days: entries
      .map(({ date, hours }) => ({
        date,
        times: [...new Set(hours)]
          .filter((h) => h >= 0 && h <= 22)
          .sort((a, b) => a - b)
          .map((h) => toIsoLocalTimeString(h, 0)),
      }))
      .filter((day) => day.times.length > 0),
  }
}

/** Serializes hour/minute to short "HH:mm" string. */
export function toShortLocalTimeString(hour: number, minute = 0): string {
  return toLocalTimeString(hour, minute)
}

/** Serializes hour/minute to the OpenAPI LocalTime object shape { hour, minute, second, nano }. */
export function toLocalTimeObject(hour: number, minute = 0): LocalTime {
  const safeHour = Math.min(23, Math.max(0, hour))
  return { hour: safeHour, minute, second: 0, nano: 0 }
}

/**
 * End-of-block serializer in "HH:mm" format: clamps endHour to 23:00 so every range ends on a whole hour
 * within the same calendar date (01:00..23:00).
 */
export function toEndLocalTimeString(endHour: number): string {
  return toLocalTimeString(Math.min(23, Math.max(1, endHour)), 0)
}

/**
 * Normalizes a WorkingRangeDto date ("DD.MM.YYYY" such as "20.11.2026" or "YYYY-MM-DD")
 * to ISO "YYYY-MM-DD" so UI grids and Schedule lookups match reliably.
 */
export function normalizeWorkingRangeDate(raw?: string | null): string {
  if (!raw) return ''
  const trimmed = raw.trim().slice(0, 10)
  const dmy = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(trimmed)
  if (dmy) {
    return `${dmy[3]}-${dmy[2]}-${dmy[1]}`
  }
  return trimmed
}

/** Converts a LocalTime value to minutes since midnight. "00:00" as an end time is treated as 24:00. */
export function toMinutes(time: LocalTimeValue | undefined | null, isEnd = false): number {
  if (time === undefined || time === null) return isEnd ? 24 * 60 : 0
  const { hour, minute } = extractHourMinute(time)
  const total = hour * 60 + minute
  return isEnd && total === 0 ? 24 * 60 : total
}

export function formatLocalTime(time: LocalTimeValue | undefined | null, isEnd = false): string {
  const total = toMinutes(time, isEnd)
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

/** Returns the whole hours (0-22) that overlap a range. */
export function rangeToHours(range: WorkingRangeDto): number[] {
  const start = toMinutes(range.startTime)
  const end = toMinutes(range.endTime, true)
  const hours: number[] = []
  for (let h = 0; h < 23; h++) {
    if (start < (h + 1) * 60 && end > h * 60) hours.push(h)
  }
  return hours
}

/** Groups ranges by normalized ISO date (YYYY-MM-DD). */
export function groupRangesByDate(ranges: WorkingRangeDto[]): Record<string, WorkingRangeDto[]> {
  return ranges.reduce<Record<string, WorkingRangeDto[]>>((acc, range) => {
    const key = normalizeWorkingRangeDate(range.date)
    if (!key) return acc
    ;(acc[key] ||= []).push(range)
    return acc
  }, {})
}

/** Builds a date -> sorted unique hours map from ranges. */
export function rangesToHourMap(ranges: WorkingRangeDto[]): Record<string, number[]> {
  const grouped = groupRangesByDate(ranges)
  const map: Record<string, number[]> = {}
  Object.entries(grouped).forEach(([date, list]) => {
    const set = new Set<number>()
    list.forEach((r) => rangeToHours(r).forEach((h) => set.add(h)))
    map[date] = [...set].sort((a, b) => a - b)
  })
  return map
}

/**
 * Merges a list of start hours (0..22) into contiguous [startHour, endHour) blocks
 * where endHour <= 23 so both startTime and endTime are valid whole-hour LocalTime values.
 */
export function hoursToBlocks(hours: number[]): Array<{ startHour: number; endHour: number }> {
  const sorted = [...new Set(hours)].filter((h) => h >= 0 && h <= 22).sort((a, b) => a - b)
  const blocks: Array<{ startHour: number; endHour: number }> = []
  sorted.forEach((h) => {
    const last = blocks[blocks.length - 1]
    if (last && last.endHour === h) {
      last.endHour = h + 1
    } else {
      blocks.push({ startHour: h, endHour: h + 1 })
    }
  })
  return blocks
}

/** Checks whether an existing WorkingRangeDto matches a [startHour, endHour) block. */
export function rangeMatchesBlock(
  range: WorkingRangeDto,
  block: { startHour: number; endHour: number }
): boolean {
  return (
    toMinutes(range.startTime) === block.startHour * 60 &&
    toMinutes(range.endTime, true) === block.endHour * 60
  )
}

export function sameHours(a: number[] = [], b: number[] = []): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i])
}

/**
 * Extracts a human-readable error message from Axios/Spring Boot responses
 * (supports message, detail, title, errors[], fieldErrors, and plain string bodies).
 */
export function extractBackendError(error: unknown, fallback: string): string {
  const resp = (error as { response?: { status?: number; data?: unknown } })?.response
  const data = resp?.data
  if (typeof data === 'string' && data.trim()) {
    return data.trim()
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === 'string' && obj.message.trim()) return obj.message.trim()
    if (typeof obj.detail === 'string' && obj.detail.trim()) return obj.detail.trim()
    if (Array.isArray(obj.errors) && obj.errors.length > 0) {
      const first = obj.errors[0]
      if (typeof first === 'string') return first
      if (first && typeof first === 'object' && 'defaultMessage' in first) {
        return String((first as { defaultMessage: unknown }).defaultMessage)
      }
    }
    if (obj.errors && typeof obj.errors === 'object' && !Array.isArray(obj.errors)) {
      const entries = Object.entries(obj.errors as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(', ')
      if (entries) return entries
    }
    if (typeof obj.title === 'string' && obj.title.trim()) {
      return typeof obj.error === 'string' ? `${obj.title} (${obj.error})` : obj.title
    }
    if (typeof obj.error === 'string' && obj.error.trim()) return obj.error.trim()
  }
  return (error as Error)?.message || fallback
}
