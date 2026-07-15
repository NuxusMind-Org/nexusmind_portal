import { Outlet } from 'react-router-dom'

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-4 flex items-center gap-2.5">
        <img src="/nexusMindLogoMin.png" alt="NexusMind Logo" className="h-[27.6px] w-auto" />
        <h1 className="font-bold text-slate-800">Patient Portal</h1>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
