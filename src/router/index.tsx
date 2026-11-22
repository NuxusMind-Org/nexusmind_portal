import { createBrowserRouter, Navigate } from 'react-router-dom'
import { authRoutes } from './authRoutes'
import { organizationRoutes } from './organizationRoutes'
import { platformRoutes } from './platformRoutes'
import { psychologistRoutes } from './psychologistRoutes'
import { AuthGuard } from '../permissions/guards'
import DashboardLayout from '../layouts/DashboardLayout'
import DashboardOverview from '../features/dashboard/pages/DashboardOverview'
import ProfileSettings from '../features/profile/pages/ProfileSettings'
import { useUserStore } from '../store/userStore'
import { getInitialRouteForRole } from '../utils/navigation'

function RootRedirect() {
  const profile = useUserStore((state) => state.profile)
  return <Navigate to={getInitialRouteForRole(profile?.role)} replace />
}

function DashboardRouteGuard() {
  const profile = useUserStore((state) => state.profile)
  if (profile?.role === 'psychologist') {
    return <Navigate to="/psy" replace />
  }
  if (profile?.role === 'seo') {
    return <Navigate to="/org/seo" replace />
  }
  return <DashboardOverview />
}

export const router = createBrowserRouter([
  authRoutes,
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardRouteGuard />,
          },
        ],
      },
      {
        path: 'profile',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ProfileSettings />,
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
