"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const router = useRouter();

  useEffect(() => {
    // Read from NEXT_LOCALE cookie on mount
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLanguageState(match[2]);
    } else {
      setLanguageState('en');
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguageState(lang);
    // Set the cookie for next-intl (expires in 365 days)
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh the router to fetch the new messages from the server layout
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
