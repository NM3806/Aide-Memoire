import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import LoaderProvider from "@/context/LoaderContext";
import "@liveblocks/react-ui/styles.css";
import Script from "next/script";

export const metadata = {
  title: "Aide-memoire",
  description: "By NM3806",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />

          <LoaderProvider>{children}</LoaderProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}