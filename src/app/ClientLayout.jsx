"use client";

import MuiThemeProvider from "@/Components/MuiThemeProvider";
import { Suspense, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import Cookies from "js-cookie";

export { useTranslations } from "next-intl";

function TranslationProvider({ children }) {
  const [messages, setMessages] = useState({});
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = Cookies.get("language") || "en";
      setLocale(lang);
      try {
        const translations = await import(`../../messages/${lang}.json`);
        setMessages(translations.default);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    loadTranslations();
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export default function ClientLayout({ children }) {
  return (
    <>
      <MuiThemeProvider>
        <TranslationProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </TranslationProvider>
      </MuiThemeProvider>
    </>
  );
}
 