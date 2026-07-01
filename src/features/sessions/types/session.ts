export interface Session {
  id: string
  patientName: string
  patientAvatarColor: string
  time: string
  date: string // ISO string "YYYY-MM-DD"
  dateLabel: string // user friendly date label like "Today", "Tomorrow", "July 3, 2026"
  type: string
  status: 'Completed' | 'Waiting' | 'Scheduled' | 'Cancelled'
  deliveryMethod: 'Online Meeting' | 'VR Session'
}
