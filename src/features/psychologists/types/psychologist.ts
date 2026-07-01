// Psychologists Feature — TypeScript Types

export type PsychologistStatus = 'Active' | 'On Leave' | 'Inactive'

export type Specialization =
  | 'Cognitive Behavioral Therapy'
  | 'Anxiety & Depression'
  | 'Trauma & PTSD'
  | 'Couples Therapy'
  | 'Child Psychology'
  | 'Grief Integration'
  | 'Addiction Recovery'
  | 'Mindfulness-Based Therapy'
  | 'Neuropsychology'
  | string

export interface Psychologist {
  id: string
  name: string
  email: string
  phone: string
  avatarInitials: string
  avatarColor: string
  status: PsychologistStatus
  specializations: Specialization[]
  patientCount: number
  sessionCount: number
  satisfactionRate: number // 0–100
  nextAvailability: string
  joinedDate: string
  licenseNumber: string
}
