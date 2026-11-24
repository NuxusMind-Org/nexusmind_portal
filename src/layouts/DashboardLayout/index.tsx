import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Calendar,
  UserSquare2,
  LogOut,
  HelpCircle,
  Search,
  Menu,
  Users,
  Newspaper,
  BookOpen,
  FileText,
  Image as ImageIcon,
  SearchCheck,
  UserCircle2,
  Loader2,
} from 'lucide-react'

import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { useSidebarStore } from '../../store/sidebarStore'
import { authService, searchService } from '../../api'
import type { ContentSearchResult, DoctorSearchResult } from '../../types/portalDtos'
import { getInitialRouteForRole } from '../../utils/navigation'
import nexusMindLogo from '@/assets/UpdatedNexusMindNavbarLogo.svg'

export default function DashboardLayout() {
  const profile = useUserStore((state) => state.profile)
  const clearProfile = useUserStore((state) => state.clearProfile)
  const logout = useAuthStore((state) => state.logout)
  const { isOpen, toggle, setOpen } = useSidebarStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Global search state (search-controller: /search/doctors & /search/content)
  const [globalQuery, setGlobalQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [doctorHits, setDoctorHits] = useState<DoctorSearchResult[]>([])
  const [contentHits, setContentHits] = useState<ContentSearchResult[]>([])
  const searchBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const trimmed = globalQuery.trim()
    if (trimmed.length < 2) {
      return
    }
    let active = true
    const timer = setTimeout(async () => {
      setIsSearching(true)
      const [docsRes, contentRes] = await Promise.allSettled([
        searchService.searchDoctors(trimmed, 'az'),
        searchService.searchContent(trimmed, 'az', 0, 5),
      ])
      if (!active) return
      setDoctorHits(docsRes.status === 'fulfilled' ? docsRes.value.slice(0, 5) : [])
      setContentHits(contentRes.status === 'fulfilled' ? contentRes.value.slice(0, 5) : [])
      setIsSearching(false)
    }, 350)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [globalQuery])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // Proceed with local sign-out even if server logout fails
    }
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
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'News (Xəbər)', path: '/org/xeber', icon: Newspaper },
        { label: 'Articles (Məqalə)', path: '/org/meqale', icon: BookOpen },
        { label: 'Blog Posts', path: '/org/blogs', icon: FileText },
        { label: 'Gallery', path: '/org/gallery', icon: ImageIcon },
        { label: 'Psychologists', path: '/org/psychologists', icon: UserSquare2 },
        { label: 'Patients', path: '/org/patients', icon: Users },
        { label: 'SEO Management', path: '/org/seo', icon: SearchCheck },
        { label: 'Profile', path: '/profile', icon: UserCircle2 },
      ]
    }

    if (role === 'org_admin') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'News (Xəbər)', path: '/org/xeber', icon: Newspaper },
        { label: 'Articles (Məqalə)', path: '/org/meqale', icon: BookOpen },
        { label: 'Blog Posts', path: '/org/blogs', icon: FileText },
        { label: 'Gallery', path: '/org/gallery', icon: ImageIcon },
        { label: 'Psychologists', path: '/org/psychologists', icon: UserSquare2 },
        { label: 'Patients', path: '/org/patients', icon: Users },
        { label: 'SEO Management', path: '/org/seo', icon: SearchCheck },
        { label: 'Profile', path: '/profile', icon: UserCircle2 },
      ]
    }

    if (role === 'psychologist') {
      return [
        { label: 'Panel', path: '/psy', icon: LayoutDashboard },
        { label: 'Calendar', path: '/psy/calendar', icon: Calendar },
        { label: 'Therapy Sessions', path: '/psy/sessions', icon: Calendar },
        { label: 'Patients List', path: '/psy/patients', icon: UserSquare2 },
        { label: 'Profile', path: '/profile', icon: UserCircle2 },
      ]
    }

    if (role === 'seo') {
      return [
        { label: 'SEO Management', path: '/org/seo', icon: SearchCheck },
        { label: 'News (Xəbər)', path: '/org/xeber', icon: Newspaper },
        { label: 'Articles (Məqalə)', path: '/org/meqale', icon: BookOpen },
        { label: 'Blog Posts', path: '/org/blogs', icon: FileText },
        { label: 'Profile', path: '/profile', icon: UserCircle2 },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  const getNavLabel = (label: string) => {
    switch (label) {
      case 'Panel':
        return t('common.panel')
      case 'Calendar':
        return t('common.calendar')
      case 'Dashboard':
        return t('common.dashboard')
      case 'Patients List':
        return t('common.patientsList')
      case 'Therapy Sessions':
        return t('common.therapySessions')
      case 'Organizations':
        return t('common.organizations')
      case 'Psychologists':
        return t('common.psychologists')
      case 'Patients':
        return t('common.patients')
      case 'Analytics':
        return t('common.analytics')
      case 'Settings':
        return t('common.settings')
      case 'News (Xəbər)':
        return t('nav.news')
      case 'Articles (Məqalə)':
        return t('nav.articles')
      case 'Blog Posts':
        return t('nav.blogs')
      case 'Gallery':
        return t('nav.gallery')
      case 'SEO Management':
        return t('nav.seoManagement')
      case 'Profile':
        return t('nav.profile')
      default:
        return label
    }
  }

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#11121d]">
      <div>
        {/* Brand/Header */}
        <div className="p-6 border-b border-[#202235] space-y-1">
          <Link to={getInitialRouteForRole(profile?.role)} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={nexusMindLogo} alt="NexusMind Loqosu" className="h-7 w-auto object-contain" />
          </Link>
          <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase pl-1">İdarəetmə Portalı</p>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isOverview = item.path === '/dashboard' || item.path === '/psy'
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={isOverview}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${isActive
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
              title="Menyunu aç/bağla"
            >
              <Menu className="w-5 h-5" />
            </button>

            {profile?.role === 'org_admin' ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141521]/60 border border-[#2e3146] rounded-lg text-xs font-bold text-[#b4b7c9] shrink-0">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center justify-center font-bold text-[10px]">
                  BPM
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 tracking-wider">
                  {t('nav.currentOrg')}
                </span>
                <span className="text-white font-bold">BPM - Bakı Psixologiya Mərkəzi</span>
                <span className="text-slate-500 text-[10px]">🔒</span>
              </div>
            ) : (
              <div ref={searchBoxRef} className="w-48 sm:w-80 relative hidden sm:block shrink-0">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalQuery}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => {
                    setGlobalQuery(e.target.value)
                    setSearchOpen(true)
                  }}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-9 pr-8 py-1.5 bg-[#141521] border border-[#2e3146] rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                />
                {isSearching && (
                  <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                )}

                {searchOpen && globalQuery.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#141521] border border-[#2e3146] rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {!isSearching && doctorHits.length === 0 && contentHits.length === 0 ? (
                      <div className="p-3 text-xs text-slate-500 text-center">Nəticə tapılmadı</div>
                    ) : (
                      <div className="divide-y divide-[#222437]">
                        {doctorHits.length > 0 && (
                          <div className="p-2 space-y-1">
                            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Həkimlər
                            </p>
                            {doctorHits.map((doc) => (
                              <button
                                key={`doc-${doc.id}`}
                                type="button"
                                onClick={() => {
                                  setSearchOpen(false)
                                  setGlobalQuery('')
                                  navigate(profile?.role === 'psychologist' ? '/psy' : '/org/psychologists')
                                }}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#1b1c2b] text-xs text-slate-200 cursor-pointer"
                              >
                                <div className="font-semibold text-white">{doc.fullName || `Həkim #${doc.id}`}</div>
                                {doc.bio && <div className="text-[10px] text-slate-400 truncate">{doc.bio}</div>}
                              </button>
                            ))}
                          </div>
                        )}
                        {contentHits.length > 0 && (
                          <div className="p-2 space-y-1">
                            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Məzmun
                            </p>
                            {contentHits.map((item) => {
                              const tLower = (item.type || '').toLowerCase()
                              const targetPath = tLower.includes('xeber') || tLower.includes('news')
                                ? `/org/xeber/${item.id}`
                                : tLower.includes('meqale') || tLower.includes('article')
                                  ? `/org/meqale/${item.id}`
                                  : `/org/blogs/${item.id}`
                              const typeLabel = tLower.includes('xeber') || tLower.includes('news')
                                ? 'Xəbər'
                                : tLower.includes('meqale') || tLower.includes('article')
                                  ? 'Məqalə'
                                  : 'Bloq'
                              return (
                                <button
                                  key={`${item.type}-${item.id}`}
                                  type="button"
                                  onClick={() => {
                                    setSearchOpen(false)
                                    setGlobalQuery('')
                                    navigate(targetPath)
                                  }}
                                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#1b1c2b] text-xs text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
                                >
                                  <span className="truncate">{item.title}</span>
                                  <span className="text-[10px] font-mono text-violet-300 shrink-0">{typeLabel}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section Details */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* User Avatar -> Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#202235]">
              <Link
                to="/profile"
                title="Hesab profili və təhlükəsizlik"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-500/50 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:scale-105 transition-transform"
              >
                {profile?.name ? profile.name.substring(0, 2).toUpperCase() : 'İS'}
              </Link>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto bg-[#090a0f] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
