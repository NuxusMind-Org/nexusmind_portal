import { Navigate, type RouteObject } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../features/authentication/pages/Login'
import { GuestGuard } from '../permissions/guards'

export const authRoutes: RouteObject = {
  path: '/',
  element: <GuestGuard />,
  children: [
    {
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'forgot-password',
          element: <div>Forgot Password Placeholder</div>,
        },
        {
          path: 'reset-password',
          element: <div>Reset Password Placeholder</div>,
        },
      ],
    },
  ],
}


