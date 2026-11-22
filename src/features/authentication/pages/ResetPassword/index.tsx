import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react'
import { authService } from '../../../../api/services/authService'
import nexusMindLogo from '@/assets/UpdatedNexusMindNavbarLogo.svg'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const msg = await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      })
      setSuccessMsg(typeof msg === 'string' && msg ? msg : 'Password reset successfully.')
      setTimeout(() => navigate('/login'), 1500)
    } catch {
      setError('Failed to reset password. Verify OTP and password rules (8+ chars, A-Z, a-z, 0-9).')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1e2038] rounded-3xl shadow-2xl border border-white/5 p-8 sm:p-10 space-y-6">
      <img src={nexusMindLogo} alt="NexusMind Logo" className="h-9 w-auto object-contain" />

      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-violet-400" />
          <span>Reset Password</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter the OTP sent to your email and set your new password.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a2c4e] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">OTP Code *</label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a2c4e] border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">New Password *</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 8 chars, upper + lower + number"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a2c4e] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Confirm Password *</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a2c4e] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2c2d67] to-[#34357d] border border-violet-500/30 hover:border-violet-400 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Reset Password</span>
        </button>
      </form>

      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Sign In</span>
      </Link>
    </div>
  )
}
