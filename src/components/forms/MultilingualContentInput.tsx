import { useState } from 'react'
import { Globe, Check, AlertCircle, Layers, Columns2 } from 'lucide-react'
import type { TitleDto } from '../../types/portalDtos'
import {
  type MultilingualContent,
  type SupportedLanguage,
  SUPPORTED_LANGUAGES
} from '../../utils/multilingual'

export interface MultilingualContentInputProps {
  title: TitleDto
  onTitleChange: (title: TitleDto) => void
  content: MultilingualContent
  onContentChange: (content: MultilingualContent) => void
  shortDescription?: MultilingualContent
  onShortDescriptionChange?: (shortDesc: MultilingualContent) => void
  accentColor?: 'violet' | 'purple' | 'indigo' | 'emerald'
  contentRows?: number
  requiredLanguages?: SupportedLanguage[]
  titleLabel?: string
  contentLabel?: string
  titlePlaceholder?: string
  contentPlaceholder?: string
  showShortDescription?: boolean
}

export function MultilingualContentInput({
  title,
  onTitleChange,
  content,
  onContentChange,
  shortDescription,
  onShortDescriptionChange,
  accentColor = 'violet',
  contentRows = 6,
  requiredLanguages = ['az'],
  titleLabel = 'Title',
  contentLabel = 'Main Content',
  titlePlaceholder,
  contentPlaceholder,
  showShortDescription = false
}: MultilingualContentInputProps) {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('az')
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs')

  const accentStyles = {
    violet: {
      activeTab: 'bg-violet-600 text-white shadow-sm',
      borderFocus: 'focus:border-violet-500',
      badge: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      tag: 'border-violet-500'
    },
    purple: {
      activeTab: 'bg-purple-600 text-white shadow-sm',
      borderFocus: 'focus:border-purple-500',
      badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      tag: 'border-purple-500'
    },
    indigo: {
      activeTab: 'bg-indigo-600 text-white shadow-sm',
      borderFocus: 'focus:border-indigo-500',
      badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      tag: 'border-indigo-500'
    },
    emerald: {
      activeTab: 'bg-emerald-600 text-white shadow-sm',
      borderFocus: 'focus:border-emerald-500',
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      tag: 'border-emerald-500'
    }
  }[accentColor]

  const handleTitleFieldChange = (lang: SupportedLanguage, value: string) => {
    onTitleChange({
      ...title,
      [lang]: value
    })
  }

  const handleContentFieldChange = (lang: SupportedLanguage, value: string) => {
    onContentChange({
      ...content,
      [lang]: value
    })
  }

  const handleShortDescFieldChange = (lang: SupportedLanguage, value: string) => {
    if (onShortDescriptionChange && shortDescription) {
      onShortDescriptionChange({
        ...shortDescription,
        [lang]: value
      })
    }
  }

  const isLangFilled = (lang: SupportedLanguage) => {
    const hasTitle = !!title[lang]?.trim()
    const hasContent = !!content[lang]?.trim()
    return { hasTitle, hasContent, isComplete: hasTitle && hasContent }
  }

  const placeholders = {
    az: {
      title: titlePlaceholder || 'Məzmunun Azərbaycan dilində başlığı...',
      shortDesc: 'Qısa xülasə və ya intro (AZ)...',
      content: contentPlaceholder || 'Əsas mətn və ya məqalə mətni (Azərbaycan dili)...'
    },
    en: {
      title: titlePlaceholder ? `${titlePlaceholder} (English)` : 'Content title in English...',
      shortDesc: 'Brief summary or intro (EN)...',
      content: contentPlaceholder ? `${contentPlaceholder} (English)` : 'Full body content (English)...'
    },
    ru: {
      title: titlePlaceholder ? `${titlePlaceholder} (Russian)` : 'Заголовок на русском языке...',
      shortDesc: 'Краткое описание (RU)...',
      content: contentPlaceholder ? `${contentPlaceholder} (Russian)` : 'Основной текст статьи (Русский язык)...'
    }
  }

  return (
    <div className="space-y-4 p-5 bg-[#10111a] border border-[#26293d] rounded-2xl">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222437]">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Multilingual Content (AZ / EN / RU)
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            (Dedicated fields for each language)
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('tabs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'tabs' ? 'bg-[#1e2030] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tabbed</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'all' ? 'bg-[#1e2030] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>All Languages</span>
          </button>
        </div>
      </div>

      {viewMode === 'tabs' ? (
        <div className="space-y-5">
          {/* Language Navigation Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-[#161826] border border-[#26283b] rounded-xl overflow-x-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const { hasTitle, isComplete } = isLangFilled(lang.code)
              const isRequired = requiredLanguages.includes(lang.code)
              const isActive = activeLang === lang.code

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex-1 min-w-[140px] flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? accentStyles.activeTab
                      : 'text-slate-400 hover:text-white hover:bg-[#1b1c2b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {isRequired && (
                      <span className={isActive ? 'text-white/80' : 'text-rose-400'}>*</span>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center">
                    {isComplete ? (
                      <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : hasTitle ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        Title ✓
                      </span>
                    ) : isRequired ? (
                      <span className="p-0.5 rounded-full bg-rose-500/20 text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">optional</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Language Fields */}
          <div className="space-y-4 pt-1">
            {/* Title for Active Language */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>{titleLabel}</span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#1e2030] text-slate-300 font-bold">
                    {activeLang.toUpperCase()}
                  </span>
                  {requiredLanguages.includes(activeLang) && (
                    <span className="text-rose-400 font-bold">*</span>
                  )}
                </label>
                <span className="text-xs text-slate-500">
                  {title[activeLang]?.length || 0} chars
                </span>
              </div>
              <input
                type="text"
                required={requiredLanguages.includes(activeLang)}
                value={title[activeLang] || ''}
                onChange={(e) => handleTitleFieldChange(activeLang, e.target.value)}
                placeholder={placeholders[activeLang].title}
                className={`w-full px-4 py-3 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none ${accentStyles.borderFocus} shadow-inner transition-colors`}
              />
            </div>

            {/* Optional Short Description */}
            {showShortDescription && shortDescription && onShortDescriptionChange && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>Short Description</span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#1e2030] text-slate-300 font-bold">
                    {activeLang.toUpperCase()}
                  </span>
                </label>
                <input
                  type="text"
                  value={shortDescription[activeLang] || ''}
                  onChange={(e) => handleShortDescFieldChange(activeLang, e.target.value)}
                  placeholder={placeholders[activeLang].shortDesc}
                  className={`w-full px-4 py-3 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none ${accentStyles.borderFocus} transition-colors`}
                />
              </div>
            )}

            {/* Content Textarea for Active Language */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>{contentLabel}</span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#1e2030] text-slate-300 font-bold">
                    {activeLang.toUpperCase()}
                  </span>
                  {requiredLanguages.includes(activeLang) && (
                    <span className="text-rose-400 font-bold">*</span>
                  )}
                </label>
                <span className="text-xs text-slate-500">
                  {content[activeLang]?.length || 0} characters
                </span>
              </div>
              <textarea
                rows={contentRows}
                required={requiredLanguages.includes(activeLang)}
                value={content[activeLang] || ''}
                onChange={(e) => handleContentFieldChange(activeLang, e.target.value)}
                placeholder={placeholders[activeLang].content}
                className={`w-full px-4 py-3.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed ${accentStyles.borderFocus} shadow-inner transition-colors`}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Stacked / All Languages View */
        <div className="space-y-4 pt-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isRequired = requiredLanguages.includes(lang.code)
            return (
              <div
                key={lang.code}
                className="p-4 sm:p-5 bg-[#141521] border border-[#25283c] rounded-xl space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-bold text-white">{lang.label}</span>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#1e2030] text-slate-300 font-bold">
                      {lang.code.toUpperCase()}
                    </span>
                    {isRequired && <span className="text-rose-400 text-sm font-bold">*</span>}
                  </div>
                  {isLangFilled(lang.code).isComplete && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" /> Ready
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    {titleLabel} ({lang.code.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required={isRequired}
                    value={title[lang.code] || ''}
                    onChange={(e) => handleTitleFieldChange(lang.code, e.target.value)}
                    placeholder={placeholders[lang.code].title}
                    className={`w-full px-4 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none ${accentStyles.borderFocus}`}
                  />
                </div>

                {showShortDescription && shortDescription && onShortDescriptionChange && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Short Description ({lang.code.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={shortDescription[lang.code] || ''}
                      onChange={(e) => handleShortDescFieldChange(lang.code, e.target.value)}
                      placeholder={placeholders[lang.code].shortDesc}
                      className={`w-full px-4 py-2.5 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none ${accentStyles.borderFocus}`}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    {contentLabel} ({lang.code.toUpperCase()})
                  </label>
                  <textarea
                    rows={4}
                    required={isRequired}
                    value={content[lang.code] || ''}
                    onChange={(e) => handleContentFieldChange(lang.code, e.target.value)}
                    placeholder={placeholders[lang.code].content}
                    className={`w-full px-4 py-3 bg-[#1b1c2b] border border-[#2e3146] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed ${accentStyles.borderFocus}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
