import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Loader2 } from 'lucide-react'

import { useAuthStore } from '../../../../store/authStore'
import { useUserStore } from '../../../../store/userStore'
import { loginSchema, type LoginFields } from '../../schemas/loginSchema'
import { MOCK_USERS } from '../../constants/mockUsers'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
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
    <div className="w-full">
      {/* Logo & Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.829a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.828c.292-.241.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.829a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">NexusMind</span>
        </div>
        <p className="text-sm text-slate-400 font-medium">Sign in to your enterprise account</p>
      </div>

      {/* API / General Error Message */}
      {apiError && (
        <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium leading-relaxed">
          {apiError}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="name@company.com"
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-[#212330] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all ${
              errors.email ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-[#2e3146]'
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-[#212330] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all ${
              errors.password ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-[#2e3146]'
            }`}
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs text-rose-400 font-medium block mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2e3146]"></div>
        </div>
        <span className="relative px-3 bg-[#161722] text-xs font-medium text-slate-500 uppercase">or</span>
      </div>

      {/* SSO Buttons */}
      <div className="space-y-3">
        {/* Google SSO */}
        <button
          type="button"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1b1d2a] border border-[#2a2d3e] hover:bg-[#232637] text-slate-200 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-slate-400" />
          <span>Sign in with Google</span>
        </button>

        {/* Microsoft SSO */}
        <button
          type="button"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1b1d2a] border border-[#2a2d3e] hover:bg-[#232637] text-slate-200 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
          </svg>
          <span>Sign in with Microsoft</span>
        </button>
      </div>
    </div>
  )
}
