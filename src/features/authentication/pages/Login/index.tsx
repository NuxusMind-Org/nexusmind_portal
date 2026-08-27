import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../../../../store/authStore'
import { useUserStore } from '../../../../store/userStore'
import { authService } from '../../../../api/services/authService'
import { loginSchema, type LoginFields } from '../../schemas/loginSchema'
import { parseJwt } from '../../../../utils/jwt'
import { normalizeRole, ROLES } from '../../../../constants/roles'
import type { AuthResponse } from '../../../../types/portalDtos'

type RoleCandidate = 'SUPER_ADMIN' | 'BPM' | 'DOCTOR'

export default function Login() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const setTenantId = useAuthStore((state) => state.setTenantId)
  const setProfile = useUserStore((state) => state.setProfile)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const attemptLoginByRole = async (role: RoleCandidate, credentials: LoginFields): Promise<{ res: AuthResponse; roleUsed: string }> => {
    let res: AuthResponse

    switch (role) {
      case 'SUPER_ADMIN':
        res = await authService.superAdminLogin({
          username: credentials.username,
          password: credentials.password,
        })
        break
      case 'BPM':
        res = await authService.bpmLogin({
          username: credentials.username,
          password: credentials.password,
        })
        break
      case 'DOCTOR':
        res = await authService.doctorPanelLogin({
          email: credentials.username,
          password: credentials.password,
        })
        break
    }

    return { res, roleUsed: role }
  }

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true)
    setApiError(null)

    try {
      let authResult: { res: AuthResponse; roleUsed: string } | null = null
      const candidateRoles: RoleCandidate[] = ['SUPER_ADMIN', 'BPM', 'DOCTOR']
      let lastErr: unknown = null

      // Auto-detect role by attempting endpoints sequentially
      for (const candidate of candidateRoles) {
        try {
          authResult = await attemptLoginByRole(candidate, data)
          if (authResult?.res) break
        } catch (err) {
          lastErr = err
        }
      }

      if (!authResult && lastErr) {
        throw lastErr
      }

      if (!authResult) {
        throw new Error('Authentication failed. Invalid username or password.')
      }

      const { res, roleUsed } = authResult
      const token = res.token || res.accessToken || (typeof res === 'string' ? res : '')

      if (!token) {
        throw new Error('Invalid token received from server.')
      }

      // Parse claims from JWT token
      const claims = parseJwt(token)
      const rawRole = res.role || claims?.role || (claims?.roles && claims.roles[0]) || roleUsed
      const normalizedRole = normalizeRole(rawRole)

      // Store Auth token and Tenant ID
      setToken(token)
      setTenantId(claims?.tenantId || null)

      // Extract numeric ID for psychologist / doctor or standard user ID
      const numericDoctorId =
        (claims?.doctorId && typeof claims.doctorId === 'number' ? claims.doctorId : undefined) ??
        (claims?.doctor_id && typeof claims.doctor_id === 'number' ? claims.doctor_id : undefined) ??
        (claims?.id && typeof claims.id === 'number' ? claims.id : undefined) ??
        (claims?.userId && typeof claims.userId === 'number' ? claims.userId : undefined) ??
        (claims?.user_id && typeof claims.user_id === 'number' ? claims.user_id : undefined) ??
        ((res as { doctorId?: number; id?: number })?.doctorId) ??
        (typeof (res as { doctorId?: number; id?: number })?.id === 'number' ? (res as { doctorId?: number; id?: number }).id : undefined) ??
        (claims?.sub && !isNaN(Number(claims.sub)) ? Number(claims.sub) : undefined) ??
        (normalizedRole === ROLES.PSYCHOLOGIST ? 1 : undefined)

      const resolvedId = String(numericDoctorId ?? claims?.sub ?? 1)

      // Store User Profile
      setProfile({
        id: resolvedId,
        doctorId: numericDoctorId ?? (normalizedRole === ROLES.PSYCHOLOGIST ? 1 : undefined),
        name: typeof claims?.username === 'string' ? claims.username : data.username,
        email: typeof claims?.email === 'string' ? claims.email : (data.username.includes('@') ? data.username : `${data.username}@nexusmind.com`),
        role: normalizedRole,
        permissions: [],
        tenantId: claims?.tenantId || null,
      })

      navigate('/dashboard')
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as Error)?.message ||
        'Invalid username or password. Please verify your credentials.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1100px] bg-[#1e2038] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 grid grid-cols-1 md:grid-cols-2">
      {/* Left Pane: Form */}
      <div className="p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-center min-h-[500px] md:min-h-[580px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/nexusMindLogoMin.png" alt="NexusMind Logo" className="h-[41.4px] w-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t('auth.signIn')}</h1>
        <p className="text-xs text-slate-400 font-medium mb-8">
          Access your NexusMind Portal account with your role credentials.
        </p>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium leading-relaxed">
            {apiError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl bg-[#2a2c4e] border text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${
                errors.username ? 'border-rose-500/70 focus:ring-rose-500/30 focus:border-rose-500' : 'border-white/10 hover:border-white/20'
              }`}
              {...register('username')}
            />
            {errors.username && (
              <span className="text-xs text-rose-400 font-medium block mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block" htmlFor="password">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                disabled={isLoading}
                className={`w-full pl-4 pr-12 py-3 rounded-xl bg-[#2a2c4e] border text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${
                  errors.password ? 'border-rose-500/70 focus:ring-rose-500/30 focus:border-rose-500' : 'border-white/10 hover:border-white/20'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-400 font-medium block mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-[10px] font-bold text-[#b4a4df] hover:text-[#c4b7ec] tracking-widest uppercase transition-colors inline-block"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#2c2d67] to-[#34357d] border border-violet-500/30 hover:border-violet-400 text-white font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(139,92,246,0.15)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('auth.signIn')}...</span>
              </>
            ) : (
              <span>{t('auth.signIn')}</span>
            )}
          </button>
        </form>
      </div>

      {/* Right Pane: Image */}
      <div className="hidden md:block w-full h-full relative overflow-hidden">
        <img
          src="/loginImg.jpg"
          alt="Portal Login Illustration"
          className="w-full h-full object-cover scale-[1.04] origin-center"
        />
      </div>
    </div>
  )
}
