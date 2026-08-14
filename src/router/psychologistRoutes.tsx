import type { RouteObject } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { RoleGuard } from '../permissions/guards'
import { PatientsList } from '../features/patients/pages'
import { SessionsOverview } from '../features/sessions/pages'
import { PsychologistDashboard, PsychologistCalendar } from '../features/psychologists/pages'

export const psychologistRoutes: RouteObject = {
  path: 'psy',
  element: <RoleGuard allowedRoles={['psychologist', 'platform_admin']} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <PsychologistDashboard />,
        },
        {
          path: 'calendar',
          element: <PsychologistCalendar />,
        },
        {
          path: 'patients',
          element: <PatientsList />,
        },
        {
          path: 'sessions',
          element: <SessionsOverview />,
        },
      ],
    },
  ],
}
