"use client";

import MuiThemeProvider from "@/Components/MuiThemeProvider";
import { Suspense, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider, useLanguageContext } from "@/Context/LanguageContext";
import Cookies from "js-cookie";

export { useTranslations } from "next-intl";

function TranslationProvider({ children }) {
  const [messages, setMessages] = useState({});
  const { language } = useLanguageContext();
  const [locale, setLocale] = useState(language);

  useEffect(() => {
    const loadTranslations = async () => {
      setLocale(language);
      try {
        const translations = await import(`../../messages/${language}.json`);
        setMessages(translations.default);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    loadTranslations();
  }, [language]);

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone="Asia/Dhaka"
    >
      {children}
    </NextIntlClientProvider>
  );
}

export default function ClientLayout({ children }) {
  return (
    <>
      <MuiThemeProvider>
        <LanguageProvider>
          <TranslationProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </TranslationProvider>
        </LanguageProvider>
      </MuiThemeProvider>
    </>
  );
}
 