import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import VisitorTracker from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "GlassButterfly",
  description: "Let something beautiful live on your screen.",
  icons: { icon: "/assets/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Body: Inter. Display: Cormorant Garamond (free editorial serif,
            closest to Canela / Editorial New). Loaded from Google's CDN. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&family=Inter:wght@300;400;500;600&family=Permanent+Marker&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <VisitorTracker />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
