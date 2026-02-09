import './globals.css';
import type { Metadata } from 'next';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { LanguageStoreInitializer } from '@/components/LanguageStoreInitializer';

const sora = Sora({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Herry Widnyana',
  description: 'My personal website with AI Agent',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <LanguageStoreInitializer />
        {children}
      </body>
    </html>
  );
}
