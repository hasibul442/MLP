"use client";
import Navbar from "@/Components/Navbar/Navbar";

export default function ClientPageLayout({ children }) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
