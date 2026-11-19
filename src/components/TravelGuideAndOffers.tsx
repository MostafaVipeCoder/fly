import React from 'react';
import { Calendar, Tag, Plane, Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Heart, MapPin } from 'lucide-react';
import { Currency, Language } from '../types';
import { POPULAR_DEALS, SpecialOffer } from '../data/specialOffers';
import { formatPrice } from '../utils/formatters';
import { findAirportByCode } from '../data/airports';

interface TravelGuideAndOffersProps {
  onSelectDeal: (originCode: string, destCode: string) => void;
  currency: Currency;
  language: Language;
}

export const TravelGuideAndOffers: React.FC<TravelGuideAndOffersProps> = ({
  onSelectDeal,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Offers Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-12 shadow-2xl border border-amber-500/30">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'عروض حصرية لموسم 2026' : 'Exclusive 2026 Flight Deals'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isAr ? 'اكتشف سحر مصر بأفضل أسعار الطيران' : 'Discover Egypt With Best Airfares'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            {isAr
              ? 'احجز تذكرتك لشواطئ البحر الأحمر في شرم الشيخ والغردقة، أو استمتع برحلة نيلية ساحرة في الأقصر وأسوان، مع رحلات العمرة المخفضة لجدة والمدينة.'
              : 'Fly to Red Sea beaches in Sharm & Hurghada, experience Nile history in Luxor & Aswan, or sacred Umrah flights to Jeddah.'}
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              <span>{isAr ? 'أقوى عروض وتخفيضات تذاكر الطيران' : 'Top Egyptian Flight Deals'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'أسعار حقيقية شاملة الضرائب ورسوم المطار مع إمكانية التقسيط عبر فاليو وفوري' : 'All prices include airport taxes with easy installments via Fawry & valU'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DEALS.map((deal, idx) => {
            const isFeatured = idx === 0;

            return (
              <div
                key={deal.id}
                id={`deal-card-${deal.id}`}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/80 transition-all group flex flex-col justify-between ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className={`relative ${isFeatured ? 'h-64 sm:h-72' : 'h-48'} overflow-hidden`}>
                    <img
                      src={deal.image}
                      alt={deal.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                        {isAr ? deal.badgeAr : deal.badgeEn}
                      </span>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl border border-white/20">
                        {deal.tagAr}
                      </span>
                    </div>

                    {/* Bottom City and Airline */}
                    <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 font-black text-lg sm:text-xl">
                        <MapPin className="w-5 h-5 text-amber-400" />
                        <span>{isAr ? deal.destNameAr : deal.destNameEn}</span>
                      </div>
                      <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-amber-300 font-bold">
                        {deal.airlineNameAr}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                      {isAr ? deal.titleAr : deal.titleEn}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-semibold">
                      <span>{isAr ? 'من:' : 'From:'} {deal.originNameAr} ({deal.originCode})</span>
                      <span className="text-amber-600 font-black">⇄</span>
                      <span>{isAr ? 'إلى:' : 'To:'} {deal.destNameAr} ({deal.destCode})</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Book Button */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {isAr ? 'السعر ابتداءً من' : 'Starting from'}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      {formatPrice(deal.priceFromEgp, currency, language)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDeal(deal.originCode, deal.destCode)}
                    className="bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <span>{isAr ? 'احجز الرحلة' : 'Book Now'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
