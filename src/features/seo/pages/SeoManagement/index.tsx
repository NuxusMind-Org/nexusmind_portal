import { useState } from 'react'
import { SearchCheck, Code2, Bot, Network, Cpu } from 'lucide-react'
import SeoScriptManager from '../../components/SeoScriptManager'
import RobotsTxtEditor from '../../components/RobotsTxtEditor'
import SitemapManager from '../../components/SitemapManager'
import LlmsTxtEditor from '../../components/LlmsTxtEditor'

type TabType = 'SCRIPTS' | 'ROBOTS' | 'SITEMAP' | 'LLMS'

export default function SeoManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('SCRIPTS')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <SearchCheck className="w-8 h-8 text-cyan-400" />
            <span>SEO Management Suite</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Exclusive Organization Admin tools for search engine optimization, tracking scripts, crawler directives, and AI indexing.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#141521] border border-[#222437] p-2 rounded-2xl flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('SCRIPTS')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'SCRIPTS'
              ? 'bg-cyan-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Site Scripts</span>
        </button>

        <button
          onClick={() => setActiveTab('ROBOTS')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ROBOTS'
              ? 'bg-indigo-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>robots.txt</span>
        </button>

        <button
          onClick={() => setActiveTab('SITEMAP')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'SITEMAP'
              ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(147,51,234,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>sitemap.xml</span>
        </button>

        <button
          onClick={() => setActiveTab('LLMS')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'LLMS'
              ? 'bg-emerald-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>llms.txt (AI)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'SCRIPTS' && <SeoScriptManager />}
        {activeTab === 'ROBOTS' && <RobotsTxtEditor />}
        {activeTab === 'SITEMAP' && <SitemapManager />}
        {activeTab === 'LLMS' && <LlmsTxtEditor />}
      </div>
    </div>
  )
}
