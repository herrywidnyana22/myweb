import './globals.css';
import type { Metadata } from 'next';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { AppProvider } from '@/context/AppContextProps';

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
  description: 'My personal website with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppProvider>   
          {children}
        </AppProvider>
      </body>
    </html>
  );
}