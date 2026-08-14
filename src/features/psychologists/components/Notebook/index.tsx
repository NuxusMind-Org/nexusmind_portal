import { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Notebook() {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock auto-save
  useEffect(() => {
    if (!note) return;
    
    setIsSaving(true);
    const timeout = setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [note]);

  return (
    <div className="bg-gradient-to-b from-[#11121d] to-[#141521] border border-[#202235] hover:border-violet-500/30 transition-colors rounded-xl flex flex-col flex-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#202235] flex items-center justify-between bg-[#11121d] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Quick Notes
          </h2>
        </div>
        
        {/* Save Status Indicator */}
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-full">
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-0 relative">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start typing your session notes here..."
          className="w-full h-full resize-none bg-transparent p-6 text-sm text-slate-300 placeholder-slate-600 focus:outline-none custom-scrollbar leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Footer/Actions */}
      <div className="p-4 border-t border-[#202235] bg-[#141521] flex justify-end shrink-0">
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 500);
          }}
        >
          <Save className="w-4 h-4" />
          Save Note
        </button>
      </div>
    </div>
  );
}
