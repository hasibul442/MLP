import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");
    const [isInitialized, setIsInitialized] = useState(false);

    // Load language from cookie only on client side after mount
    useEffect(() => {
        const languageFromCookie = Cookies.get("language");
        if (languageFromCookie && languageFromCookie !== language) {
            setLanguage(languageFromCookie);
        }
        setIsInitialized(true);
    }, []);

    // Save language to cookie when it changes
    useEffect(() => {
        if (isInitialized) {
            Cookies.set("language", language, { expires: 365 });
        }
    }, [language, isInitialized]);

    const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
    return useContext(LanguageContext);
}
