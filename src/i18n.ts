import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import dayjs from 'dayjs'
import './lib/dayjsLocales'
import { resources } from './locales'

// Clear any legacy language preference and lock UI strictly to Azerbaijani
try {
  localStorage.removeItem('nexusmind-lang')
} catch {
  // Ignore storage errors
}

dayjs.locale('az')

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'az',
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
