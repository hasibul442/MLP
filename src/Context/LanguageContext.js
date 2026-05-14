import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const languageFromCookie = Cookies.get("language") || "en";
    const [language, setLanguage] = useState(languageFromCookie);

    useEffect(() => {
        Cookies.set("language", language, { expires: 365 });
    }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
    return useContext(LanguageContext);
}