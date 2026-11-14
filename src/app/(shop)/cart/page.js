"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

/**
 * Cart Route:
 * The cart operates strictly as a slide-over sidebar drawer across the entire site.
 * Any direct navigation to /cart opens the drawer on the storefront.
 */
export default function CartPage() {
  const router = useRouter();
  const { setIsCartDrawerOpen } = useStore();

  useEffect(() => {
    setIsCartDrawerOpen(true);
    router.replace("/");
  }, [router, setIsCartDrawerOpen]);

  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#78716c", fontSize: "0.95rem" }}>Opening shopping bag...</p>
    </main>
  );
}
