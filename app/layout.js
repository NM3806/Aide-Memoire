import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Fira_Code } from "next/font/google";
import { LoaderProvider } from "@/context/LoaderContext";
import "@liveblocks/react-ui/styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Aide-memoire",
  description: "By NM3806",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${firaCode.variable} antialiased`}
        >
          <LoaderProvider>{children}</LoaderProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
