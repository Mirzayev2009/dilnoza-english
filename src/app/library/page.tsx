"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const catKey: Record<string, string> = {
  Technology: 'filterTech',
  Education:  'filterEdu',
  Science:    'filterSci',
  Culture:    'filterCult',
  Health:     'filterHealth',
};

const mockArticles = [
  { id: 1,  title: "How Quantum Computing Will Revolutionize Healthcare",       category: "Technology", time: "5 min", author: "Dilnoza AI", date: "May 25, 2026", likes: 124, excerpt: "Quantum computers operate using qubits, allowing them to process vast amounts of data simultaneously. In healthcare, this could mean simulating complex molecular structures in seconds, leading to rapid drug discovery and highly personalized medicine." },
  { id: 2,  title: "The Importance of Emotional Intelligence in Leadership",    category: "Culture",    time: "4 min", author: "Dilnoza AI", date: "May 22, 2026", likes: 89,  excerpt: "While technical skills are important, the most successful leaders often possess high Emotional Intelligence (EQ). The ability to understand and manage one's own emotions, as well as those of others, creates a healthier and more productive work environment." },
  { id: 3,  title: "Understanding the Basics of Machine Learning",              category: "Technology", time: "6 min", author: "Dilnoza AI", date: "May 18, 2026", likes: 210, excerpt: "Machine learning is a subset of artificial intelligence that allows systems to learn and improve from experience without being explicitly programmed. It powers everything from recommendation engines on Netflix to self-driving cars." },
  { id: 4,  title: "The Role of Renewable Energy in Our Future",                category: "Science",    time: "4 min", author: "Dilnoza AI", date: "May 10, 2026", likes: 156, excerpt: "As the impacts of climate change become more pronounced, the shift towards renewable energy sources like solar and wind is no longer optional. These technologies offer a sustainable path forward, reducing our reliance on fossil fuels." },
  { id: 5,  title: "Why Continuous Learning is Key to Career Success",          category: "Education",  time: "3 min", author: "Dilnoza AI", date: "May 5, 2026",  likes: 92,  excerpt: "In a rapidly changing world, the skills you learn in school may quickly become obsolete. Continuous learning—whether through online courses, reading, or mentorship—ensures you remain adaptable and competitive in the job market." },
  { id: 6,  title: "The Hidden Benefits of Daily Meditation",                   category: "Health",     time: "5 min", author: "Dilnoza AI", date: "May 1, 2026",  likes: 302, excerpt: "Meditation is more than just sitting quietly; it's an active training of the mind. Regular practice has been shown to reduce stress, improve focus, and even physically alter the brain's gray matter for better emotional regulation." },
  { id: 7,  title: "A Brief History of the English Language",                   category: "Education",  time: "7 min", author: "Dilnoza AI", date: "Apr 28, 2026", likes: 145, excerpt: "English is a complex tapestry woven from Germanic, Latin, and French roots. From the Anglo-Saxons to Shakespeare and the modern digital era, the language has constantly evolved to absorb new vocabulary and grammar." },
  { id: 8,  title: "Exploring the Wonders of the James Webb Space Telescope",   category: "Science",    time: "6 min", author: "Dilnoza AI", date: "Apr 22, 2026", likes: 275, excerpt: "The JWST is the most powerful space telescope ever built. By observing the universe in infrared, it allows astronomers to see through dust clouds and look further back in time, witnessing the birth of the very first galaxies." },
  { id: 9,  title: "How Social Media Shapes Modern Pop Culture",                 category: "Culture",    time: "4 min", author: "Dilnoza AI", date: "Apr 15, 2026", likes: 198, excerpt: "The rise of platforms like TikTok and Instagram has fundamentally shifted how trends are created. Virality now dictates music charts, fashion cycles, and even the everyday vernacular of younger generations." },
  { id: 10, title: "Nutrition Myths You Need to Stop Believing",                 category: "Health",     time: "5 min", author: "Dilnoza AI", date: "Apr 10, 2026", likes: 412, excerpt: "From 'carbs are the enemy' to 'detox diets', the wellness industry is full of misinformation. We break down the science behind what actually constitutes a balanced diet and why fad diets rarely work long-term." },
  { id: 11, title: "The Future of Augmented Reality",                            category: "Technology", time: "4 min", author: "Dilnoza AI", date: "Apr 5, 2026",  likes: 134, excerpt: "Augmented Reality (AR) blends digital elements with the physical world. Soon, AR glasses could replace smartphones, changing how we navigate cities, consume media, and interact with information on a daily basis." },
  { id: 12, title: "CRISPR and the Ethics of Gene Editing",                      category: "Science",    time: "8 min", author: "Dilnoza AI", date: "Mar 30, 2026", likes: 356, excerpt: "CRISPR-Cas9 is a revolutionary tool that allows scientists to precisely edit DNA. While it holds the potential to cure genetic diseases, it also raises profound ethical questions about 'designer babies' and ecological impacts." },
  { id: 13, title: "The Impact of Globalization on Local Traditions",             category: "Culture",    time: "5 min", author: "Dilnoza AI", date: "Mar 25, 2026", likes: 112, excerpt: "As the world becomes more interconnected, local customs face the threat of homogenization. However, many communities are finding innovative ways to preserve their heritage while embracing the benefits of a globalized economy." },
  { id: 14, title: "Effective Study Techniques for University Students",          category: "Education",  time: "4 min", author: "Dilnoza AI", date: "Mar 18, 2026", likes: 245, excerpt: "Rereading notes is often an inefficient way to study. Techniques like active recall, spaced repetition, and the Feynman technique have been scientifically proven to significantly improve long-term retention and understanding." },
  { id: 15, title: "Understanding the Gut-Brain Connection",                     category: "Health",     time: "6 min", author: "Dilnoza AI", date: "Mar 12, 2026", likes: 389, excerpt: "The human gut is often called the 'second brain'. The microbiome residing in our digestive system produces neurotransmitters that directly influence our mood, anxiety levels, and overall mental well-being." },
];

export default function Library() {
  const t = useTranslations('Library');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const threshold = window.innerWidth < 640 ? 0.05 : 0.1;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filters = [
    { label: t('filterAll'),    value: 'All' },
    { label: t('filterTech'),   value: 'Technology' },
    { label: t('filterEdu'),    value: 'Education' },
    { label: t('filterSci'),    value: 'Science' },
    { label: t('filterCult'),   value: 'Culture' },
    { label: t('filterHealth'), value: 'Health' },
  ];

  const filteredArticles = activeFilter === 'All'
    ? mockArticles
    : mockArticles.filter(a => a.category === activeFilter);

  return (
    <div ref={sectionRef} className="flex flex-col flex-grow items-center w-full bg-[#f9fafb]">

      {/* Header */}
      <div className="w-full bg-white border-b border-[#e5e7eb] py-8 sm:py-10 px-4">
        <div className="max-w-5xl mx-auto reveal animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">{t('title')}</h1>
          </div>
          <p className="text-[#6b7280] text-sm sm:text-base">{t('subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 reveal animate-fade-up">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === f.value
                  ? 'bg-[#16a34a] text-white border-[#16a34a]'
                  : 'bg-white text-[#374151] border-[#d1fae5] hover:bg-[#f0fdf4] hover:text-[#16a34a]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div key={article.id} className="card-lift bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm flex flex-col h-full hover:border-[#16a34a]/30 transition-colors">

              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center font-bold text-sm border border-[#d1fae5]">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{article.author}</p>
                    <p className="text-xs text-[#6b7280]">{article.date}</p>
                  </div>
                </div>
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                  {t('aiGenerated')}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-[#111827] mb-3 leading-snug hover:text-[#16a34a] cursor-pointer">
                {article.title}
              </h2>

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                <span className="bg-[#f3f4f6] text-[#374151] text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                  🏷️ {t(catKey[article.category] ?? 'filterAll')}
                </span>
                <span className="bg-[#f3f4f6] text-[#374151] text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                  ⏱️ {article.time}
                </span>
              </div>

              {/* Excerpt */}
              <p className="text-[#374151] text-sm leading-relaxed mb-6 flex-grow">
                {article.excerpt}
              </p>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-[#f3f4f6] mt-auto">
                <div className="flex items-center gap-1 text-[#6b7280] hover:text-[#ef4444] cursor-pointer transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{article.likes}</span>
                </div>
                <button className="text-sm font-bold text-[#16a34a] hover:text-[#15803d]">
                  {t('readArticle')}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
