import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});




const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dilnoza English AI | Learn English with AI",
  description:
    "Practice English with Dilnoza English AI. Improve reading, vocabulary, grammar, and speaking through AI-powered lessons and articles.",
  keywords: [
    "Dilnoza",
    "Dilnoza English",
    "Dilnoza English AI",
    "English learning",
    "AI English tutor",
    "English chatbot",
    "Vocabulary practice",
    "Grammar practice",
    "English articles",
    "Ingliz tili",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
