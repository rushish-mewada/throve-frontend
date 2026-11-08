import { Poppins, Abhaya_Libre } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { StoreProvider } from "@/context/StoreContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const abhaya = Abhaya_Libre({
  variable: "--font-abhaya",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Throve | Premium Lifestyle Goods",
  description: "Curated exclusively for India. Zero-API Architecture natively powered by Medusa v2.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${abhaya.variable}`}>
      <body>
        <StoreProvider>
          <AppChrome>{children}</AppChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
