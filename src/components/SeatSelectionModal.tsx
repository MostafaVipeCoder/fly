import React, { useState } from 'react';
import { Plane, Check, X, Users, Sparkles, AlertCircle } from 'lucide-react';
import { Currency, Flight, Language, PassengerInfo, Seat } from '../types';
import { formatPrice } from '../utils/formatters';

interface SeatSelectionModalProps {
  flight: Flight;
  passengers: PassengerInfo[];
  onSaveSeats: (updatedPassengers: PassengerInfo[]) => void;
  onClose: () => void;
  currency: Currency;
  language: Language;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  flight,
  passengers,
  onSaveSeats,
  onClose,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  const [activePassengerIdx, setActivePassengerIdx] = useState<number>(0);
  const [passengerSeats, setPassengerSeats] = useState<{ [id: string]: string }>(() => {
    const map: { [id: string]: string } = {};
    passengers.forEach(p => {
      if (p.seatOutbound) map[p.id] = p.seatOutbound;
    });
    return map;
  });

  // Generate aircraft seat grid (20 rows)
  const rows = 18;
  const businessRows = 3;
  const exitRows = [10, 11];

  const occupiedSeats = new Set(['1A', '2D', '4B', '5E', '7A', '8C', '10F', '12B', '14A', '15E', '16F']);

  const handleSeatClick = (seatId: string, isOccupied: boolean) => {
    if (isOccupied) return;

    const currentPassenger = passengers[activePassengerIdx];
    if (!currentPassenger) return;

    // If seat already assigned to another passenger in this booking, remove it from them
    const newSeats = { ...passengerSeats };
    Object.keys(newSeats).forEach(pId => {
      if (newSeats[pId] === seatId) {
        delete newSeats[pId];
      }
    });

    newSeats[currentPassenger.id] = seatId;
    setPassengerSeats(newSeats);

    // Auto-advance to next passenger if more exist
    if (activePassengerIdx < passengers.length - 1) {
      setActivePassengerIdx(activePassengerIdx + 1);
    }
  };

  const handleConfirm = () => {
    const updated = passengers.map(p => ({
      ...p,
      seatOutbound: passengerSeats[p.id] || '12A', // default if not chosen
    }));
    onSaveSeats(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                {isAr ? 'خريطة مقاعد الطائرة التفاعلية' : 'Interactive Seat Selection'}
              </h3>
              <p className="text-xs text-slate-400">
                {flight.airline.nameAr} • {flight.flightNumber} • {flight.aircraft}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passenger selection tabs */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {isAr ? 'المسافر النشط:' : 'Select for:'}
          </span>
          {passengers.map((p, idx) => {
            const assigned = passengerSeats[p.id];
            const isActive = idx === activePassengerIdx;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePassengerIdx(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{p.firstName || `${isAr ? 'مسافر' : 'Passenger'} ${idx + 1}`}</span>
                {assigned ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-mono font-black">
                    {assigned}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-600">
                    {isAr ? 'لم يحدد' : 'Not set'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300" />
            <span>{isAr ? 'متاح (قياسي)' : 'Available'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-500 border border-amber-600 text-slate-950 flex items-center justify-center text-[9px] font-black">✓</div>
            <span>{isAr ? 'مقعدك المختار' : 'Selected'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-400 opacity-40 cursor-not-allowed" />
            <span>{isAr ? 'محجوز' : 'Occupied'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400 text-emerald-800" />
            <span>{isAr ? 'مساحة إضافية للأرجل' : 'Extra Legroom'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-400 text-purple-800" />
            <span>{isAr ? 'درجة رجال الأعمال' : 'Business Class'}</span>
          </div>
        </div>

        {/* Cabin Visualizer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div className="relative w-full max-w-md bg-white rounded-t-[100px] rounded-b-3xl border-4 border-slate-300 shadow-inner p-6 pt-12 pb-8 space-y-4">
            
            {/* Cockpit Indicator */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
                <Plane className="w-3.5 h-3.5" />
                <span>{isAr ? 'مقصورة القيادة / مقدمة الطائرة' : 'Cockpit / Front'}</span>
              </div>
            </div>

            {/* Business Class Section */}
            <div className="space-y-2 border-b-2 border-dashed border-purple-300 pb-4">
              <div className="text-center text-[11px] font-bold text-purple-800 bg-purple-50 py-0.5 rounded">
                👑 {isAr ? 'درجة رجال الأعمال الفاخرة' : 'Business Class'}
              </div>
              {Array.from({ length: businessRows }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                const cols = ['A', 'C', 'D', 'F'];

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-2">
                    <span className="w-5 text-[10px] font-mono font-bold text-slate-400 text-center">{rowNum}</span>
                    
                    {/* Left seats A & C */}
                    <div className="flex gap-2">
                      {['A', 'C'].map(col => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelectedByActive = passengerSeats[passengers[activePassengerIdx]?.id] === seatId;
                        const isSelectedByAny = Object.values(passengerSeats).includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId, isOccupied)}
                            className={`w-10 h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                              isSelectedByActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600 scale-105 shadow-md'
                                : isSelectedByAny
                                ? 'bg-amber-300 text-slate-900'
                                : isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300'
                            }`}
                          >
                            <span className="text-[10px]">{col}</span>
                            {isSelectedByActive ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 text-center text-[9px] text-slate-400 font-mono">
                      {isAr ? 'ممر' : 'Aisle'}
                    </div>

                    {/* Right seats D & F */}
                    <div className="flex gap-2">
                      {['D', 'F'].map(col => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelectedByActive = passengerSeats[passengers[activePassengerIdx]?.id] === seatId;
                        const isSelectedByAny = Object.values(passengerSeats).includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId, isOccupied)}
                            className={`w-10 h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                              isSelectedByActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600 scale-105 shadow-md'
                                : isSelectedByAny
                                ? 'bg-amber-300 text-slate-900'
                                : isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300'
                            }`}
                          >
                            <span className="text-[10px]">{col}</span>
                            {isSelectedByActive ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Economy Class Section */}
            <div className="space-y-2">
              <div className="text-center text-[11px] font-bold text-slate-700 bg-slate-100 py-0.5 rounded">
                💺 {isAr ? 'الدرجة السياحية (Economy)' : 'Economy Class'}
              </div>

              {Array.from({ length: rows - businessRows }).map((_, rIdx) => {
                const rowNum = rIdx + businessRows + 1;
                const isExit = exitRows.includes(rowNum);

                return (
                  <div key={rowNum} className={`flex items-center justify-between gap-1.5 ${isExit ? 'my-3 p-1 bg-emerald-50 rounded-xl border border-emerald-200' : ''}`}>
                    <span className="w-5 text-[10px] font-mono font-bold text-slate-400 text-center">{rowNum}</span>
                    
                    {/* Left seats A, B, C */}
                    <div className="flex gap-1.5">
                      {['A', 'B', 'C'].map(col => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelectedByActive = passengerSeats[passengers[activePassengerIdx]?.id] === seatId;
                        const isSelectedByAny = Object.values(passengerSeats).includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId, isOccupied)}
                            className={`w-8 h-9 rounded-lg font-bold text-xs flex flex-col items-center justify-center transition-all ${
                              isSelectedByActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600 scale-105 shadow-md'
                                : isSelectedByAny
                                ? 'bg-amber-300 text-slate-900'
                                : isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                : isExit
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            <span className="text-[9px]">{col}</span>
                            {isSelectedByActive && <span className="text-[8px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="w-4 text-center text-[8px] text-slate-300 font-mono">
                      |
                    </div>

                    {/* Right seats D, E, F */}
                    <div className="flex gap-1.5">
                      {['D', 'E', 'F'].map(col => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelectedByActive = passengerSeats[passengers[activePassengerIdx]?.id] === seatId;
                        const isSelectedByAny = Object.values(passengerSeats).includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId, isOccupied)}
                            className={`w-8 h-9 rounded-lg font-bold text-xs flex flex-col items-center justify-center transition-all ${
                              isSelectedByActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600 scale-105 shadow-md'
                                : isSelectedByAny
                                ? 'bg-amber-300 text-slate-900'
                                : isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                : isExit
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            <span className="text-[9px]">{col}</span>
                            {isSelectedByActive && <span className="text-[8px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? 'المقاعد المختارة حالياً:' : 'Selected Seats:'}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {passengers.map((p) => (
                <span key={p.id} className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                  {p.firstName || p.id}: <span className="text-amber-600 font-mono font-black">{passengerSeats[p.id] || (isAr ? 'تلقائي' : 'Auto')}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              id="confirm-seats-btn"
              onClick={handleConfirm}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              {isAr ? 'تأكيد المقاعد والمتابعة' : 'Confirm Seats & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
