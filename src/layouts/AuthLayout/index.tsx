import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#692990] via-[#1c2844] to-[#142334] flex flex-col justify-between items-center p-4 md:p-8">
      <div className="flex-1 flex items-center justify-center w-full my-4">
        <Outlet />
      </div>
      
      <footer className="py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-400/80 transition-colors uppercase tracking-wider select-none">
        NexusMind Enterprise v1.0 | Terms & Privacy
      </footer>
    </div>
  )
}

