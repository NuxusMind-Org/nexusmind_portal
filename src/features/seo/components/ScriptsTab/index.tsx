import { useState, useEffect } from 'react'
import { Code, Info } from 'lucide-react'
import type { ScriptsConfig } from '../../types/seo'

interface ScriptsTabProps {
  scripts: ScriptsConfig
  isSaving: boolean
  onSave: (data: ScriptsConfig) => void
  onDirty: () => void
}

const HEAD_PLACEHOLDER = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="your-verification-code" />

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){...}
  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>`

const BODY_PLACEHOLDER = `<!-- Google Tag Manager (body) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<!-- Other body scripts -->
`

export default function ScriptsTab({ scripts, isSaving, onSave, onDirty }: ScriptsTabProps) {
  const [headScripts, setHeadScripts] = useState(scripts.headScripts)
  const [bodyScripts, setBodyScripts] = useState(scripts.bodyScripts)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setHeadScripts(scripts.headScripts)
    setBodyScripts(scripts.bodyScripts)
    setIsDirty(false)
  }, [scripts])

  function handleHead(value: string) {
    setHeadScripts(value)
    if (!isDirty) { setIsDirty(true); onDirty() }
  }
  function handleBody(value: string) {
    setBodyScripts(value)
    if (!isDirty) { setIsDirty(true); onDirty() }
  }
  function handleSave() {
    onSave({ headScripts, bodyScripts })
    setIsDirty(false)
  }
  function handleReset() {
    setHeadScripts(scripts.headScripts)
    setBodyScripts(scripts.bodyScripts)
    setIsDirty(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-sky-500/5 border border-sky-500/15 rounded-xl">
        <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
        <div className="text-xs text-sky-300 space-y-1">
          <p className="font-bold">About Script Injection</p>
          <p className="text-sky-400/80">Head scripts are injected inside <code className="bg-sky-900/40 px-1 rounded">&lt;head&gt;</code>. Body scripts are injected right after the opening <code className="bg-sky-900/40 px-1 rounded">&lt;body&gt;</code> tag. Do not include wrapping <code className="bg-sky-900/40 px-1 rounded">&lt;html&gt;</code> or <code className="bg-sky-900/40 px-1 rounded">&lt;body&gt;</code> tags.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Head Scripts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center">
              <Code className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Head Scripts</h3>
              <p className="text-[10px] text-slate-500">Analytics, verification tags, Meta Pixel, etc.</p>
            </div>
          </div>
          <textarea
            value={headScripts}
            onChange={(e) => handleHead(e.target.value)}
            placeholder={HEAD_PLACEHOLDER}
            spellCheck={false}
            rows={14}
            className="w-full px-4 py-4 font-mono text-xs bg-[#0c0d18] border border-[#2e3146] focus:border-violet-500 rounded-xl text-slate-300 placeholder-slate-700 focus:outline-none resize-y transition-colors"
          />
        </div>

        {/* Body Scripts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-500/15 flex items-center justify-center">
              <Code className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Body Scripts</h3>
              <p className="text-[10px] text-slate-500">GTM body snippet, Intercom, Hotjar, etc.</p>
            </div>
          </div>
          <textarea
            value={bodyScripts}
            onChange={(e) => handleBody(e.target.value)}
            placeholder={BODY_PLACEHOLDER}
            spellCheck={false}
            rows={14}
            className="w-full px-4 py-4 font-mono text-xs bg-[#0c0d18] border border-[#2e3146] focus:border-teal-500 rounded-xl text-slate-300 placeholder-slate-700 focus:outline-none resize-y transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#222437]">
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          {isSaving ? 'Saving…' : 'Save Scripts'}
        </button>
        <button
          onClick={handleReset}
          disabled={!isDirty}
          className="px-5 py-2 bg-[#1b1c2b] hover:bg-[#222437] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2e3146] text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
