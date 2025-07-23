import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ChatwootWidget } from "@/components/ChatwootWidget";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 等待params解析
  const { locale } = await params;
  
  // 验证locale是否有效
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  // 启用静态渲染
  setRequestLocale(locale);
  
  // 获取当前语言的翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased mt-16`}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Header />
            <ChatwootWidget />
            {children}
            <Toaster position="top-right" />
            <Footer />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}