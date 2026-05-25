"use client";

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const tHero = useTranslations('Hero');
  const tCaps = useTranslations('Capabilities');
  const tPhil = useTranslations('Philosophy');
  const tFoot = useTranslations('Footer');

  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Responsive threshold: mobile 5%, tablet 10%, desktop 15% */
    const w = window.innerWidth;
    const threshold = w < 640 ? 0.05 : w < 1024 ? 0.1 : 0.15;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold }
    );

    const elements = sectionsRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionsRef} className="flex flex-col items-center justify-center flex-grow bg-white">
      
      {/* ── HERO ── */}
      <section
        className="animate-gradient-x w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 50%, #bbf7d0 100%)' }}
      >
        {/* Blobs — hidden on mobile via CSS */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-[#111827] mb-6 drop-shadow-sm animate-fade-up">
            {tHero('title')}
          </h1>
          <p className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl text-[#374151] max-w-3xl mx-auto font-light leading-relaxed animate-fade-up animate-fade-up-delay-1">
            {tHero('subtitle')}
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-fade-up animate-fade-up-delay-2">
            <Link href="/chatbot" className="animate-breathe btn-glow btn-ripple px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold shadow-xl">
              {tHero('cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-20 bg-[#f0fdf4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">{tCaps('title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 stagger-children">
            <Link href="/chatbot" className="reveal card-lift group bg-white p-6 sm:p-10 rounded-3xl border border-[#e5e7eb] cursor-pointer block">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform animate-float">💬</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 sm:mb-4">{tCaps('chatbot')}</h3>
              <p className="text-[#374151] leading-relaxed">
                {tCaps('chatbotDesc')}
              </p>
            </Link>
            <Link href="/article-generator" className="reveal card-lift group bg-white p-6 sm:p-10 rounded-3xl border border-[#e5e7eb] cursor-pointer block">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform animate-float" style={{ animationDelay: '1s' }}>📝</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 sm:mb-4">{tCaps('articles')}</h3>
              <p className="text-[#374151] leading-relaxed">
                {tCaps('articlesDesc')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEACHING PHILOSOPHY ── */}
      <section className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-20 bg-white border-y border-[#dcfce7] overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="order-2 md:order-1 reveal-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-6 sm:mb-8">{tPhil('title')}</h2>
            <div className="prose text-[#374151] leading-relaxed">
              <p className="mb-4 sm:mb-6">
                {tPhil('p1')}
              </p>
              <p className="mb-4 sm:mb-6">
                {tPhil.rich('p2', { bold: (chunks) => <strong>{chunks}</strong> })}
              </p>
              <p>
                {tPhil('p3')}
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 reveal-right">
            <div className="w-full aspect-[4/5] rounded-3xl shadow-2xl relative overflow-hidden flex items-center justify-center border border-[#d1fae5]"
              style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
              <div className="text-center">
                <div className="text-6xl sm:text-8xl mb-4">👩‍🏫</div>
                <p className="text-[#16a34a] font-medium">{tPhil('avatarName')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full py-6 sm:py-8 text-center bg-[#f0fdf4] border-t border-[#dcfce7]">
        <p className="text-[#6b7280] text-sm">
          {tFoot('text', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
}
