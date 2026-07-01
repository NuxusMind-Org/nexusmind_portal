import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English (EN)' },
  { code: 'az', label: 'Azərbaycan (AZ)' },
  { code: 'ru', label: 'Русский (RU)' },
  { code: 'tr', label: 'Türkçe (TR)' }
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('nexusmind-lang', code)
    setIsOpen(false)
  }

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141521] hover:bg-[#1c1d2e] border border-[#2e3146] text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        title="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>{activeLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#141521] border border-[#2e3146] rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-violet-600 hover:text-white transition-colors cursor-pointer ${
                i18n.language === lang.code ? 'text-violet-400 bg-violet-600/5' : 'text-slate-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
