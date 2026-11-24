import { useState } from 'react'
import {
  User,
  Mail,
  Globe,
  Shield,
  KeyRound,
  Camera,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react'
import { profileService, authService, doctorService } from '../../../../api'
import { useUserStore } from '../../../../store/userStore'
import type { ProfileStatus } from '../../../../types/portalDtos'

export default function ProfileSettings() {
  const profile = useUserStore((state) => state.profile)
  const setProfile = useUserStore((state) => state.setProfile)

  const nameParts = (profile?.name || '').split(' ')
  const [name, setName] = useState(nameParts[0] || '')
  const [surname, setSurname] = useState(nameParts.slice(1).join(' ') || '')
  const [newEmail, setNewEmail] = useState(profile?.email || '')
  const [status, setStatus] = useState<ProfileStatus>('ISCI')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Password form (ChangePasswordRequest requires oldPassword, newPassword, confirmPassword)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusyAction('name')
    try {
      const res = await profileService.updateName({
        name: name.trim(),
        surname: surname.trim() || undefined,
      })
      if (profile) {
        setProfile({
          ...profile,
          name: [res.name || name.trim(), res.surname || surname.trim()].filter(Boolean).join(' '),
        })
      }
      notify('success', 'Ad və soyad uğurla yeniləndi.')
    } catch {
      notify('error', 'Ad və soyad yenilənə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return
    setBusyAction('email')
    try {
      const res = await profileService.updateEmail({ newEmail: newEmail.trim() })
      if (profile) {
        setProfile({ ...profile, email: res.email || newEmail.trim() })
      }
      notify('success', 'E-poçt ünvanı uğurla yeniləndi.')
    } catch {
      notify('error', 'E-poçt ünvanı yenilənə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleUpdatePreferences = async () => {
    setBusyAction('prefs')
    try {
      await profileService.updateStatus({ status })
      notify('success', 'Profil statusu yadda saxlanıldı.')
    } catch {
      notify('error', 'Profil tənzimləmələri yenilənə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleToggle2FA = async () => {
    const next = !twoFactorEnabled
    setBusyAction('2fa')
    try {
      await profileService.updateTwoFactor(next)
      setTwoFactorEnabled(next)
      notify('success', `İki mərhələli doğrulama (2FA) ${next ? 'aktivləşdirildi' : 'deaktiv edildi'}.`)
    } catch {
      notify('error', 'İki mərhələli doğrulama (2FA) yenilənə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleUploadPhoto = async (file: File, isDoctorPublic = false) => {
    setBusyAction(isDoctorPublic ? 'doctorPhoto' : 'photo')
    try {
      if (isDoctorPublic) {
        await doctorService.uploadProfileImage(file)
        notify('success', 'Həkim profil şəkli uğurla yükləndi.')
      } else {
        await profileService.uploadPhoto(file)
        notify('success', 'Profil şəkli uğurla yükləndi.')
      }
    } catch {
      notify('error', 'Şəkil yüklənə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleDeletePhoto = async () => {
    setBusyAction('deletePhoto')
    try {
      await profileService.deletePhoto()
      notify('success', 'Profil şəkli silindi.')
    } catch {
      notify('error', 'Profil şəkli silinə bilmədi.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      notify('error', 'Yeni şifrə və təsdiq uyğun gəlmir.')
      return
    }
    setBusyAction('password')
    try {
      await authService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      notify('success', 'Şifrə uğurla dəyişdirildi.')
    } catch {
      notify('error', 'Şifrə dəyişdirilə bilmədi. Şifrənin ən azı 8 simvol, böyük hərf, kiçik hərf və rəqəmdən ibarət olduğuna əmin olun.')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Hesab Profili və Təhlükəsizlik</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Şəxsi məlumatları, profil şəklini, 2FA təhlükəsizliyini və şifrəni idarə edin.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identity & Name */}
        <form onSubmit={handleUpdateName} className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-violet-400" />
            <span>Şəxsi Məlumatlar</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Ad *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Soyad</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busyAction === 'name'}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busyAction === 'name' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Adı Yadda Saxla</span>
          </button>
        </form>

        {/* Email */}
        <form onSubmit={handleUpdateEmail} className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-400" />
            <span>E-poçt Ünvanı</span>
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Yeni E-poçt *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={busyAction === 'email'}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busyAction === 'email' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>E-poçtu Yenilə</span>
          </button>
        </form>

        {/* Status & 2FA */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Tənzimləmələr və İki Mərhələli Təhlükəsizlik</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Profil Statusu</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProfileStatus)}
              className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="TELEBE">Tələbə</option>
              <option value="ISCI">İşçi</option>
              <option value="DIGER">Digər</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleUpdatePreferences}
            disabled={busyAction === 'prefs'}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busyAction === 'prefs' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Tənzimləmələri Yadda Saxla</span>
          </button>

          <div className="pt-4 border-t border-[#222437] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">İki Mərhələli Doğrulama (2FA)</p>
                <p className="text-[11px] text-slate-500">Hesab girişi üçün əlavə təhlükəsizlik qatı</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggle2FA}
              disabled={busyAction === '2fa'}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                twoFactorEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-[#1b1c2b] border-[#2e3146] text-slate-300 hover:text-white'
              }`}
            >
              {twoFactorEnabled ? 'Aktivdir' : '2FA Aktivləşdir'}
            </button>
          </div>
        </div>

        {/* Avatar & Doctor Profile Image */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Profil Şəkli</span>
          </h2>
          <p className="text-xs text-slate-400">
            Hesabınızın profil şəklini yükləyin və ya silin.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-2">
              {busyAction === 'photo' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              <span>Şəkil Yüklə</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUploadPhoto(file, false)
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleDeletePhoto}
              disabled={busyAction === 'deletePhoto'}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Şəkli Sil</span>
            </button>
          </div>

          {profile?.role === 'psychologist' && (
            <div className="pt-4 border-t border-[#222437] space-y-2">
              <p className="text-xs font-bold text-slate-300">Həkimin İctimai Profil Şəkli</p>
              <p className="text-[11px] text-slate-500">
                Pasiyentlərə görünən ictimai həkim şəklinizi yeniləyir.
              </p>
              <label className="inline-flex px-4 py-2 rounded-xl bg-[#1b1c2b] hover:bg-violet-500/20 border border-[#2e3146] text-slate-200 text-xs font-bold cursor-pointer items-center gap-2">
                {busyAction === 'doctorPhoto' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 text-violet-400" />}
                <span>Həkim Profil Şəkli Yüklə</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUploadPhoto(file, true)
                  }}
                />
              </label>
            </div>
          )}
        </div>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="lg:col-span-2 bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-rose-400" />
            <span>Şifrəni Dəyiş</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Cari Şifrə *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Yeni Şifrə *</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 simvol, A-Z, a-z, 0-9"
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Yeni Şifrəni Təsdiqləyin *</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busyAction === 'password'}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busyAction === 'password' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Şifrəni Yenilə</span>
          </button>
        </form>
      </div>
    </div>
  )
}
