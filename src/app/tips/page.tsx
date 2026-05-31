"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Category = 'overall' | 'reading' | 'listening' | 'speaking' | 'writing' | 'vocabulary' | 'grammar';

const categoryIcons: Record<Category, string> = {
  overall:    '🌟',
  reading:    '📖',
  listening:  '🎧',
  speaking:   '🗣️',
  writing:    '✍️',
  vocabulary: '📝',
  grammar:    '⚙️',
};

export default function Tips() {
  const t = useTranslations('Tips');
  const [active, setActive] = useState<Category>('overall');

  const categories: Category[] = ['overall', 'reading', 'listening', 'speaking', 'writing', 'vocabulary', 'grammar'];

  const tips = [
    { title: t(`${active}T1`), desc: t(`${active}D1`), pro: t(`${active}P1`) },
    { title: t(`${active}T2`), desc: t(`${active}D2`), pro: t(`${active}P2`) },
  ];

  return (
    <div className="flex flex-grow w-full bg-[#f9fafb]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-[#f0f0f0] py-8 px-3">
        <p className="text-[10px] uppercase tracking-widest text-[#9ca3af] font-semibold px-3 mb-3">
          Skills
        </p>
        <nav className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                active === cat
                  ? 'bg-[#f0fdf4] text-[#16a34a]'
                  : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
              }`}
            >
              <span className="text-base leading-none">{categoryIcons[cat]}</span>
              <span>{t(`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</span>
              {active === cat && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden w-full absolute top-[64px] left-0 right-0 bg-white border-b border-[#f0f0f0] px-4 py-3 z-10 overflow-x-auto flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              active === cat
                ? 'bg-[#16a34a] text-white border-[#16a34a]'
                : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#16a34a] hover:text-[#16a34a]'
            }`}
          >
            <span>{categoryIcons[cat]}</span>
            <span>{t(`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</span>
          </button>
        ))}
      </div>

      {/* ── Main pane ── */}
      <main className="flex-1 py-10 px-6 md:px-12 pt-20 md:pt-10 max-w-3xl">

        {/* Pane header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{categoryIcons[active]}</span>
            <h1 className="text-xl font-bold text-[#111827]">{t(`${active}Title`)}</h1>
          </div>
          <p className="text-sm text-[#6b7280]">{t(`${active}Subtitle`)}</p>
        </div>

        {/* Tips list */}
        <div className="space-y-6">
          {tips.map((tip, i) => (
            <div key={`${active}-${i}`} className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <h2 className="font-semibold text-[#111827] mb-2">{tip.title}</h2>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{tip.desc}</p>
              <div className="flex gap-2 items-start bg-[#f0fdf4] rounded-lg px-4 py-3">
                <span className="text-[#16a34a] text-sm mt-0.5 shrink-0">💡</span>
                <p className="text-xs text-[#15803d] leading-relaxed">
                  <span className="font-semibold">Pro tip: </span>{tip.pro}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
