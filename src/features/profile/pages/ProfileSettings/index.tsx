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
import type { ProfileLanguage, ProfileStatus } from '../../../../types/portalDtos'

export default function ProfileSettings() {
  const profile = useUserStore((state) => state.profile)
  const setProfile = useUserStore((state) => state.setProfile)

  const nameParts = (profile?.name || '').split(' ')
  const [name, setName] = useState(nameParts[0] || '')
  const [surname, setSurname] = useState(nameParts.slice(1).join(' ') || '')
  const [newEmail, setNewEmail] = useState(profile?.email || '')
  const [status, setStatus] = useState<ProfileStatus>('ISCI')
  const [language, setLanguage] = useState<ProfileLanguage>('AZ')
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
      notify('success', 'Name updated via PUT /profile/name.')
    } catch {
      notify('error', 'Failed to update name.')
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
      notify('success', 'Email updated via PUT /profile/email.')
    } catch {
      notify('error', 'Failed to update email.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleUpdatePreferences = async () => {
    setBusyAction('prefs')
    try {
      await Promise.all([
        profileService.updateStatus({ status }),
        profileService.updateLanguage({ language }),
      ])
      notify('success', 'Status & language saved via PUT /profile/status and PUT /profile/language.')
    } catch {
      notify('error', 'Failed to update profile preferences.')
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
      notify('success', `Two-factor authentication ${next ? 'enabled' : 'disabled'} via PUT /profile/2fa.`)
    } catch {
      notify('error', 'Failed to update two-factor authentication.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleUploadPhoto = async (file: File, isDoctorPublic = false) => {
    setBusyAction(isDoctorPublic ? 'doctorPhoto' : 'photo')
    try {
      if (isDoctorPublic) {
        await doctorService.uploadProfileImage(file)
        notify('success', 'Doctor profile image uploaded via POST /appointments/doctors/me/profile-image.')
      } else {
        await profileService.uploadPhoto(file)
        notify('success', 'Profile photo uploaded via POST /profile/photo.')
      }
    } catch {
      notify('error', 'Failed to upload photo.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleDeletePhoto = async () => {
    setBusyAction('deletePhoto')
    try {
      await profileService.deletePhoto()
      notify('success', 'Profile photo removed via DELETE /profile/photo.')
    } catch {
      notify('error', 'Failed to remove profile photo.')
    } finally {
      setBusyAction(null)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      notify('error', 'New password and confirmation do not match.')
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
      notify('success', 'Password changed via PUT /auth/change-password.')
    } catch {
      notify('error', 'Failed to change password. Ensure password is 8+ chars with upper, lower, and digit.')
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
            <span>Account Profile & Security</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[10px] font-mono">
              /profile/*
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage personal details, avatar, language preferences, 2FA, and password.
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
            <span>Personal Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">First Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Surname</label>
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
            <span>Save Name</span>
          </button>
        </form>

        {/* Email */}
        <form onSubmit={handleUpdateEmail} className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-400" />
            <span>Email Address</span>
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">New Email (newEmail) *</label>
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
            <span>Update Email</span>
          </button>
        </form>

        {/* Status, Language & 2FA */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Preferences & Two-Factor Security</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Profile Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProfileStatus)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="TELEBE">TELEBE</option>
                <option value="ISCI">ISCI</option>
                <option value="DIGER">DIGER</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ProfileLanguage)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="AZ">AZ</option>
                <option value="EN">EN</option>
                <option value="RU">RU</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdatePreferences}
            disabled={busyAction === 'prefs'}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busyAction === 'prefs' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Preferences</span>
          </button>

          <div className="pt-4 border-t border-[#222437] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">PUT /profile/2fa?enabled={String(!twoFactorEnabled)}</p>
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
              {twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        {/* Avatar & Doctor Profile Image */}
        <div className="bg-[#141521] border border-[#222437] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Profile Photo</span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload or remove your account avatar (<code className="text-indigo-300">POST/DELETE /profile/photo</code>).
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-2">
              {busyAction === 'photo' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              <span>Upload Avatar</span>
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
              <span>Delete Photo</span>
            </button>
          </div>

          {profile?.role === 'psychologist' && (
            <div className="pt-4 border-t border-[#222437] space-y-2">
              <p className="text-xs font-bold text-slate-300">Doctor Public Profile Image</p>
              <p className="text-[11px] text-slate-500">
                Updates your public doctor photo via <code>POST /appointments/doctors/me/profile-image</code>.
              </p>
              <label className="inline-flex px-4 py-2 rounded-xl bg-[#1b1c2b] hover:bg-violet-500/20 border border-[#2e3146] text-slate-200 text-xs font-bold cursor-pointer items-center gap-2">
                {busyAction === 'doctorPhoto' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 text-violet-400" />}
                <span>Upload Doctor Profile Image</span>
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
            <span>Change Password (PUT /auth/change-password)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Password *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password *</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, A-Z, a-z, 0-9"
                className="w-full px-3.5 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm New Password *</label>
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
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  )
}
