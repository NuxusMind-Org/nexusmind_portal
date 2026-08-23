import type { AppointmentDto, AppointmentMode, AppointmentStatus } from '../../../types/portalDtos'

export interface Session {
  id: string
  numericId?: number
  patientName: string
  patientAvatarColor: string
  time: string // e.g. "09:00 AM - 10:00 AM"
  startTime?: string // "09:00"
  endTime?: string // "10:00"
  date: string // ISO string "YYYY-MM-DD"
  dateLabel: string // user friendly date label like "Today", "Tomorrow", "July 3, 2026"
  type: string
  status: 'Completed' | 'Waiting' | 'Scheduled' | 'Cancelled'
  rawStatus?: AppointmentStatus
  deliveryMethod: 'Online Meeting' | 'VR Session'
  rawMode?: AppointmentMode
  roomUrl?: string
  hasNote?: boolean
  rawAppointment?: AppointmentDto
}

export type TimeFilter = 'today' | 'week' | 'month'

