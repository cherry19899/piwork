import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import hiCommon from './locales/hi/common.json';
import ptCommon from './locales/pt/common.json';
import enJobs from './locales/en/jobs.json';
import hiJobs from './locales/hi/jobs.json';
import ptJobs from './locales/pt/jobs.json';

const resources = {
  en: {
    common: enCommon,
    jobs: enJobs,
  },
  hi: {
    common: hiCommon,
    jobs: hiJobs,
  },
  pt: {
    common: ptCommon,
    jobs: ptJobs,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common', 'jobs'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
