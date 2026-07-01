import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0c10] to-[#12131a] flex flex-col justify-between items-center p-4">
      <div className="flex-1 flex items-center justify-center w-full max-w-[420px] my-8">
        <div className="w-full p-8 bg-[#161722] border border-[#2b2d42] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Outlet />
        </div>
      </div>
      
      <footer className="py-2 text-[10px] font-semibold text-slate-600 hover:text-slate-500 transition-colors uppercase tracking-wider select-none">
        NexusMind Enterprise v1.0 | Terms & Privacy
      </footer>
    </div>
  )
}

