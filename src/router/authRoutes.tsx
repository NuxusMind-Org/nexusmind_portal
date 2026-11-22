import { Navigate, type RouteObject } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../features/authentication/pages/Login'
import ForgotPassword from '../features/authentication/pages/ForgotPassword'
import ResetPassword from '../features/authentication/pages/ResetPassword'
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
          element: <ForgotPassword />,
        },
        {
          path: 'reset-password',
          element: <ResetPassword />,
        },
      ],
    },
  ],
}


