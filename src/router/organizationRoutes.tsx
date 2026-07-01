import type { RouteObject } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { RoleGuard } from '../permissions/guards'
import SeoManagement from '../features/seo/pages/SeoManagement'
import PsychologistsList from '../features/psychologists/pages/PsychologistsList'
import OrgPatientsList from '../features/patients/pages/OrgPatientsList'
import OrgAnalytics from '../features/analytics/pages/OrgAnalytics'

export const organizationRoutes: RouteObject = {
  path: 'org',
  element: <RoleGuard allowedRoles={['org_admin', 'platform_admin']} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          path: 'users',
          element: <div>Org Users Page Placeholder</div>,
        },
        {
          path: 'settings',
          element: <div>Org Settings Page Placeholder</div>,
        },
        {
          path: 'seo',
          element: <SeoManagement />,
        },
        {
          path: 'psychologists',
          element: <PsychologistsList />,
        },
        {
          path: 'patients',
          element: <OrgPatientsList />,
        },
        {
          path: 'analytics',
          element: <OrgAnalytics />,
        },
      ],
    },
  ],
}

