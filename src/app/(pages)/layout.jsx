"use client";
import Navbar from "@/Components/Navbar/Navbar";
import { useTranslations } from "next-intl";

export default function ClientPageLayout({ children }) {
  const translations = useTranslations();
  return (
    <section>
      <Navbar translations={translations.Navbar} />
      {children}
    </section>
  );
}
