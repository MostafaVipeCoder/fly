import React from 'react';
import { Plane, ShieldCheck, PhoneCall, Mail, MapPin, Heart, Globe } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-amber-500/20 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                <Plane className="w-5 h-5 transform -rotate-45" />
              </div>
              <span className="text-xl font-black text-white font-['Cairo']">
                {isAr ? 'طيران مصر والكنانة' : 'EgyptWings Flights'}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {isAr
                ? 'المنصة الوطنية الرائدة لحجز تذاكر الطيران الداخلي والدولي في مصر. نوفر أسهل تجربة حجز مع وسائل الدفع المصرية المعتمدة (فوري، انستاباي، ميزة، فودافون كاش) وإصدار فوري لبطاقات الصعود.'
                : 'Egypt leading airline ticket reservation portal, connecting Egyptian hubs with top regional and global destinations with instant local payment support.'}
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isAr ? 'حجز آمن 100%' : '100% Secure'}
              </span>
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-semibold">
                <Globe className="w-4 h-4 text-amber-400" />
                {isAr ? 'إياتا IATA معتمد' : 'IATA Certified'}
              </span>
            </div>
          </div>

          {/* Col 2: Egyptian Domestic Routes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'أشهر الرحلات الداخلية في مصر' : 'Top Egyptian Routes'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ شرم الشيخ' : 'Cairo ⇄ Sharm El Sheikh'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ الغردقة' : 'Cairo ⇄ Hurghada'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ الأقصر' : 'Cairo ⇄ Luxor'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ أسوان' : 'Cairo ⇄ Aswan'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات برج العرب ⇄ شرم الشيخ' : 'Alexandria ⇄ Sharm'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ مرسى علم' : 'Cairo ⇄ Marsa Alam'}</span></li>
            </ul>
          </div>

          {/* Col 3: International Routes from Egypt */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'الرحلات الدولية والعمرة' : 'International & Umrah'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات العمرة: القاهرة ⇄ جدة' : 'Cairo ⇄ Jeddah (Umrah)'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ المدينة المنورة' : 'Cairo ⇄ Medina'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ دبي' : 'Cairo ⇄ Dubai'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ الرياض' : 'Cairo ⇄ Riyadh'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ إسطنبول' : 'Cairo ⇄ Istanbul'}</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">{isAr ? 'رحلات القاهرة ⇄ الكويت' : 'Cairo ⇄ Kuwait'}</span></li>
            </ul>
          </div>

          {/* Col 4: Support & Egyptian Aviation Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'خدمة العملاء والدعم بمصر' : 'Customer Support 24/7'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>19000 (الخط الساخن)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@egyptwings.com.eg</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{isAr ? 'مطار القاهرة الدولي - طريق المطار، مصر الجديدة، القاهرة' : 'Cairo International Airport, Heliopolis, Cairo, Egypt'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Partners Ribbon */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-300">
            {isAr ? 'شركاء الدفع المعتمدون في مصر:' : 'Authorized Payment Partners in Egypt:'}
          </span>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-slate-200">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg">🟡 Fawry فوري</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg">⚡ InstaPay انستاباي</span>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg">📱 Vodafone Cash</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-lg">💳 Meeza ميزة</span>
            <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">VISA / MasterCard</span>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-lg">💎 valU فاليو</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-900 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {isAr ? 'طيران مصر والكنانة. جميع الحقوق محفوظة لجمهورية مصر العربية.' : 'EgyptWings Flights. All Rights Reserved.'}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">{isAr ? 'شروط وأحكام الطيران' : 'Terms of Carriage'}</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">{isAr ? 'حقوق المسافرين' : 'Passenger Rights'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
