import type { Metadata } from 'next'
import { Cairo, Aref_Ruqaa } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const cairo = Cairo({
  variable: '--font-sans',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const arefRuqaa = Aref_Ruqaa({
  variable: '--font-serif',
  subsets: ['arabic'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: "SOIE CAFE | سويه كافيه",
  description: 'استمتع بالقهوة العضوية المحمصة محلياً بدقة متناهية. مساحة عمل مصممة للمبتكرين والمفكرين والمبدعين.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark scroll-smooth">
      <body
        className={`${cairo.variable} ${arefRuqaa.variable} font-sans bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-300`}
      >
        {children}
        <Toaster theme="dark" position="bottom-left" richColors />
      </body>
    </html>
  )
}
