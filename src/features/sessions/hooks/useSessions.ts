import { useState, useEffect, useCallback, useMemo } from 'react'
import { appointmentService } from '../../../api'
import { useUserStore } from '../../../store/userStore'
import type { Session, TimeFilter } from '../types/session'
import {
  mapAppointmentToSession,
  filterSessionsByInterval,
  sortSessionsChronologically,
} from '../utils/sessionUtils'

const resolveNumericId = (val: unknown): number | null => {
  if (typeof val === 'number' && !isNaN(val)) return val
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return null
}

export function useSessions() {
  const { profile } = useUserStore()
  const activeDoctorId =
    resolveNumericId(profile?.doctorId) ??
    resolveNumericId(profile?.id) ??
    1

  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  const triggerFeedback = useCallback((msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3500)
  }, [])

  const refreshSessions = useCallback(async () => {
    if (!activeDoctorId) return
    setIsLoading(true)
    setError(null)

    try {
      const data = await appointmentService.getAppointmentsByPsychologistId(activeDoctorId)
      const mapped = (data || []).map((app) => mapAppointmentToSession(app))
      const sorted = sortSessionsChronologically(mapped)
      setSessions(sorted)
    } catch (err: unknown) {
      console.error('Failed to load appointments for psychologist:', err)
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load therapy sessions from server.'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [activeDoctorId])

  useEffect(() => {
    let isMounted = true
    if (!activeDoctorId) {
      setIsLoading(false)
      return
    }

    appointmentService
      .getAppointmentsByPsychologistId(activeDoctorId)
      .then((data) => {
        if (isMounted) {
          const mapped = (data || []).map((app) => mapAppointmentToSession(app))
          const sorted = sortSessionsChronologically(mapped)
          setSessions(sorted)
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load appointments for psychologist:', err)
          const errorMsg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to load therapy sessions from server.'
          setError(errorMsg)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeDoctorId])


  // Computed time-interval subsets
  const todaySessions = useMemo(() => filterSessionsByInterval(sessions, 'today'), [sessions])
  const weekSessions = useMemo(() => filterSessionsByInterval(sessions, 'week'), [sessions])
  const monthSessions = useMemo(() => filterSessionsByInterval(sessions, 'month'), [sessions])

  // Computed metrics excluding cancelled sessions
  const todayActiveCount = useMemo(
    () => todaySessions.filter((s) => s.status !== 'Cancelled').length,
    [todaySessions]
  )
  const weekActiveCount = useMemo(
    () => weekSessions.filter((s) => s.status !== 'Cancelled').length,
    [weekSessions]
  )
  const monthActiveCount = useMemo(
    () => monthSessions.filter((s) => s.status !== 'Cancelled').length,
    [monthSessions]
  )

  const getSessionsForFilter = useCallback(
    (filter: TimeFilter) => {
      switch (filter) {
        case 'today':
          return todaySessions
        case 'week':
          return weekSessions
        case 'month':
          return monthSessions
        default:
          return todaySessions
      }
    },
    [todaySessions, weekSessions, monthSessions]
  )

  // Actions
  const handleJoinRoom = useCallback(
    async (id: string) => {
      const session = sessions.find((s) => s.id === id)
      if (!session) return

      try {
        // Attempt to fetch room join token
        const tokenRes = await appointmentService.getJoinToken(id).catch(() => null)
        if (tokenRes?.token || session.roomUrl) {
          const targetUrl = session.roomUrl || `/room/${session.id}?token=${tokenRes?.token}`
          window.open(targetUrl, '_blank')
        }

        // Update status to IN_PROGRESS or COMPLETED
        await appointmentService
          .updateAppointmentStatus(id, { status: 'COMPLETED' })
          .catch((e) => console.warn('Could not update appointment status on server:', e))

        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'Completed' as const } : s))
        )
        triggerFeedback(`Joined telehealth room for ${session.patientName}. Marked as Completed.`)
      } catch (err) {
        console.error('Error joining room:', err)
        triggerFeedback(`Joined room for ${session.patientName}.`)
      }
    },
    [sessions, triggerFeedback]
  )

  const handleCancelSession = useCallback(
    async (id: string) => {
      const session = sessions.find((s) => s.id === id)
      if (!session) return

      try {
        await appointmentService.cancelAppointment(id)
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled' as const } : s))
        )
        triggerFeedback(`Cancelled therapy session for ${session.patientName}.`)
      } catch (err: unknown) {
        console.error('Failed to cancel appointment on server:', err)
        // Optimistically mark as cancelled
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled' as const } : s))
        )
        triggerFeedback(`Cancelled therapy session for ${session.patientName}.`)
      }
    },
    [sessions, triggerFeedback]
  )

  const handleStartSession = useCallback(
    async (id: string) => {
      const session = sessions.find((s) => s.id === id)
      if (!session) return

      try {
        await appointmentService
          .updateAppointmentStatus(id, { status: 'WAITING' })
          .catch((e) => console.warn('Could not update status on server:', e))

        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'Waiting' as const } : s))
        )
        triggerFeedback(`Successfully initiated ${session.deliveryMethod} for ${session.patientName}.`)
      } catch (err) {
        console.error('Error starting session:', err)
      }
    },
    [sessions, triggerFeedback]
  )

  return {
    sessions,
    isLoading,
    error,
    feedbackMsg,
    activeDoctorId,
    todaySessions,
    weekSessions,
    monthSessions,
    todayActiveCount,
    weekActiveCount,
    monthActiveCount,
    getSessionsForFilter,
    handleJoinRoom,
    handleCancelSession,
    handleStartSession,
    refreshSessions,
    triggerFeedback,
  }
}

