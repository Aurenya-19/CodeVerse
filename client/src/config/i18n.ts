import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';
import jaTranslations from '../locales/ja.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  ja: { translation: jaTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'hi'];
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  hi: 'हिंदी (Hinglish)'
};
export default i18n;

// Hinglish translations (Hindi-English mix for Indian users)
export const hinglishTranslations = {
  common: {
    welcome: "CodeVerse mein aapka swagat hai",
    learnCoding: "Coding seekhiye apne pace pe",
    joinCommunity: "Community mein shamil hojaye",
    challenge: "Challenge",
    quest: "Daily Mission",
    level: "Level",
    xp: "Experience Points",
  },
  navigation: {
    arenas: "Skill Arenas",
    quests: "Daily Missions",
    leaderboard: "Leaderboard",
    community: "Community",
    profile: "Profile",
  },
  learning: {
    beginnerFriendly: "Beginners ke liye perfect",
    advancedContent: "Advanced learning materials",
    resources: "Padhai ke liye resources",
    completionRate: "Completion rate",
  },
};
