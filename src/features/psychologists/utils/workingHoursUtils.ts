import type { LocalTimeValue, WorkingRangeDto } from '../../../types/portalDtos'
import { extractHourMinute } from './appointmentUtils'

const pad = (n: number) => n.toString().padStart(2, '0')

/** Serializes hour/minute to the backend LocalTime wire format "HH:mm:ss". */
export function toLocalTimeString(hour: number, minute = 0): string {
  return `${pad(hour)}:${pad(minute)}:00`
}

/** End-of-block serializer: LocalTime cannot express 24:00, so the last block of the day ends at 23:59:59. */
export function toEndLocalTimeString(endHour: number): string {
  return endHour >= 24 ? '23:59:59' : toLocalTimeString(endHour)
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

/** Returns the whole hours (0-23) that overlap a range. */
export function rangeToHours(range: WorkingRangeDto): number[] {
  const start = toMinutes(range.startTime)
  const end = toMinutes(range.endTime, true)
  const hours: number[] = []
  for (let h = 0; h < 24; h++) {
    if (start < (h + 1) * 60 && end > h * 60) hours.push(h)
  }
  return hours
}

/** Groups ranges by date (YYYY-MM-DD). */
export function groupRangesByDate(ranges: WorkingRangeDto[]): Record<string, WorkingRangeDto[]> {
  return ranges.reduce<Record<string, WorkingRangeDto[]>>((acc, range) => {
    if (!range.date) return acc
    const key = range.date.slice(0, 10)
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

/** Merges a list of hours into contiguous [startHour, endHour) blocks. */
export function hoursToBlocks(hours: number[]): Array<{ startHour: number; endHour: number }> {
  const sorted = [...new Set(hours)].sort((a, b) => a - b)
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

export function sameHours(a: number[] = [], b: number[] = []): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i])
}
