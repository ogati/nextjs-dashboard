import './ui/global.css';
import { inter } from './ui/fonts';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme'
  },
  description: 'A Next.js application, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default async function RootLayout({children, params}: {children: React.ReactNode, params: Promise<{locale: string}>}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
