export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  avatarColor: string
  status: 'Active' | 'On Hold' | 'Discharged'
  priority: 'High' | 'Medium' | 'Normal'
  tag: string
  lastSession: string
  nextSession: string
  mood: string
}
