import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-xhr-backend"
import LanguageDetector from "i18next-browser-languagedetector"

const languages = ["en", "de", "fr", "it"]

i18n
  // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      loadPath: () => {
        // check the domain
        const host = window.location.host
        return (host === "production.ltd" ? "/static/app" : "") + "/mission-erde/klima/locales/{{lng}}/{{ns}}.json"
      },
    },
    lng: "de",
    fallbackLng: "de",
    debug: true,
    whitelist: languages,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
