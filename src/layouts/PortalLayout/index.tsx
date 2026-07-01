import { Outlet } from 'react-router-dom'

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-4">
        <h1 className="font-bold">NexusMind Patient Portal</h1>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
