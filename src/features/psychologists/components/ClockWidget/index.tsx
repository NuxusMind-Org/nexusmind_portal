import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

const localeMap: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
  tr: 'tr-TR',
};

export default function ClockWidget() {
  const { t, i18n } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLocale = localeMap[i18n.language] || 'en-US';
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString(currentLocale, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-[#1c1a2e] to-[#11121d] border border-violet-500/20 rounded-xl p-6 shadow-lg shadow-violet-500/5 relative overflow-hidden h-36 flex flex-col justify-center shrink-0 group hover:border-violet-500/40 transition-colors">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10 mb-2">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-violet-400" />
          <p className="text-[10px] font-bold text-violet-400/80 tracking-widest uppercase">
            {t('psychologistDashboard.currentTime', { defaultValue: 'Current Time' })}
          </p>
        </div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
          {formattedTime}
        </h2>
        <p className="text-sm font-semibold text-slate-400 mt-1 tracking-wide capitalize">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
