"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar/AnnouncementBar";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import QuickSizeModal from "@/components/ui/QuickSizeModal/QuickSizeModal";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const { isQuickSizeOpen, closeQuickSize, quickSizeProduct } = useStore();
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
      <QuickSizeModal
        isOpen={isQuickSizeOpen}
        onClose={closeQuickSize}
        product={quickSizeProduct}
      />
    </>
  );
}

