import React from 'react'
import Link from 'next/link'
import { Coffee } from 'lucide-react'
import { getCafeInfo } from '@/actions/cafe'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cafeInfo = await getCafeInfo()
  const cafeName = cafeInfo?.name || 'SOIE'
  const logoUrl = cafeInfo?.logo_url || '/logo.png'

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f8] text-[#1b1c1c] selection:bg-[#fed488] selection:text-[#031636]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#775a19]/10 bg-[#fbf9f8]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src={logoUrl}
              alt={cafeName}
              className="h-12 w-auto object-contain group-hover:drop-shadow-[0_0_8px_rgba(254,212,136,0.3)] transition-all duration-300"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-[#44474e]">
            <Link href="/" className="text-[#775a19] border-b-2 border-[#775a19] pb-1 hover:text-[#e9c176] transition-colors duration-200">
              الرئيسية
            </Link>

          </nav>

          {/* Trailing Action */}
          <div>
            <Link
              href="/menu"
              className="px-6 py-2.5 bg-[#031636] text-[#ffdea5] border border-[#ffdea5]/30 rounded-sm hover:bg-[#1a2b4c] hover:border-[#ffdea5] transition-all duration-300 text-xs font-bold shadow-[0_0_15px_rgba(3,22,54,0.15)] flex items-center gap-1.5"
            >
              <Coffee className="h-3.5 w-3.5 text-[#ffdea5]" />
              المنيو
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#775a19]/10 bg-[#171814] text-[#e5e2dc] font-sans">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8 md:gap-0">
            {/* Links */}
            <ul className="flex flex-wrap items-center justify-center gap-8">
              <li>
                <Link href="/" className="text-[#c9c6c1] hover:text-[#ffdea5] opacity-80 hover:opacity-100 transition-all text-sm md:text-base">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/" className="text-[#c9c6c1] hover:text-[#ffdea5] opacity-80 hover:opacity-100 transition-all text-sm md:text-base">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-[#c9c6c1] hover:text-[#ffdea5] opacity-80 hover:opacity-100 transition-all text-sm md:text-base">
                  اتصل بنا
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-[#c9c6c1] hover:text-[#ffdea5] opacity-80 hover:opacity-100 transition-all text-sm md:text-base">
                  لوحة التحكم
                </Link>
              </li>
            </ul>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="opacity-60 font-light tracking-wider text-xs md:text-sm">
                © {new Date().getFullYear()} كافيه {cafeName}. جميع الحقوق محفوظة.
              </p>
            </div>

            {/* Brand Logo in Footer */}
            <div className="font-serif text-3xl md:text-4xl text-[#ffdea5]/50 hidden md:block tracking-widest uppercase">
              {cafeName}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
