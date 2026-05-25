"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const linkClass = (href: string) =>
    `nav-link font-medium transition-colors ${
      pathname === href
        ? 'nav-link-active text-[#16a34a]'
        : 'text-[#374151] hover:text-[#16a34a]'
    }`;

  return (
    <nav className={`animate-nav-slide sticky top-0 z-50 w-full border-b border-[#dcfce7] transition-shadow ${
      scrolled
        ? 'nav-scrolled bg-white shadow-md'
        : 'bg-white/80 backdrop-blur-md sm:bg-white/80 sm:backdrop-blur-md'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#111827]">
              {t('title')}
            </Link>
          </div>

          {/* Desktop nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={linkClass('/')}>{t('home')}</Link>
            <Link href="/chatbot" className={linkClass('/chatbot')}>{t('chatbot')}</Link>
            <Link href="/article-generator" className={linkClass('/article-generator')}>{t('articles')}</Link>
            <div className="h-6 w-px bg-[#d1fae5] mx-2"></div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#dcfce7] text-[#16a34a] font-medium focus:ring-0 cursor-pointer text-sm outline-none rounded-md px-2 py-1 border-none"
            >
              <option value="en">English</option>
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#dcfce7] text-[#16a34a] font-medium focus:ring-0 cursor-pointer text-sm outline-none rounded-md px-2 py-1 border-none"
            >
              <option value="en">EN</option>
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
            </select>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#374151] hover:bg-[#f0fdf4] active:scale-95"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="menu-dropdown md:hidden bg-white border-t border-[#dcfce7] shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className={`block w-full px-4 py-3 rounded-xl text-base font-medium active:scale-[0.98] transition-transform ${pathname === '/' ? 'bg-[#dcfce7] text-[#16a34a]' : 'text-[#374151] hover:bg-[#f0fdf4]'}`}>
              {t('home')}
            </Link>
            <Link href="/chatbot" className={`block w-full px-4 py-3 rounded-xl text-base font-medium active:scale-[0.98] transition-transform ${pathname === '/chatbot' ? 'bg-[#dcfce7] text-[#16a34a]' : 'text-[#374151] hover:bg-[#f0fdf4]'}`}>
              {t('chatbot')}
            </Link>
            <Link href="/article-generator" className={`block w-full px-4 py-3 rounded-xl text-base font-medium active:scale-[0.98] transition-transform ${pathname === '/article-generator' ? 'bg-[#dcfce7] text-[#16a34a]' : 'text-[#374151] hover:bg-[#f0fdf4]'}`}>
              {t('articles')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
