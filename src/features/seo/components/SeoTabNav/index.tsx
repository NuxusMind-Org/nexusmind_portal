import type { SeoTab } from '../../types/seo'
import { SEO_TABS } from '../../constants/seoPages'

interface SeoTabNavProps {
  activeTab: SeoTab
  dirtyTabs: Partial<Record<SeoTab, boolean>>
  onTabChange: (tab: SeoTab) => void
}

export default function SeoTabNav({ activeTab, dirtyTabs, onTabChange }: SeoTabNavProps) {
  return (
    <div className="border-b border-[#222437] bg-[#11121d]">
      <nav className="flex overflow-x-auto scrollbar-hide px-6">
        {SEO_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const isDirty = dirtyTabs[tab.id] === true

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                isActive
                  ? 'border-violet-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              {/* Dirty indicator dot */}
              {isDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
