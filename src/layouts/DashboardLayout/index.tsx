import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LayoutDashboard, 
  Calendar, 
  UserSquare2, 
  LogOut,
  HelpCircle,
  Plus,
  Search,
  Menu,
  Users,
  Newspaper,
  BookOpen,
  FileText,
  Image as ImageIcon,
  SearchCheck,
} from 'lucide-react'

import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { useSidebarStore } from '../../store/sidebarStore'
import LanguageSelector from '../../features/dashboard/components/LanguageSelector'

export default function DashboardLayout() {
  const profile = useUserStore((state) => state.profile)
  const clearProfile = useUserStore((state) => state.clearProfile)
  const logout = useAuthStore((state) => state.logout)
  const { isOpen, toggle, setOpen } = useSidebarStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearProfile()
    localStorage.removeItem('nexusmind-auth')
    localStorage.removeItem('nexusmind-user-profile')
    sessionStorage.clear()
    navigate('/login')
  }

  // Sidebar navigation items based on user role
  const getNavItems = () => {
    const role = profile?.role
    
    if (role === 'platform_admin') {
      return [
        { label: 'Dashboard',      path: '/dashboard',          icon: LayoutDashboard },
        { label: 'News (Xəbər)',    path: '/org/xeber',          icon: Newspaper },
        { label: 'Articles (Məqalə)', path: '/org/meqale',        icon: BookOpen },
        { label: 'Blog Posts',     path: '/org/blogs',          icon: FileText },
        { label: 'Gallery',        path: '/org/gallery',        icon: ImageIcon },
        { label: 'Psychologists',  path: '/org/psychologists',  icon: UserSquare2 },
        { label: 'Patients',       path: '/org/patients',       icon: Users },
      ]
    }
    
    if (role === 'org_admin') {
      return [
        { label: 'Dashboard',      path: '/dashboard',          icon: LayoutDashboard },
        { label: 'News (Xəbər)',    path: '/org/xeber',          icon: Newspaper },
        { label: 'Articles (Məqalə)', path: '/org/meqale',        icon: BookOpen },
        { label: 'Blog Posts',     path: '/org/blogs',          icon: FileText },
        { label: 'Gallery',        path: '/org/gallery',        icon: ImageIcon },
        { label: 'Psychologists',  path: '/org/psychologists',  icon: UserSquare2 },
        { label: 'Patients',       path: '/org/patients',       icon: Users },
        { label: 'SEO Management', path: '/org/seo',            icon: SearchCheck },
      ]
    }
    
    if (role === 'psychologist') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Patients List', path: '/psy/patients', icon: UserSquare2 },
        { label: 'Therapy Sessions', path: '/psy/sessions', icon: Calendar },
      ]
    }
    
    return []
  }

  const navItems = getNavItems()

  const getNavLabel = (label: string) => {
    switch (label) {
      case 'Dashboard':
        return t('common.dashboard')
      case 'Patients List':
        return t('common.patientsList')
      case 'Therapy Sessions':
        return t('common.therapySessions')
      case 'Organizations':
        return t('common.organizations', { defaultValue: 'Organizations' })
      case 'Psychologists':
        return t('common.psychologists', { defaultValue: 'Psychologists' })
      case 'Patients':
        return t('common.patients', { defaultValue: 'Patients' })
      case 'Analytics':
        return t('common.analytics', { defaultValue: 'Analytics' })
      case 'Settings':
        return t('common.settings', { defaultValue: 'Settings' })
      default:
        return label
    }
  }

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#11121d]">
      <div>
        {/* Brand/Header */}
        <div className="p-6 border-b border-[#202235] space-y-1">
          <div className="flex items-center gap-2.5">
            <img src="/nexusMindLogoMin.png" alt="NexusMind Logo" className="h-[27.6px] w-auto" />
          </div>
          <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase pl-1">Enterprise AI</p>
        </div>

        {/* New Session Button */}
        <div className="px-4 py-4">
          <button className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)]">
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isOverview = item.path === '/dashboard'
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={isOverview}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? 'bg-violet-500/10 text-white border-l-2 border-violet-500 shadow-[inset_4px_0_12px_rgba(139,92,246,0.05)]'
                      : 'text-slate-400 hover:bg-[#181a29]/65 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{getNavLabel(item.label)}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#202235] space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-[#181a29]/65 hover:text-slate-200 transition-all cursor-pointer">
          <HelpCircle className="w-4 h-4" />
          <span>{t('common.helpCenter')}</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#090a0f] flex text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar (always visible on md+) */}
      <aside className="hidden md:flex w-64 bg-[#11121d] border-r border-[#202235] flex-col justify-between shadow-xl shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay Drawer (only visible on mobile when isOpen is true) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
          {/* Drawer content */}
          <aside className="relative w-64 bg-[#11121d] h-full border-r border-[#202235] flex flex-col justify-between shadow-2xl z-50 animate-slide-in">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#090a0f] border-b border-[#202235] flex items-center justify-between px-4 sm:px-8 shrink-0 gap-4">
          {/* Left search bar / organization indicator */}
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={toggle}
              className="md:hidden p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {profile?.role === 'org_admin' ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141521]/60 border border-[#2e3146] rounded-lg text-xs font-bold text-[#b4b7c9] shrink-0">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center justify-center font-bold text-[10px]">
                  BPM
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 tracking-wider">CURRENT ORGANIZATION:</span>
                <span className="text-white font-bold">BPM - Bakı Psixologiya Mərkəzi</span>
                <span className="text-slate-500 text-[10px]">🔒</span>
              </div>
            ) : (
              <div className="w-48 sm:w-80 relative hidden sm:block shrink-0">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-1.5 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                />
              </div>
            )}
          </div>



          {/* Right Section Details */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#202235]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-500/50 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                {profile?.name ? profile.name.substring(0, 2) : 'US'}
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto bg-[#090a0f] p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
