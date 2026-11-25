import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { PHONE_NUMBER, SITE_NAME, SITE_SHORT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_SHORT} | Treatment-Resistant Depression Care in McLean, VA`,
  description: `Psychiatrist-led care for treatment-resistant depression in McLean, Virginia: TMS, Spravato and ketamine. Medicare, Virginia Medicaid and Tricare accepted. Book a free consultation or call ${PHONE_NUMBER}.`,
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png", sizes: "180x180" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/favicon.png",
  },
  keywords: [
    SITE_NAME,
    "treatment-resistant depression McLean VA",
    "TMS McLean VA",
    "TMS Northern Virginia",
    "Spravato McLean VA",
    "esketamine Northern Virginia",
    "IV ketamine McLean VA",
    "ketamine therapy Northern Virginia",
  ],
  openGraph: {
    title: `${SITE_NAME} | Offering hope for depression`,
    description:
      "TMS, Spravato and ketamine for treatment-resistant depression. Psychiatrist-led. Free, no-obligation consultation.",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2036",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main>{children}</main>
        <Footer />
        <Script src="https://go.4tms.com/js/form_embed.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
