"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function ArticleGenerator() {
  const t = useTranslations('Articles');
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('300-400');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const generateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setArticle('');

    try {
      const prompt = `You are an expert English teacher. Please write an educational, engaging, and well-structured article about "${topic}". The article must be written entirely in English. Ensure the grammar is perfect and the structure is easy to read for students. Include a title, introduction, body paragraphs, and a conclusion.

IMPORTANT INSTRUCTIONS:
1. The article must be strictly between ${wordCount} words. Do not exceed this limit.
2. Highlight 5-10 important vocabulary words or phrases by wrapping them in double equals signs like this: ==vocabulary word==.`;
      
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      };

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key is missing in environment variables.");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate article');
      }

      const generatedText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate the article.";
      setArticle(generatedText);

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/==(.*?)==/g, '<mark class="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded-md font-medium shadow-sm border border-[#bbf7d0]">$1</mark>')
      .replace(/^# (.*$)/gim, '<h1 class="font-extrabold mt-6 sm:mt-8 mb-4 sm:mb-6 text-[#111827]">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="font-bold mt-5 sm:mt-6 mb-3 sm:mb-4 text-[#111827]">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="font-bold mt-4 sm:mt-5 mb-2 sm:mb-3 text-[#374151]">$1</h3>')
      .replace(/\n/g, '<br />');
    return { __html: formatted };
  };

  return (
    <div ref={sectionRef} className="flex flex-col items-center max-w-5xl mx-auto w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
      
      <div className="text-center mb-8 sm:mb-12 reveal animate-fade-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-3 sm:mb-4">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="reveal w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-xl border border-[#e5e7eb] mb-8 sm:mb-12">
        <form onSubmit={generateArticle} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-[#374151] mb-2 sm:mb-3 ml-1">
              {t('label')}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('placeholder')}
              className="w-full bg-[#f0fdf4] border border-[#d1fae5] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a] text-[16px] text-[#111827]"
              disabled={isLoading}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-[#374151] mb-2 sm:mb-3 ml-1">
              {t('wordCountLabel')}
            </label>
            <select
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full bg-[#f0fdf4] border border-[#d1fae5] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a] text-[16px] text-[#111827] appearance-none cursor-pointer"
              disabled={isLoading}
            >
              <option value="300-400">300 - 400 words</option>
              <option value="400-500">400 - 500 words</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="btn-glow btn-ripple w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 sm:h-[60px] bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#d1fae5] disabled:text-[#6b7280] text-white rounded-xl sm:rounded-2xl font-bold shadow-md whitespace-nowrap flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t('generating')}
              </>
            ) : t('generate')}
          </button>
        </form>
      </div>

      {/* Skeleton loader */}
      {isLoading && (
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-[#e5e7eb] mb-8 sm:mb-12">
          <div className="mb-4 overflow-hidden rounded-full">
            <div className="progress-bar"></div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="skeleton-bar w-3/4"></div>
            <div className="skeleton-bar w-full"></div>
            <div className="skeleton-bar w-full"></div>
            <div className="skeleton-bar w-5/6"></div>
            <div className="skeleton-bar w-2/3 mt-4 sm:mt-6"></div>
            <div className="skeleton-bar w-full"></div>
            <div className="skeleton-bar w-full"></div>
            <div className="skeleton-bar w-4/5"></div>
          </div>
        </div>
      )}

      {article && (
        <div className="animate-article-in w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-[#e5e7eb]">
          <div className="prose max-w-none text-[#374151] leading-relaxed">
             <div dangerouslySetInnerHTML={formatText(article)} />
          </div>
        </div>
      )}

    </div>
  );
}
