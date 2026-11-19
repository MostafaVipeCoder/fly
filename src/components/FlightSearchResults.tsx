import React, { useState, useMemo } from 'react';
import { 
  Plane, Clock, Luggage, Shield, Check, ArrowRight, ArrowLeft, SlidersHorizontal, 
  ChevronDown, ChevronUp, Sparkles, AlertCircle, RefreshCw, Star, Info
} from 'lucide-react';
import { Currency, FareOption, Flight, Language, SearchParams } from '../types';
import { formatDuration, formatPrice, formatDateArabic } from '../utils/formatters';

interface FlightSearchResultsProps {
  flights: Flight[];
  searchParams: SearchParams;
  onSelectFlight: (flight: Flight, fareOption: FareOption) => void;
  onModifySearch: () => void;
  currency: Currency;
  language: Language;
}

type SortOption = 'cheapest' | 'fastest' | 'earliest';

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  flights,
  searchParams,
  onSelectFlight,
  onModifySearch,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    if (flights.length === 0) return 15000;
    return Math.max(...flights.map(f => f.basePriceEgp)) + 1000;
  });
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [onlyDirect, setOnlyDirect] = useState<boolean>(searchParams.directOnly);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('cheapest');

  // Expanded flight for viewing fare classes
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(flights[0]?.id || null);

  // 7-day flexible date bar active index
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  // Available airlines in the search results
  const availableAirlines = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    flights.forEach(f => {
      map.set(f.airline.code, {
        code: f.airline.code,
        name: isAr ? f.airline.nameAr : f.airline.nameEn,
      });
    });
    return Array.from(map.values());
  }, [flights, isAr]);

  const toggleAirlineFilter = (code: string) => {
    if (selectedAirlines.includes(code)) {
      setSelectedAirlines(selectedAirlines.filter(c => c !== code));
    } else {
      setSelectedAirlines([...selectedAirlines, code]);
    }
  };

  // Filtered & Sorted flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter(flight => {
        if (flight.basePriceEgp > maxPrice) return false;
        if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline.code)) return false;
        if (onlyDirect && !flight.isDirect) return false;

        if (timeFilter !== 'all') {
          const hour = parseInt(flight.outbound.departureTime.split('T')[1].split(':')[0], 10);
          if (timeFilter === 'morning' && (hour < 5 || hour >= 12)) return false;
          if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
          if (timeFilter === 'evening' && hour < 18) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'cheapest') return a.basePriceEgp - b.basePriceEgp;
        if (sortOption === 'fastest') return a.outbound.durationMinutes - b.outbound.durationMinutes;
        if (sortOption === 'earliest') {
          return a.outbound.departureTime.localeCompare(b.outbound.departureTime);
        }
        return 0;
      });
  }, [flights, maxPrice, selectedAirlines, onlyDirect, timeFilter, sortOption]);

  // Date strip generation (-3 days to +3 days)
  const dateStrip = useMemo(() => {
    const baseDate = new Date(searchParams.departureDate);
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
      const isCheapestDay = i === -1 || i === 2;
      const baseEstimate = flights[0]?.basePriceEgp || 1800;
      const dayPrice = Math.round(baseEstimate * (isCheapestDay ? 0.88 : (1 + Math.abs(i) * 0.04)));
      days.push({
        offset: i,
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'short' }),
        dateFormatted: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' }),
        price: dayPrice,
        isCheapest: isCheapestDay,
      });
    }
    return days;
  }, [searchParams.departureDate, flights, isAr]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner: Route & Summary & Modify Button */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-black">
              <span>{isAr ? searchParams.origin.cityAr : searchParams.origin.cityEn}</span>
              <span className="text-amber-400 font-mono text-base bg-slate-800 px-2 py-0.5 rounded">
                ({searchParams.origin.code})
              </span>
              <span className="text-amber-400">⇄</span>
              <span>{isAr ? searchParams.destination.cityAr : searchParams.destination.cityEn}</span>
              <span className="text-amber-400 font-mono text-base bg-slate-800 px-2 py-0.5 rounded">
                ({searchParams.destination.code})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1">
              <span>📅 {formatDateArabic(searchParams.departureDate)}</span>
              {searchParams.returnDate && (
                <span> ➔ 📅 {formatDateArabic(searchParams.returnDate)}</span>
              )}
              <span>• 👥 {searchParams.adults + searchParams.children + searchParams.infants} {isAr ? 'مسافر' : 'Travelers'}</span>
              <span>• 💺 {searchParams.cabinClass.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          id="modify-search-btn"
          onClick={onModifySearch}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isAr ? 'تعديل البحث' : 'Modify Search'}</span>
        </button>
      </div>

      {/* 7-Day Flexible Fare Strip */}
      <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[650px] gap-2">
          {dateStrip.map((item) => {
            const isSelected = item.offset === selectedDayOffset;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDayOffset(item.offset)}
                className={`flex-1 p-3 rounded-xl text-center transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <p className="text-xs font-semibold">{item.dayName}، {item.dateFormatted}</p>
                <p className={`text-sm font-black mt-1 ${isSelected ? 'text-amber-400' : 'text-slate-900'}`}>
                  {formatPrice(item.price, currency, language)}
                </p>
                {item.isCheapest && (
                  <span className="inline-block bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded mt-1">
                    {isAr ? 'أرخص سعر' : 'Cheapest'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Flight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-base text-slate-900">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                <span>{isAr ? 'تصفية النتائج' : 'Filter Flights'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaxPrice(15000);
                  setSelectedAirlines([]);
                  setOnlyDirect(false);
                  setTimeFilter('all');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
              >
                {isAr ? 'إعادة ضبط' : 'Reset'}
              </button>
            </div>

            {/* Direct Flights Only */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {isAr ? 'رحلات مباشرة فقط' : 'Direct flights only'}
                </span>
                <input
                  type="checkbox"
                  id="filter-direct-only"
                  checked={onlyDirect}
                  onChange={(e) => setOnlyDirect(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span>{isAr ? 'الحد الأقصى للسعر:' : 'Max Price:'}</span>
                <span className="text-amber-600 font-black">{formatPrice(maxPrice, currency, language)}</span>
              </div>
              <input
                type="range"
                id="filter-price-slider"
                min="1000"
                max="25000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>1,000 ج.م</span>
                <span>25,000 ج.م</span>
              </div>
            </div>

            {/* Airlines Filter */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                {isAr ? 'شركات الطيران العاملة في مصر' : 'Airlines'}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {availableAirlines.map(airline => (
                  <label
                    key={airline.code}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                        {airline.code}
                      </span>
                      <span>{airline.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline.code)}
                      onChange={() => toggleAirlineFilter(airline.code)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time Slots */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                {isAr ? 'أوقات الإقلاع' : 'Departure Time'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTimeFilter('all')}
                  className={`p-2 rounded-xl transition-colors ${
                    timeFilter === 'all' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'كل الأوقات' : 'All times'}
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('morning')}
                  className={`p-2 rounded-xl transition-colors ${
                    timeFilter === 'morning' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'صباحاً (05-12)' : 'Morning'}
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('afternoon')}
                  className={`p-2 rounded-xl transition-colors ${
                    timeFilter === 'afternoon' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'ظهراً (12-18)' : 'Afternoon'}
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('evening')}
                  className={`p-2 rounded-xl transition-colors ${
                    timeFilter === 'evening' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'مساءً (18-24)' : 'Evening'}
                </button>
              </div>
            </div>

            {/* Egypt Fast Airport Assistance info */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 text-xs space-y-1.5 text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'خدمة المسار السريع بمطار القاهرة' : 'Cairo Airport Fast Track'}</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                {isAr
                  ? 'يمكنك إضافة خدمة كبار الزوار وإنهاء إجراءات الجوازات في مطار القاهرة الدولي في الخطوة القادمة.'
                  : 'Fast-track passport control & VIP Lounge access can be added in the next step.'}
              </p>
            </div>
          </div>
        </aside>

        {/* Flight Cards List */}
        <main className="lg:col-span-8 space-y-4">
          
          {/* Sorting Header */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-bold text-slate-800">
              {isAr ? 'تم العثور على ' : 'Found '}
              <span className="text-amber-600 font-black">{filteredFlights.length}</span>
              {isAr ? ' رحلة متاحة' : ' flights available'}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{isAr ? 'الترتيب حسب:' : 'Sort by:'}</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSortOption('cheapest')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sortOption === 'cheapest' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                  }`}
                >
                  {isAr ? 'الأرخص سعراً' : 'Cheapest'}
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption('fastest')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sortOption === 'fastest' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                  }`}
                >
                  {isAr ? 'الأسرع وقتاً' : 'Fastest'}
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption('earliest')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sortOption === 'earliest' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                  }`}
                >
                  {isAr ? 'الأبكر موعداً' : 'Earliest'}
                </button>
              </div>
            </div>
          </div>

          {/* Empty State if no flights match */}
          {filteredFlights.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-slate-200 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                {isAr ? 'لا توجد رحلات تطابق الفلاتر المحددة' : 'No flights match your filter criteria'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isAr ? 'جرب توسيع نطاق السعر أو إلغاء تحديد شركة طيران معينة لعرض المزيد من الخيارات.' : 'Try expanding the price range or clearing filters.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaxPrice(25000);
                  setSelectedAirlines([]);
                  setOnlyDirect(false);
                  setTimeFilter('all');
                }}
                className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs"
              >
                {isAr ? 'عرض جميع الرحلات' : 'Show All Flights'}
              </button>
            </div>
          )}

          {/* Flight Card List */}
          {filteredFlights.map((flight) => {
            const isExpanded = expandedFlightId === flight.id;
            const outboundDepTime = flight.outbound.departureTime.split('T')[1].substring(0, 5);
            const outboundArrTime = flight.outbound.arrivalTime.split('T')[1].substring(0, 5);

            return (
              <div
                key={flight.id}
                id={`flight-card-${flight.id}`}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl border border-slate-200/90 transition-all overflow-hidden"
              >
                {/* Flight Main Row */}
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    {/* Airline & Aircraft */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-xl shadow-sm border border-slate-700">
                        {flight.airline.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-base">
                            {isAr ? flight.airline.nameAr : flight.airline.nameEn}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {flight.flightNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {flight.aircraft} • {flight.terminal}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      {flight.isDirect ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {isAr ? 'رحلة مباشرة' : 'Direct Flight'}
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {isAr ? `توقف 1 في ${flight.outbound.stopAirport?.cityAr}` : '1 Stop'}
                        </span>
                      )}

                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Luggage className="w-3 h-3 text-slate-600" />
                        {isAr ? '23 كجم + يد' : '23kg + Cabin'}
                      </span>
                    </div>
                  </div>

                  {/* Flight Times & Duration Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Outbound Route */}
                    <div className="md:col-span-8 flex items-center justify-between gap-4">
                      {/* Departure */}
                      <div className="text-right">
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                          {outboundDepTime}
                        </p>
                        <p className="text-sm font-bold text-slate-800">{isAr ? searchParams.origin.cityAr : searchParams.origin.cityEn}</p>
                        <p className="text-xs text-slate-400 font-mono">{searchParams.origin.code}</p>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="flex-1 px-4 text-center">
                        <p className="text-[11px] font-bold text-slate-500 mb-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {formatDuration(flight.outbound.durationMinutes, language)}
                        </p>
                        <div className="relative flex items-center justify-center">
                          <div className="w-full h-0.5 bg-slate-200" />
                          <div className="absolute w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
                            <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">
                          {flight.isDirect ? (isAr ? 'بدون توقف' : 'Non-stop') : (isAr ? 'ترانزيت قصير' : 'Short layover')}
                        </p>
                      </div>

                      {/* Arrival */}
                      <div className="text-left">
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                          {outboundArrTime}
                        </p>
                        <p className="text-sm font-bold text-slate-800">{isAr ? searchParams.destination.cityAr : searchParams.destination.cityEn}</p>
                        <p className="text-xs text-slate-400 font-mono">{searchParams.destination.code}</p>
                      </div>
                    </div>

                    {/* Price & Action CTA */}
                    <div className="md:col-span-4 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-r md:border-slate-100 pt-3 md:pt-0 md:pr-4">
                      <div>
                        <p className="text-[11px] text-slate-400 font-semibold">{isAr ? 'السعر للشخص ابتداءً من' : 'Price per person from'}</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900">
                          {formatPrice(flight.basePriceEgp, currency, language)}
                        </p>
                        <p className="text-[10px] text-slate-400">{isAr ? 'شامل الضرائب والرسوم' : 'Taxes & fees included'}</p>
                      </div>

                      <button
                        type="button"
                        id={`expand-fares-btn-${flight.id}`}
                        onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                        className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                      >
                        <span>{isExpanded ? (isAr ? 'إخفاء الفئات' : 'Hide Fares') : (isAr ? 'اختر فئة السعر' : 'Select Fare')}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Fare Tier Cards Accordion */}
                {isExpanded && (
                  <div className="bg-slate-50/90 border-t border-slate-200 p-5 sm:p-6 animate-in slide-in-from-top-3 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>{isAr ? 'اختر باقة السعر المناسبة لاحتياجاتك' : 'Choose Your Preferred Fare Class'}</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isAr ? 'جميع الباقات تشمل الوجبة والمشروبات الترحيبية على متن الطائرة' : 'All fares include onboard complimentary meals & drinks'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {flight.fareOptions.map((fare) => {
                        const totalFarePrice = flight.basePriceEgp + fare.priceDelta;
                        const isStandard = fare.id === 'eco_standard';

                        return (
                          <div
                            key={fare.id}
                            id={`fare-tier-${fare.id}`}
                            className={`relative bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                              isStandard
                                ? 'border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {isStandard && (
                              <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                {isAr ? 'الأكثر اختياراً' : 'Most Popular'}
                              </span>
                            )}

                            <div>
                              <div className="border-b border-slate-100 pb-3">
                                <h5 className="font-black text-slate-900 text-sm">
                                  {isAr ? fare.nameAr : fare.nameEn}
                                </h5>
                                <p className="text-xl font-black text-slate-900 mt-1">
                                  {formatPrice(totalFarePrice, currency, language)}
                                </p>
                              </div>

                              <ul className="space-y-2 text-xs text-slate-600 my-4">
                                <li className="flex items-start gap-1.5 font-semibold text-slate-800">
                                  <Luggage className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{fare.baggageChecked}</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <Luggage className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  <span>{fare.baggageCabin}</span>
                                </li>
                                {fare.features.map((feat, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              type="button"
                              id={`select-fare-${flight.id}-${fare.id}`}
                              onClick={() => onSelectFlight(flight, fare)}
                              className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                                isStandard
                                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white'
                              }`}
                            >
                              <span>{isAr ? 'متابعة الحجز' : 'Select'}</span>
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
};
