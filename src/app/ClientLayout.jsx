"use client";

import MuiThemeProvider from "@/Components/MuiThemeProvider";
import { Suspense, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider, useLanguageContext } from "@/Context/LanguageContext";
import enMessages from "../../messages/en.json";
import bnMessages from "../../messages/bn.json";

export { useTranslations } from "next-intl";

const messagesByLocale = {
  en: enMessages,
  bn: bnMessages
};

function TranslationProvider({ children }) {
  const { language } = useLanguageContext();
  const [locale, setLocale] = useState(language);
  const [messages, setMessages] = useState(messagesByLocale[language] || enMessages);

  useEffect(() => {
    setLocale(language);
    setMessages(messagesByLocale[language] || enMessages);
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
