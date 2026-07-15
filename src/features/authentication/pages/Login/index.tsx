import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../../../../store/authStore'
import { useUserStore } from '../../../../store/userStore'
import { loginSchema, type LoginFields } from '../../schemas/loginSchema'
import { MOCK_USERS } from '../../constants/mockUsers'

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
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      // Simulate API network call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const mockUser = MOCK_USERS[data.email.toLowerCase()]
      
      if (mockUser && data.password === 'Password123!') {
        setToken(mockUser.token)
        setTenantId(mockUser.profile.tenantId)
        setProfile(mockUser.profile)
        
        navigate('/dashboard')
      } else {
        setApiError('Invalid credentials. Try: superadmin@nexusmind.com, orgadmin@nexusmind.com, or psychologist@nexusmind.com with password Password123!')
      }
    } catch (error) {
      setApiError('An unexpected server error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1100px] bg-[#1e2038] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 grid grid-cols-1 md:grid-cols-2">
      {/* Left Pane: Form */}
      <div className="p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-center min-h-[500px] md:min-h-[580px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 md:mb-12">
          <img src="/nexusMindLogoMin.png" alt="NexusMind Logo" className="h-[41.4px] w-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">{t('auth.signIn')}</h1>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium leading-relaxed">
            {apiError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block" htmlFor="email">
              {t('auth.emailLabel')}
            </label>
            <input
              id="email"
              type="text"
              placeholder={t('auth.emailPlaceholder')}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl bg-[#2a2c4e] border text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${
                errors.email ? 'border-rose-500/70 focus:ring-rose-500/30 focus:border-rose-500' : 'border-white/10 hover:border-white/20'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-rose-400 font-medium block mt-1">
                {errors.email.message}
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
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

          {/* Forgot Password Link (aligned right) */}
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
