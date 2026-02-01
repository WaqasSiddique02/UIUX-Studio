import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "sonner";
import MobileViewWrapper from "./MobileViewWrapper";

const appFont = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI UX Generator App",
  description: "Web and Mobile UI UX Generator App using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={appFont.className}>
          <MobileViewWrapper>
            <Provider>{children}</Provider>
          </MobileViewWrapper>
          <Toaster position="top-center"/>
        </body>
      </html>
    </ClerkProvider>
  );
}
