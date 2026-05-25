"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslations } from 'next-intl';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const SYSTEM_PROMPT = `You are Dilnoza, an expert English teacher currently pursuing her PhD. Your goal is to help students improve their English. You can speak English, Russian, and Uzbek perfectly. Be encouraging, correct mistakes gently, and always maintain your persona as Dilnoza the English teacher. Keep responses concise and helpful.`;

export default function Chatbot() {
  const t = useTranslations('Chatbot');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { language } = useLanguage();

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) setMessages(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const processMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const payload = {
        system_instruction: {
          parts: [{ text: `${SYSTEM_PROMPT} The user has selected their preferred language as ${language}. You must strictly respond in ${language}, unless you are explicitly teaching an English concept that requires English examples.` }]
        },
        contents: [
          ...historyForApi,
          { role: 'user', parts: [{ text: userMessage.content }] }
        ],
        generationConfig: {
          temperature: 0.7,
        }
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
        throw new Error(data.error?.message || 'Failed to generate response');
      }

      const botMessageText = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', content: botMessageText }]);

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await processMessage(input);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await processMessage(suggestion);
  };

  return (
    <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto px-2 py-2 sm:p-4 md:p-6 h-[calc(100vh-4rem)]">
      {/* Outer card */}
      <div className="flex flex-col flex-grow bg-white rounded-2xl sm:rounded-3xl border-2 border-[#bbf7d0] shadow-xl overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#f0fdf4] border-b-2 border-[#dcfce7]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-sm sm:text-lg">👩‍🏫</div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#111827] leading-tight">Dilnoza AI</h2>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">{t('teacher')} &middot; {language.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={clearHistory}
            className="btn-glow btn-ripple px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full text-xs sm:text-sm font-medium text-[#6b7280] hover:text-[#16a34a] border border-[#d1fae5] shadow-sm"
          >
            {t('clearBtn')}
          </button>
        </div>

        {/* Chat messages area */}
        <div className="flex-grow overflow-y-auto p-3 sm:p-5 md:p-8 bg-[#f0fdf4] flex flex-col gap-3 sm:gap-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-up px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#dcfce7] flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-5 animate-float">👩‍🏫</div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">{t('welcomeTitle')}</h2>
              <p className="text-[#6b7280] max-w-md mb-4 sm:mb-6">
                {t('welcomeSub', { language: language.toUpperCase() })}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {[t('sug1'), t('sug2'), t('sug3')].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="btn-glow px-3 py-1.5 sm:px-4 sm:py-2 bg-white border-2 border-[#d1fae5] rounded-full text-xs sm:text-sm text-[#16a34a] font-medium hover:bg-[#dcfce7] active:scale-[0.97]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`animate-msg flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] sm:max-w-[75%] p-3 sm:p-4 md:p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#16a34a] text-white rounded-br-sm shadow-md shadow-[#16a34a]/20' 
                    : 'bg-white text-[#374151] rounded-bl-sm border-2 border-[#d1fae5] shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-msg">
              <div className="p-4 sm:p-5 rounded-2xl rounded-bl-sm bg-white border-2 border-[#d1fae5] shadow-md flex gap-2 sm:gap-3 items-center">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — safe-area for iOS */}
        <div className="px-3 sm:px-5 md:px-8 py-3 sm:py-4 bg-white border-t-2 border-[#dcfce7]" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <form onSubmit={handleFormSubmit} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading && input.trim()) {
                  e.preventDefault();
                  handleFormSubmit();
                }
              }}
              placeholder={t('placeholder')}
              className="flex-grow bg-[#f0fdf4] border-2 border-[#d1fae5] rounded-full px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] text-[16px] text-[#111827] placeholder-[#6b7280]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-ripple flex-shrink-0 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#d1fae5] text-white rounded-full flex items-center justify-center shadow-sm active:scale-[0.95]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
