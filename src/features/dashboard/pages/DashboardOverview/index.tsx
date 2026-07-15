import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../../../../store/userStore'
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity, 
  Download,
  Brain,
  TrendingUp,
  ArrowRight,
  Calendar,
  MoreHorizontal,
  Clock,
  AlertCircle,
  Star,
  FileText,
  Search,
  CheckCircle
} from 'lucide-react'



export default function DashboardOverview() {
  const profile = useUserStore((state) => state.profile)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const renderSuperAdminDashboard = () => (
    <div className="space-y-6">
      {/* Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Super Admin Overview</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Monitor platform-wide telemetry, organization health, and enterprise activity across all NexusMind instances.
          </p>
        </div>
        <button className="flex items-center gap-2 py-2 px-4 bg-[#141521] hover:bg-[#1a1c2d] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Report</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Organizations */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white group-hover:bg-slate-800/60 transition-all">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>~ 12%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Organizations</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">1,248</h3>
          </div>
        </div>

        {/* Card 2: Active Psychologists */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white group-hover:bg-slate-800/60 transition-all">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>~ 8%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Psychologists</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">8,492</h3>
          </div>
        </div>

        {/* Card 3: Platform Revenue */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white group-hover:bg-slate-800/60 transition-all">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>~ 24%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Revenue (MRR)</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">$2.4M</h3>
          </div>
        </div>

        {/* Card 4: Global Active Sessions */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white group-hover:bg-slate-800/60 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              <span>Live</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Global Active Sessions</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">42,105</h3>
          </div>
        </div>
      </div>



      {/* Recent Organizations Section */}
      <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Organizations</h4>
          <button className="flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider cursor-pointer">
            <span>View All</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Org Name</th>
                <th className="pb-3 pr-4">Admin</th>
                <th className="pb-3 pr-4">Users</th>
                <th className="pb-3 pr-4">Plan</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222437] text-slate-300">
              {/* Row 1 */}
              <tr>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-[10px]">
                      BPM
                    </div>
                    <span className="font-bold text-white text-sm">BPM Healthcare</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-slate-400 font-medium">sarah.j@bpm.com</td>
                <td className="py-3.5 pr-4 font-bold">1,204</td>
                <td className="py-3.5 pr-4">
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-[9px] uppercase tracking-wider">
                    Enterprise
                  </span>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold">Active</span>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 font-bold flex items-center justify-center text-[10px]">
                      NV
                    </div>
                    <span className="font-bold text-white text-sm">Nova Clinics</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-slate-400 font-medium">admin@nova.org</td>
                <td className="py-3.5 pr-4 font-bold">430</td>
                <td className="py-3.5 pr-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                    Pro
                  </span>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold">Active</span>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 font-bold flex items-center justify-center text-[10px]">
                      OM
                    </div>
                    <span className="font-bold text-white text-sm">Omni Health</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-slate-400 font-medium">t.reed@omni.net</td>
                <td className="py-3.5 pr-4 font-bold">89</td>
                <td className="py-3.5 pr-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                    Starter
                  </span>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    <span className="font-semibold text-slate-500">On Hold</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderOrgAdminDashboard = () => (
    <div className="space-y-8">
      {/* Title & Subtitle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Organization Overview</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Real-time metrics and operational status for BPM.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 py-2 px-3.5 bg-[#141521] hover:bg-[#1c1d2e] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 py-2 px-3.5 bg-[#141521] hover:bg-[#1c1d2e] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Patients */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white transition-all">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>~ 12%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Patients (BPM)</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">1,248</h3>
          </div>
        </div>

        {/* Card 2: Psychologist Availability */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white transition-all">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse border border-[#141521]"></div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Psychologist Availability</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              84% <span className="text-xs font-semibold text-slate-500 lowercase tracking-wider">capacity</span>
            </h3>
          </div>
        </div>

        {/* Card 3: Session Success Rate */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white transition-all">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
            <div className="bg-slate-800/60 border border-[#2e3146] px-2 py-0.5 rounded text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              30d avg
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Session Success Rate</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">96.2%</h3>
          </div>
        </div>

        {/* Card 4: Monthly SEO Score */}
        <div className="bg-[#141521] border border-[#222437] p-5 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-colors relative overflow-hidden group border-l-2 border-l-teal-500">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-800/40 text-slate-400 rounded-lg group-hover:text-white transition-all">
              <Search className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>~ 4 pts</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly SEO Score</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              92 <span className="text-xs font-semibold text-slate-500">/100</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Internal Details layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Psychologist Performance */}
        <div className="bg-[#141521] border border-[#222437] p-6 rounded-xl shadow-md lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">Psychologist Performance</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Top performers by patient retention and feedback.</p>
              </div>
              <button className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider cursor-pointer">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#222437] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">SPECIALIST</th>
                    <th className="pb-3 text-center pr-4">SESSIONS (M)</th>
                    <th className="pb-3 text-center pr-4">RATING</th>
                    <th className="pb-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222437] text-slate-300 font-medium">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          AZ
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Dr. Aysel Zamanova</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Clinical Psychologist</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm font-bold text-slate-300 pr-4">142</td>
                    <td className="py-4 text-center pr-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 font-bold">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>4.9</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1c1d2e] text-slate-400 border border-[#2e3146] flex items-center justify-center font-bold text-xs shrink-0">
                          RM
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Ramil Mammadov</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">CBT Therapist</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm font-bold text-slate-300 pr-4">98</td>
                    <td className="py-4 text-center pr-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 font-bold">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>4.7</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        In Session
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          NA
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Nigar Aliyeva</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Child Psychologist</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm font-bold text-slate-300 pr-4">115</td>
                    <td className="py-4 text-center pr-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 font-bold">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Offline
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Workspace Tools & Upcoming Today */}
        <div className="space-y-6">
          
          {/* Workspace Tools Card */}
          <div className="bg-[#141521] border border-[#222437] p-6 rounded-xl shadow-md space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Tools</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Tool 1 */}
              <div className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-[#323652] cursor-pointer transition-colors group">
                <div className="p-2.5 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-lg group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">Blog Management</span>
              </div>
              {/* Tool 2 */}
              <div onClick={() => navigate('/org/seo')} className="bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-violet-500/40 hover:bg-violet-500/5 cursor-pointer transition-colors group">
                <div className="p-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-tight">SEO Settings</span>
              </div>
            </div>
          </div>

          {/* Upcoming Today Timeline */}
          <div className="bg-[#141521] border border-[#222437] p-6 rounded-xl shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Today</h4>
              <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                <MoreHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="text-right shrink-0 w-10">
                  <p className="text-xs font-extrabold text-white">14:00</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">45m</p>
                </div>
                <div className="flex-1 bg-[#1b1c2b] border border-[#222437] border-l-2 border-l-purple-500 p-3 rounded-lg">
                  <h5 className="text-xs font-bold text-white">Initial Assessment</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Patient #8921</p>
                  <p className="text-[9px] text-violet-400 font-bold uppercase tracking-wider mt-1.5">DR. A. ZAMANOVA</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="text-right shrink-0 w-10">
                  <p className="text-xs font-extrabold text-white">15:30</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">60m</p>
                </div>
                <div className="flex-1 bg-[#1b1c2b] border border-[#222437] border-l-2 border-l-teal-500 p-3 rounded-lg">
                  <h5 className="text-xs font-bold text-white">CBT Session</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Patient #4412</p>
                  <p className="text-[9px] text-teal-400 font-bold uppercase tracking-wider mt-1.5">R. MAMMADOV</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )

  const [sessionActive, setSessionActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  
  // New States
  const [scheduleTab, setScheduleTab] = useState<'today' | 'week' | 'month'>('today')
  const [notes, setNotes] = useState([
    { id: 'n1', text: 'S. Miller: CBT progress review & exercises', time: 'Today, 2:30 PM' },
    { id: 'n2', text: 'Prepare intake summary for M. Davis', time: 'Today, 10:15 AM' },
    { id: 'n3', text: 'Follow up on child therapy feedback with parents', time: 'Yesterday' }
  ])
  const [newNoteText, setNewNoteText] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // New Note handlers
  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const newNote = {
      id: `n_${Date.now()}`,
      text: newNoteText.trim(),
      time: 'Just now'
    }
    setNotes([newNote, ...notes])
    setNewNoteText('')
    triggerFeedback('Note added successfully.')
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    triggerFeedback('Note deleted.')
  }

  const weeklySessions = [
    { id: 'w1', patientName: 'Emma Thompson', time: '09:00 AM', type: 'CBT Follow-up', status: 'Completed', dateLabel: 'Mon 09:00' },
    { id: 'w2', patientName: 'Michael Davis', time: '11:00 AM', type: 'Intake Assessment', status: 'Waiting', dateLabel: 'Mon 11:00' },
    { id: 'w3', patientName: 'Sarah Miller', time: '03:00 PM', type: 'CBT Follow-up', status: 'Scheduled', dateLabel: 'Mon 15:00' },
    { id: 'w4', patientName: 'John Larson', time: '10:00 AM', type: 'Anxiety Treatment', status: 'Scheduled', dateLabel: 'Thu 10:00' },
    { id: 'w5', patientName: 'Alice Chen', time: '02:00 PM', type: 'Grief Integration', status: 'Scheduled', dateLabel: 'Fri 14:00' },
  ]

  const monthlySessions = [
    { id: 'm1', patientName: 'Emma Thompson', time: '09:00 AM', type: 'CBT Follow-up', status: 'Completed', dateLabel: 'Jul 5' },
    { id: 'm2', patientName: 'Michael Davis', time: '11:00 AM', type: 'Intake Assessment', status: 'Waiting', dateLabel: 'Jul 5' },
    { id: 'm3', patientName: 'Sarah Miller', time: '03:00 PM', type: 'CBT Follow-up', status: 'Scheduled', dateLabel: 'Jul 5' },
    { id: 'm4', patientName: 'John Larson', time: '10:00 AM', type: 'Anxiety Treatment', status: 'Scheduled', dateLabel: 'Jul 8' },
    { id: 'm5', patientName: 'Alice Chen', time: '02:00 PM', type: 'Grief Integration', status: 'Scheduled', dateLabel: 'Jul 9' },
    { id: 'm6', patientName: 'Oliver Queen', time: '01:00 PM', type: 'Trauma recovery', status: 'Scheduled', dateLabel: 'Jul 10' },
    { id: 'm7', patientName: 'Tony Stark', time: '09:00 AM', type: 'Post-trauma management', status: 'Scheduled', dateLabel: 'Jul 15' },
    { id: 'm8', patientName: 'Peter Parker', time: '04:00 PM', type: 'Identity Counselling', status: 'Scheduled', dateLabel: 'Jul 18' },
  ]

  const renderPsychologistDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{t('dashboard.goodMorning', { name: profile?.name || 'Dr. Mercer' })}</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          {t('dashboard.clinicalOverview')}
        </p>
      </div>

      {/* Interactive Action Notifications */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold rounded-lg animate-fade-in transition-all">
          <AlertCircle className="w-4.5 h-4.5 text-violet-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Schedule & Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Timeline/Schedule card) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule Card */}
          <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md p-6 space-y-6">
            
            {/* Header: Session Counts / View Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#222437] pb-6">
              
              {/* Tab 1: Today */}
              <div 
                onClick={() => setScheduleTab('today')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  scheduleTab === 'today' 
                    ? 'bg-[#1b1c2b] border-emerald-500/50 shadow-[0_4px_12px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#141521] border-[#222437] hover:border-[#323652]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    scheduleTab === 'today' ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {t('dashboard.todaysSessions')}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${
                    scheduleTab === 'today' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-800/40 text-slate-400 border-transparent group-hover:border-slate-700'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">6</h3>
                  <p className="text-[10px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <span>↑</span> {t('dashboard.moreThanYesterday')}
                  </p>
                </div>
              </div>

              {/* Tab 2: Week */}
              <div 
                onClick={() => setScheduleTab('week')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  scheduleTab === 'week' 
                    ? 'bg-[#1b1c2b] border-violet-500/50 shadow-[0_4px_12px_rgba(124,58,237,0.08)]' 
                    : 'bg-[#141521] border-[#222437] hover:border-[#323652]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    scheduleTab === 'week' ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {t('dashboard.weeklySessions')}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${
                    scheduleTab === 'week' 
                      ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' 
                      : 'bg-slate-800/40 text-slate-400 border-transparent group-hover:border-slate-700'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">18</h3>
                  <p className="text-[10px] font-semibold text-violet-400 mt-1 flex items-center gap-1">
                    <span>↑</span> {t('dashboard.moreThanLastWeek')}
                  </p>
                </div>
              </div>

              {/* Tab 3: Month */}
              <div 
                onClick={() => setScheduleTab('month')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  scheduleTab === 'month' 
                    ? 'bg-[#1b1c2b] border-blue-500/50 shadow-[0_4px_12px_rgba(59,130,246,0.08)]' 
                    : 'bg-[#141521] border-[#222437] hover:border-[#323652]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    scheduleTab === 'month' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {t('dashboard.monthlySessions')}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${
                    scheduleTab === 'month' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-slate-800/40 text-slate-400 border-transparent group-hover:border-slate-700'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">72</h3>
                  <p className="text-[10px] font-semibold text-blue-400 mt-1 flex items-center gap-1">
                    <span>↑</span> {t('dashboard.moreThanLastMonth')}
                  </p>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {scheduleTab === 'today' && t('dashboard.todaysSchedule')}
                {scheduleTab === 'week' && t('dashboard.weeklySessions')}
                {scheduleTab === 'month' && t('dashboard.monthlySessions')}
              </h4>
              <button className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider cursor-pointer">
                {t('dashboard.viewFullCalendar')}
              </button>
            </div>

            {/* Timeline Layout */}
            <div className="relative space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-[3.25rem] top-4 bottom-4 w-0.5 bg-[#222437]"></div>

              {scheduleTab === 'today' && (
                <>
                  {/* Session 1 */}
                  <div className="flex gap-4 items-start relative animate-fade-in">
                    <div className="w-10 text-slate-400 text-xs font-bold pt-3 text-right shrink-0">09:00</div>
                    <div className="relative flex items-center justify-center pt-3 z-10 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border-4 border-[#141521] bg-slate-500"></div>
                    </div>
                    <div className="flex-1 bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">E. Thompson</h4>
                        <p className="text-xs text-slate-400 mt-1">CBT Follow-up</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-800/80 border border-slate-700/50 px-3 py-1 rounded-full">
                        {t('dashboard.completed')}
                      </span>
                    </div>
                  </div>

                  {/* Session 2 */}
                  <div className="flex gap-4 items-start relative animate-fade-in">
                    <div className="w-10 text-slate-400 text-xs font-bold pt-3 text-right shrink-0">11:00</div>
                    <div className="relative flex items-center justify-center pt-3 z-10 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border-4 border-[#141521] bg-violet-500"></div>
                    </div>
                    <div className={`flex-1 bg-[#181926] border-2 ${sessionActive ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-violet-500/50'} p-5 rounded-xl space-y-4`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base">M. Davis</h4>
                          <p className="text-xs text-slate-400 mt-1">Intake Assessment</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {sessionActive ? t('dashboard.sessionActive') : t('dashboard.waiting')}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setSessionActive(!sessionActive)}
                          className={`px-4 py-2 ${sessionActive ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.25)]' : 'bg-violet-600 hover:bg-violet-500 shadow-[0_4px_12px_rgba(124,58,237,0.25)]'} text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer`}
                        >
                          {sessionActive ? t('dashboard.endSession') : t('dashboard.joinRoom')}
                        </button>
                        <button className="px-4 py-2 bg-[#141521] hover:bg-[#1a1c2d] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                          {t('dashboard.reviewFile')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {scheduleTab === 'week' && (
                <>
                  {weeklySessions.map((session) => (
                    <div key={session.id} className="flex gap-4 items-start relative animate-fade-in">
                      <div className="w-10 text-slate-400 text-[10px] font-bold pt-3.5 text-right shrink-0 leading-tight">
                        {session.dateLabel.split(' ')[0]}
                        <br />
                        <span className="text-slate-500 font-semibold">{session.dateLabel.split(' ')[1]}</span>
                      </div>
                      <div className="relative flex items-center justify-center pt-3 z-10 shrink-0">
                        <div className={`w-3.5 h-3.5 rounded-full border-4 border-[#141521] ${
                          session.status === 'Completed' ? 'bg-slate-500' : 'bg-violet-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{session.patientName}</h4>
                          <p className="text-xs text-slate-400 mt-1">{session.type}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            session.status === 'Completed'
                              ? 'text-slate-400 bg-slate-800/80 border border-slate-700/50'
                              : 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
                          }`}>
                            {session.status === 'Completed' ? t('dashboard.completed') : t('dashboard.waiting')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {scheduleTab === 'month' && (
                <>
                  {monthlySessions.map((session) => (
                    <div key={session.id} className="flex gap-4 items-start relative animate-fade-in">
                      <div className="w-10 text-slate-400 text-[10px] font-bold pt-3.5 text-right shrink-0 leading-tight">
                        {session.dateLabel}
                        <br />
                        <span className="text-slate-500 font-semibold">{session.time}</span>
                      </div>
                      <div className="relative flex items-center justify-center pt-3 z-10 shrink-0">
                        <div className={`w-3.5 h-3.5 rounded-full border-4 border-[#141521] ${
                          session.status === 'Completed' ? 'bg-slate-500' : 'bg-violet-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 bg-[#1b1c2b] border border-[#222437] p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{session.patientName}</h4>
                          <p className="text-xs text-slate-400 mt-1">{session.type}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            session.status === 'Completed'
                              ? 'text-slate-400 bg-slate-800/80 border border-slate-700/50'
                              : 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
                          }`}>
                            {session.status === 'Completed' ? t('dashboard.completed') : t('dashboard.waiting')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>
        </div>

        {/* Right Column (Clock, Notes, Active Patients) */}
        <div className="space-y-6">
          
          {/* Card: Live Date & Clock */}
          <div className="bg-[#141521] border border-[#222437] p-6 rounded-xl shadow-md space-y-4 hover:border-[#323652] transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('dashboard.currentDateTime')}</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </h3>
              <p className="text-xs font-semibold text-purple-400 mt-2">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Personal Notes Card */}
          <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dashboard.personalNotes')}</h4>
                <button className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Add Note Input Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={t('dashboard.addNotePlaceholder')}
                  className="flex-1 bg-[#1b1c2b] border border-[#222437] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNote()
                  }}
                />
                <button 
                  onClick={handleAddNote}
                  className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                {notes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No notes saved.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between gap-3 group border-b border-[#222437]/45 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center font-bold text-xs text-violet-400">
                            📝
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white line-clamp-1">{note.text}</h5>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{note.time}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold uppercase tracking-wider pr-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Clear All Notes Footer Button */}
            <button 
              onClick={() => {
                setNotes([])
                triggerFeedback('All notes cleared.')
              }}
              className="w-full py-2.5 border border-[#2e3146] hover:bg-[#1c1d2c] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer mt-6"
            >
              {t('dashboard.clearAllNotes')}
            </button>
          </div>

          {/* Active Patients Card */}
          <div className="bg-[#141521] border border-[#222437] rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dashboard.activePatients')}</h4>
                <button className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Patient List */}
              <div className="space-y-4">
                {/* Patient 1 */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400">
                      SM
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#141521]"></span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">S. Miller</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{t('dashboard.lastSession', { time: '2 days ago' })}</p>
                  </div>
                </div>

                {/* Patient 2 */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-400">
                      JL
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-rose-500 border border-[#141521]"></span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">J. Larson</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{t('dashboard.highPriority')}</p>
                  </div>
                </div>

                {/* Patient 3 */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-xs text-violet-400">
                      AC
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#141521]"></span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">A. Chen</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{t('dashboard.nextTomorrow')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer View All Patients */}
            <button className="w-full py-2.5 border border-[#2e3146] hover:bg-[#1c1d2c] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer mt-6">
              {t('dashboard.viewAllPatients')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'platform_admin':
        return renderSuperAdminDashboard()
      case 'org_admin':
        return renderOrgAdminDashboard()
      case 'psychologist':
        return renderPsychologistDashboard()
      default:
        return (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 font-semibold text-sm">
            Unable to resolve dashboard view. Role not recognized.
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {profile?.role !== 'platform_admin' && profile?.role !== 'psychologist' && (
        <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.name || 'User'}!
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Here's an overview of the activities, schedules, and metrics under your control today.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>
        </div>
      )}

      {renderDashboard()}
    </div>
  )
}
