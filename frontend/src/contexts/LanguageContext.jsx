import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';
import ta from '../locales/ta';
import te from '../locales/te';

const dictionaries = { en, hi, ta, te };

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('agronix_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('agronix_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const dict = dictionaries[language] || dictionaries.en;
    
    if (dict[key]) return dict[key];
    if (dictionaries.en[key]) return dictionaries.en[key];
    
    const resolvePath = (obj, path) => {
      if (!obj) return undefined;
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const value = resolvePath(dict, key) || resolvePath(dictionaries.en, key);
    return value || key;
  };

  const changeLanguage = (lang) => {
    if (dictionaries[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
