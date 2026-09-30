import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import dayjs from 'dayjs'
import './lib/dayjsLocales'
import { resources } from './locales'

const savedLang = localStorage.getItem('nexusmind-lang') || 'az'

// Sync dayjs locale on load
dayjs.locale(savedLang === 'en' ? 'en' : savedLang)

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false
    }
  })

// Listen to language changes and keep dayjs in sync
i18n.on('languageChanged', (lng) => {
  dayjs.locale(lng === 'en' ? 'en' : lng)
})

export default i18n
