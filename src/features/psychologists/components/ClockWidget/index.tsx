import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClockWidget() {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-[#1c1a2e] to-[#11121d] border border-violet-500/20 rounded-xl p-6 shadow-lg shadow-violet-500/5 relative overflow-hidden h-36 flex flex-col justify-center shrink-0 group hover:border-violet-500/40 transition-colors">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10 mb-2">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-violet-400" />
          <p className="text-[10px] font-bold text-violet-400/80 tracking-widest uppercase">Current Time</p>
        </div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
          {formattedTime}
        </h2>
        <p className="text-sm font-semibold text-slate-400 mt-1 tracking-wide">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
