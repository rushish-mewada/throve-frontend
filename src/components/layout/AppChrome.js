"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar/AnnouncementBar";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout" || pathname?.startsWith("/checkout");

  if (isCheckout) {
    return <main>{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
