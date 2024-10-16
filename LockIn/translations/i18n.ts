import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import pl from './pl.json';
import { getLocales } from 'expo-localization';

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    debug: true,
    fallbackLng: 'pl',
    lng: getLocales()[0].languageCode ?? 'pl',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      pl: {
        translation: pl,
      },
    },
  });
};

export const setLanguage = (languageCode: string) => {
  i18n.changeLanguage(languageCode);
};
