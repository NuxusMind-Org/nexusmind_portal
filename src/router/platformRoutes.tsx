import type { RouteObject } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { RoleGuard } from '../permissions/guards'

export const platformRoutes: RouteObject = {
  path: 'platform',
  element: <RoleGuard allowedRoles={['platform_admin']} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          path: 'organizations',
          element: <div>Platform Organizations Placeholder</div>,
        },
        {
          path: 'analytics',
          element: <div>Platform Analytics Placeholder</div>,
        },
      ],
    },
  ],
}
