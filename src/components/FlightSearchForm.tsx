import React, { useState } from 'react';
import { Plane, ArrowLeftRight, Calendar as CalendarIcon, Users, Search, Check, Sparkles, MapPin, Tag } from 'lucide-react';
import { Airport, CabinClass, Language, SearchParams, TripType } from '../types';
import { EGYPT_AIRPORTS, INTERNATIONAL_AIRPORTS, ALL_AIRPORTS } from '../data/airports';

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
  language: Language;
  initialParams?: Partial<SearchParams>;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch,
  language,
  initialParams,
}) => {
  const isAr = language === 'ar';

  const [tripType, setTripType] = useState<TripType>(initialParams?.tripType || 'round-trip');
  const [origin, setOrigin] = useState<Airport>(initialParams?.origin || EGYPT_AIRPORTS[0]); // Cairo
  const [destination, setDestination] = useState<Airport>(initialParams?.destination || EGYPT_AIRPORTS[1]); // Sharm

  // Dates (default departure in 3 days, return in 7 days)
  const today = new Date();
  const defaultDep = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultRet = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState<string>(initialParams?.departureDate || defaultDep);
  const [returnDate, setReturnDate] = useState<string>(initialParams?.returnDate || defaultRet);

  const [adults, setAdults] = useState<number>(initialParams?.adults || 1);
  const [children, setChildren] = useState<number>(initialParams?.children || 0);
  const [infants, setInfants] = useState<number>(initialParams?.infants || 0);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialParams?.cabinClass || 'economy');
  const [directOnly, setDirectOnly] = useState<boolean>(initialParams?.directOnly || false);

  // UI state for dropdown popovers
  const [openOriginPicker, setOpenOriginPicker] = useState(false);
  const [openDestPicker, setOpenDestPicker] = useState(false);
  const [openPassengerPicker, setOpenPassengerPicker] = useState(false);
  const [originSearchText, setOriginSearchText] = useState('');
  const [destSearchText, setDestSearchText] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'EGYPT2026' || code === 'AHLAN' || code === 'MASR' || code === 'UMRAH10') {
      setAppliedPromo(code);
    } else {
      alert(isAr ? 'كود الخصم غير صالح. جرب AHLAN أو EGYPT2026' : 'Invalid promo code. Try AHLAN or EGYPT2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.code === destination.code) {
      alert(isAr ? 'يرجى اختيار مطار وجهة مختلف عن مطار المغادرة' : 'Please select a different destination airport.');
      return;
    }

    onSearch({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      adults,
      children,
      infants,
      cabinClass,
      directOnly,
    });
  };

  const filteredOriginAirports = ALL_AIRPORTS.filter(a =>
    a.nameAr.includes(originSearchText) ||
    a.nameEn.toLowerCase().includes(originSearchText.toLowerCase()) ||
    a.cityAr.includes(originSearchText) ||
    a.cityEn.toLowerCase().includes(originSearchText.toLowerCase()) ||
    a.code.toLowerCase().includes(originSearchText.toLowerCase())
  );

  const filteredDestAirports = ALL_AIRPORTS.filter(a =>
    a.nameAr.includes(destSearchText) ||
    a.nameEn.toLowerCase().includes(destSearchText.toLowerCase()) ||
    a.cityAr.includes(destSearchText) ||
    a.cityEn.toLowerCase().includes(destSearchText.toLowerCase()) ||
    a.code.toLowerCase().includes(destSearchText.toLowerCase())
  );

  const totalPassengers = adults + children + infants;

  const cabinClassLabels: Record<CabinClass, { ar: string; en: string }> = {
    economy: { ar: 'الدرجة السياحية (Economy)', en: 'Economy Class' },
    premium_economy: { ar: 'السياحية المتميزة (Premium)', en: 'Premium Economy' },
    business: { ar: 'درجة رجال الأعمال (Business)', en: 'Business Class' },
    first: { ar: 'الدرجة الأولى (First)', en: 'First Class' },
  };

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 -mt-8 md:-mt-12 text-slate-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Controls: Trip Type & Cabin / Passengers Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Trip Type Selector */}
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              id="trip-type-roundtrip"
              onClick={() => setTripType('round-trip')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'round-trip'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'ذهاب وعودة' : 'Round Trip'}
            </button>
            <button
              type="button"
              id="trip-type-oneway"
              onClick={() => setTripType('one-way')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'one-way'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'ذهاب فقط' : 'One Way'}
            </button>
            <button
              type="button"
              id="trip-type-multicity"
              onClick={() => setTripType('multi-city')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'multi-city'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'وجهات متعددة' : 'Multi-City'}
            </button>
          </div>

          {/* Quick Egyptian Hubs shortcuts */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">{isAr ? 'وجهات مصر الشائعة:' : 'Popular Egypt Hubs:'}</span>
            <button
              type="button"
              onClick={() => {
                setOrigin(EGYPT_AIRPORTS[0]); // Cairo
                setDestination(EGYPT_AIRPORTS[1]); // Sharm
              }}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
            >
              {isAr ? 'القاهرة ⇄ شرم الشيخ' : 'Cairo ⇄ Sharm'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOrigin(EGYPT_AIRPORTS[0]); // Cairo
                setDestination(EGYPT_AIRPORTS[2]); // Hurghada
              }}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
            >
              {isAr ? 'القاهرة ⇄ الغردقة' : 'Cairo ⇄ Hurghada'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOrigin(EGYPT_AIRPORTS[0]); // Cairo
                setDestination(INTERNATIONAL_AIRPORTS[0]); // Jeddah
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
            >
              {isAr ? 'القاهرة ⇄ جدة (عمرة)' : 'Cairo ⇄ Jeddah'}
            </button>
          </div>
        </div>

        {/* Main Grid: Origin, Swap, Destination, Dates, Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          
          {/* Origin Airport Field */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {isAr ? 'من أين تسافر؟ (المغادرة)' : 'From (Departure)'}
            </label>
            <div
              id="origin-picker-trigger"
              onClick={() => {
                setOpenOriginPicker(!openOriginPicker);
                setOpenDestPicker(false);
                setOpenPassengerPicker(false);
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-amber-500 rounded-2xl p-3.5 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 font-mono tracking-wider">{origin.code}</span>
                  <span className="text-sm font-bold text-slate-800">{isAr ? origin.cityAr : origin.cityEn}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                  {isAr ? origin.nameAr : origin.nameEn}
                </p>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-500/20">
                {origin.isDomesticEgypt ? (isAr ? 'مصر' : 'Egypt') : (isAr ? 'دولي' : 'Intl')}
              </span>
            </div>

            {/* Origin Dropdown Modal */}
            {openOriginPicker && (
              <div className="absolute top-full right-0 z-50 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    id="origin-search-input"
                    value={originSearchText}
                    onChange={(e) => setOriginSearchText(e.target.value)}
                    placeholder={isAr ? 'ابحث باسم المدينة أو المطار أو الكود (مثال: CAI)' : 'Search city or airport code...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                    {isAr ? '🇪🇬 مطارات جمهورية مصر العربية' : '🇪🇬 Egyptian Airports'}
                  </div>
                  {filteredOriginAirports.filter(a => a.isDomesticEgypt).map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setOrigin(airport);
                        setOpenOriginPicker(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between transition-colors ${
                        origin.code === airport.code ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded">
                            {airport.code}
                          </span>
                          <span className="text-xs font-bold">{isAr ? airport.cityAr : airport.cityEn}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? airport.nameAr : airport.nameEn}</p>
                      </div>
                      {origin.code === airport.code && <Check className="w-4 h-4 text-slate-950" />}
                    </button>
                  ))}

                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md mt-2">
                    {isAr ? '✈️ المطارات الدولية الإقليمية' : '✈️ International Destinations'}
                  </div>
                  {filteredOriginAirports.filter(a => !a.isDomesticEgypt).map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setOrigin(airport);
                        setOpenOriginPicker(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between transition-colors ${
                        origin.code === airport.code ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded">
                            {airport.code}
                          </span>
                          <span className="text-xs font-bold">{isAr ? airport.cityAr : airport.cityEn}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? airport.countryAr : airport.countryEn}</p>
                      </div>
                      {origin.code === airport.code && <Check className="w-4 h-4 text-slate-950" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Airport Button */}
          <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
            <button
              type="button"
              id="swap-airports-btn"
              onClick={handleSwapAirports}
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-slate-950 flex items-center justify-center shadow-md transition-all transform hover:rotate-180 duration-300"
              title={isAr ? 'تبديل وجهة المغادرة والوصول' : 'Swap Origin and Destination'}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Airport Field */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-amber-600" />
              {isAr ? 'إلى أين تسافر؟ (الوصول)' : 'To (Destination)'}
            </label>
            <div
              id="dest-picker-trigger"
              onClick={() => {
                setOpenDestPicker(!openDestPicker);
                setOpenOriginPicker(false);
                setOpenPassengerPicker(false);
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-amber-500 rounded-2xl p-3.5 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 font-mono tracking-wider">{destination.code}</span>
                  <span className="text-sm font-bold text-slate-800">{isAr ? destination.cityAr : destination.cityEn}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                  {isAr ? destination.nameAr : destination.nameEn}
                </p>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-500/20">
                {destination.isDomesticEgypt ? (isAr ? 'مصر' : 'Egypt') : (isAr ? 'دولي' : 'Intl')}
              </span>
            </div>

            {/* Destination Dropdown Modal */}
            {openDestPicker && (
              <div className="absolute top-full left-0 md:right-0 z-50 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    id="dest-search-input"
                    value={destSearchText}
                    onChange={(e) => setDestSearchText(e.target.value)}
                    placeholder={isAr ? 'ابحث باسم المدينة أو المطار أو الكود (مثال: SSH, DXB)' : 'Search city or airport code...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                    {isAr ? '🇪🇬 المطارات والمدن المصرية' : '🇪🇬 Egyptian Destinations'}
                  </div>
                  {filteredDestAirports.filter(a => a.isDomesticEgypt).map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setDestination(airport);
                        setOpenDestPicker(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between transition-colors ${
                        destination.code === airport.code ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded">
                            {airport.code}
                          </span>
                          <span className="text-xs font-bold">{isAr ? airport.cityAr : airport.cityEn}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? airport.nameAr : airport.nameEn}</p>
                      </div>
                      {destination.code === airport.code && <Check className="w-4 h-4 text-slate-950" />}
                    </button>
                  ))}

                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md mt-2">
                    {isAr ? '✈️ الرحلات الدولية الأكثر حجزاً' : '✈️ Top International Destinations'}
                  </div>
                  {filteredDestAirports.filter(a => !a.isDomesticEgypt).map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setDestination(airport);
                        setOpenDestPicker(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between transition-colors ${
                        destination.code === airport.code ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded">
                            {airport.code}
                          </span>
                          <span className="text-xs font-bold">{isAr ? airport.cityAr : airport.cityEn}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? airport.countryAr : airport.countryEn}</p>
                      </div>
                      {destination.code === airport.code && <Check className="w-4 h-4 text-slate-950" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dates & Passengers in the remaining 5 columns */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Departure Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                {isAr ? 'تاريخ المغادرة' : 'Departure Date'}
              </label>
              <input
                type="date"
                id="departure-date-input"
                value={departureDate}
                min={today.toISOString().split('T')[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-2xl p-3 text-xs sm:text-sm font-bold text-slate-900 outline-none"
              />
            </div>

            {/* Return Date (if round-trip) or Passengers selector (if one-way) */}
            {tripType === 'round-trip' ? (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                  {isAr ? 'تاريخ العودة' : 'Return Date'}
                </label>
                <input
                  type="date"
                  id="return-date-input"
                  value={returnDate}
                  min={departureDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-2xl p-3 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                />
              </div>
            ) : (
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  {isAr ? 'المسافرون والدرجة' : 'Passengers & Class'}
                </label>
                <div
                  id="passengers-popover-trigger-oneway"
                  onClick={() => {
                    setOpenPassengerPicker(!openPassengerPicker);
                    setOpenOriginPicker(false);
                    setOpenDestPicker(false);
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-amber-500 rounded-2xl p-3 cursor-pointer text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between"
                >
                  <span className="truncate">{totalPassengers} {isAr ? 'مسافر' : 'Pax'} • {isAr ? cabinClassLabels[cabinClass].ar.split(' ')[0] : cabinClass}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Strip: Passengers Modal Trigger for Round-trip + Direct Flights Checkbox + Promo Code + Search Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* If roundtrip, show passenger selector button here */}
            {tripType === 'round-trip' && (
              <div className="relative">
                <button
                  type="button"
                  id="passengers-popover-trigger-roundtrip"
                  onClick={() => {
                    setOpenPassengerPicker(!openPassengerPicker);
                    setOpenOriginPicker(false);
                    setOpenDestPicker(false);
                  }}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 transition-colors"
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>
                    {totalPassengers} {isAr ? 'مسافر' : 'Travelers'} • {isAr ? cabinClassLabels[cabinClass].ar : cabinClassLabels[cabinClass].en}
                  </span>
                </button>
              </div>
            )}

            {/* Direct Only Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                id="direct-only-checkbox"
                checked={directOnly}
                onChange={(e) => setDirectOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
              />
              <span>{isAr ? 'رحلات مباشرة فقط (بدون توقف)' : 'Direct flights only'}</span>
            </label>

            {/* Promo Code Trigger */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <input
                type="text"
                id="promo-code-input"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={isAr ? 'كود الخصم (مثال: AHLAN)' : 'Promo code (e.g. AHLAN)'}
                className="bg-transparent uppercase font-bold text-slate-800 placeholder:text-slate-400 outline-none w-28 text-xs"
              />
              <button
                type="button"
                id="apply-promo-btn"
                onClick={handleApplyPromo}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] transition-colors"
              >
                {isAr ? 'تطبيق' : 'Apply'}
              </button>
              {appliedPromo && (
                <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                  ✓ {appliedPromo}
                </span>
              )}
            </div>
          </div>

          {/* Passenger Picker Popover */}
          {openPassengerPicker && (
            <div className="absolute right-6 bottom-20 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900">{isAr ? 'المسافرون والدرجة' : 'Passengers & Cabin'}</span>
                <button
                  type="button"
                  onClick={() => setOpenPassengerPicker(false)}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold"
                >
                  {isAr ? 'تم' : 'Done'}
                </button>
              </div>

              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{isAr ? 'البالغين (12+ سنة)' : 'Adults (12+ yrs)'}</p>
                  <p className="text-[10px] text-slate-400">{isAr ? 'تذكرة كاملة' : 'Full fare'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 9}
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{isAr ? 'الأطفال (2 - 11 سنة)' : 'Children (2-11 yrs)'}</p>
                  <p className="text-[10px] text-slate-400">{isAr ? 'خصم 25% من السعر' : '25% discount'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-4 text-center">{children}</span>
                  <button
                    type="button"
                    disabled={children >= 8}
                    onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{isAr ? 'الرضع (أقل من سنتين)' : 'Infants (<2 yrs)'}</p>
                  <p className="text-[10px] text-slate-400">{isAr ? 'على حجر الوالدين (خصم 90%)' : 'On parent lap (90% off)'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={infants <= 0}
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-4 text-center">{infants}</span>
                  <button
                    type="button"
                    disabled={infants >= adults}
                    onClick={() => setInfants(infants + 1)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cabin Class Selection */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr ? 'درجة السفر' : 'Cabin Class'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(['economy', 'premium_economy', 'business', 'first'] as CabinClass[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCabinClass(c)}
                      className={`p-2 rounded-xl text-right font-bold transition-all ${
                        cabinClass === c
                          ? 'bg-slate-900 text-amber-400 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isAr ? cabinClassLabels[c].ar.split(' ')[0] : cabinClassLabels[c].en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Big Search Flights Button */}
          <button
            type="submit"
            id="search-flights-submit-btn"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-600/30 flex items-center justify-center gap-3 text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span>{isAr ? 'البحث عن الرحلات المتاحة' : 'Search Available Flights'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
