import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Phone, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { initialHelpArticles } from '../mockData';
import { translations } from '../translations';

interface HelpCenterProps {
  language: 'en' | 'rw';
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ language }) => {
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('h1');

  const filteredArticles = initialHelpArticles.filter(art => 
    art.question[language].toLowerCase().includes(search.toLowerCase()) || 
    art.answer[language].toLowerCase().includes(search.toLowerCase()) ||
    art.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleWhatsAppSupport = () => {
    const phone = '+250788555888';
    const message = 'Muraho ShopBook Rwanda Support, nkeneye ubufasha ku ikoreshwa ry\'aplikasiyo...';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-3xl pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.help}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Simple answers and guides to help you manage your shop easily.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search help articles (e.g. products, credit, WhatsApp)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Help Articles Accordion */}
      <div className="space-y-3">
        {filteredArticles.map(art => {
          const isExpanded = expandedId === art.id;
          return (
            <div 
              key={art.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : art.id)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">{art.category}</span>
                    <span className="text-sm">{art.question[language]}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20">
                  {art.answer[language]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Need more help? Contact Support</h3>
          <p className="text-emerald-200 text-xs mt-1">Our Musanze support team is ready to assist you via phone or WhatsApp.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleWhatsAppSupport}
            className="px-4 py-2.5 bg-white text-emerald-900 font-semibold rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>WhatsApp Support</span>
          </button>
          <a
            href="tel:+250788555888"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  );
};
