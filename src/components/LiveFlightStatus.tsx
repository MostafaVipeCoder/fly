import React, { useState } from 'react';
import { Activity, Plane, Search, RefreshCw, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Language, LiveFlightInfo } from '../types';
import { MOCK_LIVE_FLIGHTS } from '../data/liveFlights';

interface LiveFlightStatusProps {
  language: Language;
}

export const LiveFlightStatus: React.FC<LiveFlightStatusProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [selectedAirportCode, setSelectedAirportCode] = useState<'CAI' | 'SSH' | 'HRG' | 'HBE'>('CAI');
  const [flightType, setFlightType] = useState<'departure' | 'arrival'>('departure');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filtered = MOCK_LIVE_FLIGHTS.filter(f => {
    if (f.type !== flightType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        f.flightNumber.toLowerCase().includes(term) ||
        f.airline.nameAr.includes(term) ||
        f.airline.nameEn.toLowerCase().includes(term) ||
        f.destination.cityAr.includes(term) ||
        f.origin.cityAr.includes(term)
      );
    }
    return true;
  });

  const airportTabs = [
    { code: 'CAI', nameAr: 'مطار القاهرة الدولي', nameEn: 'Cairo Airport' },
    { code: 'SSH', nameAr: 'مطار شرم الشيخ', nameEn: 'Sharm Airport' },
    { code: 'HRG', nameAr: 'مطار الغردقة', nameEn: 'Hurghada Airport' },
    { code: 'HBE', nameAr: 'مطار برج العرب (الإسكندرية)', nameEn: 'Alexandria Borg El Arab' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAr ? 'رادار حركة الطيران اللحظي والمباشر' : 'Live Flight Radar Board'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
          {isAr ? 'حالة الرحلات المباشرة لمطارات مصر' : 'Live Flight Status for Egyptian Airports'}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
          {isAr
            ? 'تتبع مواعيد الإقلاع والوصول المباشرة، وأرقام البوابات وصالات الركاب في مطار القاهرة والمطارات المصرية.'
            : 'Track real-time flight departures, arrivals, terminal gates, and flight delays across Egypt.'}
        </p>
      </div>

      {/* Main Board Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Top Controls: Airport Switcher + Departure/Arrival Toggle */}
        <div className="bg-slate-900 text-white p-5 space-y-4">
          
          {/* Airport Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {airportTabs.map((a) => (
              <button
                key={a.code}
                type="button"
                onClick={() => setSelectedAirportCode(a.code as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedAirportCode === a.code
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isAr ? a.nameAr : a.nameEn} ({a.code})
              </button>
            ))}
          </div>

          {/* Sub-bar: Type toggle & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="inline-flex p-1 bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setFlightType('departure')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  flightType === 'departure' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                🛫 {isAr ? 'رحلات المغادرة' : 'Departures'}
              </button>
              <button
                type="button"
                onClick={() => setFlightType('arrival')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  flightType === 'arrival' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                🛬 {isAr ? 'رحلات الوصول' : 'Arrivals'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isAr ? 'بحث برقم الرحلة (مثال: MS 780)' : 'Search flight no...'}
                  className="bg-slate-800 text-white placeholder:text-slate-400 text-xs rounded-xl pr-8 pl-3 py-1.5 outline-none focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs transition-colors"
                title={isAr ? 'تحديث البيانات' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Flight Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">{isAr ? 'شركة الطيران والرحلة' : 'Flight & Airline'}</th>
                <th className="p-4">{flightType === 'departure' ? (isAr ? 'الوجهة (إلى)' : 'Destination') : (isAr ? 'القادمة من' : 'Origin')}</th>
                <th className="p-4">{isAr ? 'الموعد المجدول' : 'Sched. Time'}</th>
                <th className="p-4">{isAr ? 'المبنى والصالة' : 'Terminal & Gate'}</th>
                <th className="p-4">{isAr ? 'الحالة المباشرة' : 'Live Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filtered.map((flight, idx) => {
                const isDelayed = flight.status === 'Delayed';
                const isBoarding = flight.status === 'Boarding';
                const isLanded = flight.status === 'Landed';

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flight.airline.logo}</span>
                        <div>
                          <p className="font-mono font-black text-slate-900 text-sm">{flight.flightNumber}</p>
                          <p className="text-[10px] text-slate-400">{isAr ? flight.airline.nameAr : flight.airline.nameEn}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">
                        {flightType === 'departure' ? flight.destination.cityAr : flight.origin.cityAr}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {flightType === 'departure' ? flight.destination.code : flight.origin.code}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-mono font-black text-slate-900 text-sm">{flight.scheduledTime}</p>
                      {isDelayed && (
                        <p className="text-[10px] text-rose-600 font-bold">{isAr ? `المتوقع: ${flight.estimatedTime}` : `Est: ${flight.estimatedTime}`}</p>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{flight.terminal}</p>
                      <p className="text-[10px] font-mono text-amber-600 font-black">Gate: {flight.gate}</p>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                        isDelayed
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isBoarding
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : isLanded
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {flight.statusAr}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
