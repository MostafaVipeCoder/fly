import React from 'react';
import { Plane, Calendar, Activity, Ticket, Sparkles, PhoneCall, Globe, Coins, ShieldCheck } from 'lucide-react';
import { Currency, Language } from '../types';

interface HeaderProps {
  activeTab: 'search' | 'offers' | 'live' | 'manage' | 'assistant';
  setActiveTab: (tab: 'search' | 'offers' | 'live' | 'manage' | 'assistant') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  savedBookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  language,
  setLanguage,
  savedBookingsCount,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
      {/* Top micro-bar with Egyptian Tourism & Aviation badge */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 py-1.5 px-4 text-xs font-medium text-amber-100 flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded text-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            {isAr ? 'مرخص رسمياً من وزارة الطيران المدني المصري' : 'Official Civil Aviation & Tourism Partner'}
          </span>
          <span className="hidden md:inline text-amber-200/80">
            {isAr ? '🇪🇬 بوابة حجز الطيران الأولى في جمهورية مصر العربية' : '🇪🇬 Egypt Premier Flight Booking Portal'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:19000"
            className="flex items-center gap-1 hover:text-white transition-colors"
            title={isAr ? 'الخط الساخن الموحد 24/7' : '24/7 Hotline'}
          >
            <PhoneCall className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>{isAr ? 'الخط الساخن: 19000 (24/7)' : 'Hotline: 19000 (24/7)'}</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6 text-slate-950 transform -rotate-45" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-['Cairo']">
                  {isAr ? 'طيران مصر والكنانة' : 'EgyptWings'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  {isAr ? 'حجز مباشر' : 'FLIGHTS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-normal">
                {isAr ? 'حجز تذاكر الطيران الداخلي والدولي' : 'Domestic & International Flight Booking'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              id="nav-search-btn"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Plane className="w-4 h-4" />
              {isAr ? 'حجز رحلة' : 'Book Flight'}
            </button>

            <button
              id="nav-offers-btn"
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'offers'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {isAr ? 'عروض السياحة والمواسم' : 'Deals & Holidays'}
            </button>

            <button
              id="nav-live-btn"
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'live'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              {isAr ? 'تتبع الرحلات المباشر' : 'Live Flight Radar'}
            </button>

            <button
              id="nav-manage-btn"
              onClick={() => setActiveTab('manage')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              {isAr ? 'إدارة حجوزاتي' : 'My Bookings'}
              {savedBookingsCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {savedBookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-assistant-btn"
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'assistant'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              {isAr ? 'المساعد الذكي' : 'AI Assistant'}
            </button>
          </nav>

          {/* Right Controls: Currency, Language & Quick Actions */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-xs font-semibold">
              <Coins className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1" />
              <select
                id="currency-select"
                aria-label={isAr ? 'اختر العملة' : 'Select Currency'}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer py-1 pr-1 pl-1 text-xs font-bold"
              >
                <option value="EGP" className="bg-slate-900 text-white">EGP (ج.م)</option>
                <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                <option value="SAR" className="bg-slate-900 text-white">SAR (ر.س)</option>
                <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2.5 gap-2 border-t border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'search' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            {isAr ? 'حجز رحلة' : 'Search'}
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'offers' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {isAr ? 'العروض' : 'Deals'}
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'live' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            {isAr ? 'تتبع الرحلات' : 'Radar'}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'manage' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            {isAr ? 'حجوزاتي' : 'Bookings'}
            {savedBookingsCount > 0 && (
              <span className="bg-amber-600 text-white text-[9px] px-1 rounded-full">
                {savedBookingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? 'المساعد' : 'AI'}
          </button>
        </div>
      </div>
    </header>
  );
};
