import React from 'react';
import { Store, Check, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

interface OnboardingModalProps {
  onClose: () => void;
  language: 'en' | 'rw';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, language }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
          <Store className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
            Musanze, Rwanda
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.onboardingTitle}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            {t.onboardingSubtitle} Easily record daily sales, manage customer credit debts (Akabanki), and keep track of your stock.
          </p>
        </div>

        <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Fast POS checkout with Cash, MoMo, or Credit options.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Automatic debt tracking and 1-click WhatsApp payment reminders.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Complete offline readiness with local storage persistence.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>{t.getStarted}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
