import { createBrowserRouter } from 'react-router-dom'
import { authRoutes } from './authRoutes'
import { organizationRoutes } from './organizationRoutes'
import { platformRoutes } from './platformRoutes'
import { psychologistRoutes } from './psychologistRoutes'
import { AuthGuard } from '../permissions/guards'
import DashboardLayout from '../layouts/DashboardLayout'
import DashboardOverview from '../features/dashboard/pages/DashboardOverview'

export const router = createBrowserRouter([
  authRoutes,
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },
        ],
      },
      organizationRoutes,
      platformRoutes,
      psychologistRoutes,
    ],
  },
  {
    path: '*',
    element: <div className="p-8 text-center text-xl font-bold">404 - Page Not Found</div>,
  },
])
