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
          element: <div>Platforma Təşkilatları</div>,
        },
        {
          path: 'analytics',
          element: <div>Platforma Analitikası</div>,
        },
      ],
    },
  ],
}
