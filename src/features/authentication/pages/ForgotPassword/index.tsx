import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { authService } from '../../../../api/services/authService'
import nexusMindLogo from '@/assets/UpdatedNexusMindNavbarLogo.svg'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentMessage, setSentMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const msg = await authService.forgotPassword({ email: email.trim() })
      setSentMessage(typeof msg === 'string' && msg ? msg : 'OTP təsdiq kodu e-poçt ünvanınıza göndərildi.')
    } catch {
      setError('Şifrə bərpa kodu göndərilmədi. Zəhmət olmasa e-poçt ünvanınızı yoxlayın.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1e2038] rounded-3xl shadow-2xl border border-white/5 p-8 sm:p-10 space-y-6">
      <img src={nexusMindLogo} alt="NexusMind Loqosu" className="h-9 w-auto object-contain" />

      <div>
        <h1 className="text-2xl font-bold text-white">Şifrəni Unutmusunuz?</h1>
        <p className="text-xs text-slate-400 mt-1">
          Şifrə bərpa OTP kodunu almaq üçün qeydiyyatlı e-poçt ünvanınızı daxil edin.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {sentMessage ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{sentMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`)}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold cursor-pointer"
          >
            Şifrəni Yeniləməyə Davam Et
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              E-poçt Ünvanı
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siz@nexusmind.az"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2a2c4e] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2c2d67] to-[#34357d] border border-violet-500/30 hover:border-violet-400 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Bərpa Kodunu Göndər</span>
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Giriş səhifəsinə qayıt</span>
      </Link>
    </div>
  )
}
