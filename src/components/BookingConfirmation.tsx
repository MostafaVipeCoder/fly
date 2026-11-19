import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Plane, Download, Printer, Share2, Copy, Check, 
  Ticket, Calendar, Clock, MapPin, QrCode, ShieldCheck, ArrowLeft, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingRecord, Currency, Language } from '../types';
import { formatPrice, formatDateArabic } from '../utils/formatters';

interface BookingConfirmationProps {
  booking: BookingRecord;
  onBookAnother: () => void;
  onManageBooking: () => void;
  currency: Currency;
  language: Language;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onBookAnother,
  onManageBooking,
  currency,
  language,
}) => {
  const isAr = language === 'ar';
  const [copiedPnr, setCopiedPnr] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#0284c7', '#d97706'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopyPnr = () => {
    navigator.clipboard.writeText(booking.pnr);
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const primaryTicket = booking.eTickets[0];
  const flight = booking.flight;
  const depTime = flight.outbound.departureTime.split('T')[1].substring(0, 5);
  const arrTime = flight.outbound.arrivalTime.split('T')[1].substring(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success Hero Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-500/30 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {isAr ? 'تم تأكيد الحجز وإصدار التذاكر بنجاح' : 'Booking Confirmed & Issued Successfully'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white pt-2">
            {isAr ? 'رحلة سعيدة وموفقة بإذن الله!' : 'Have a Safe & Wonderful Flight!'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            {isAr
              ? `تم إرسال نسخة إلكترونية كاملة من التذكرة والإيصال إلى ${booking.contactEmail}`
              : `A copy of your e-ticket has been dispatched to ${booking.contactEmail}`}
          </p>
        </div>

        {/* PNR Box */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 mt-2">
          <div className="text-right">
            <p className="text-[11px] text-slate-300 font-semibold">{isAr ? 'رقم الحجز المرجعي (PNR):' : 'Booking Reference (PNR):'}</p>
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-widest">{booking.pnr}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyPnr}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedPnr ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPnr ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy')}</span>
          </button>
        </div>

        {/* Fawry Payment code alert if chosen */}
        {booking.paymentMethod === 'fawry' && booking.fawryRefNumber && (
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-4 text-amber-200 text-xs max-w-lg mx-auto space-y-1">
            <p className="font-bold text-amber-300 text-sm">
              🟡 {isAr ? `كود فوري للسداد: ${booking.fawryRefNumber}` : `Fawry Code: ${booking.fawryRefNumber}`}
            </p>
            <p className="text-[11px] text-amber-100/90">
              {isAr ? 'يرجى سداد المبلغ في أقرب منفذ فوري قبل مرور 24 ساعة لتجنب إلغاء المقاعد.' : 'Please pay at any Fawry kiosk within 24h.'}
            </p>
          </div>
        )}
      </div>

      {/* Printable Boarding Passes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-600" />
            <span>{isAr ? 'بطاقات صعود الطائرة الإلكترونية (Boarding Passes)' : 'Official Boarding Passes'}</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="print-ticket-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        {/* Boarding Pass Cards for each Passenger */}
        {booking.eTickets.map((ticket, tIdx) => {
          const passInfo = booking.passengers[tIdx];

          return (
            <div
              key={ticket.ticketNumber}
              id={`boarding-pass-${ticket.ticketNumber}`}
              className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden relative"
            >
              {/* Airline Top Banner */}
              <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-amber-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold">
                    {flight.airline.logo}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">
                      {isAr ? flight.airline.nameAr : flight.airline.nameEn}
                    </h4>
                    <p className="text-xs text-amber-400 font-mono">
                      {isAr ? 'بطاقة صعود الطائرة الإلكترونية' : 'Electronic Boarding Pass'} • {ticket.terminal}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{isAr ? 'رقم التذكرة الإلكترونية' : 'E-Ticket No.'}</span>
                  <span className="font-mono text-xs font-bold text-amber-300">{ticket.ticketNumber}</span>
                </div>
              </div>

              {/* Main Ticket Body with Cut-off Notch Effect */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Flight Data (8 Cols) */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Passenger Name & Class */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'اسم المسافر' : 'Passenger Name'}</p>
                      <p className="text-sm sm:text-base font-black text-slate-900">{ticket.passengerName}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'رقم الرحلة' : 'Flight No'}</p>
                      <p className="text-sm sm:text-base font-black font-mono text-amber-600">{ticket.flightNumber}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'درجة السفر' : 'Class'}</p>
                      <p className="text-sm sm:text-base font-bold text-slate-800">{booking.selectedFare.nameAr.split(' ')[0]}</p>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{depTime}</p>
                      <p className="text-sm font-black text-slate-800">{isAr ? booking.searchParams.origin.cityAr : booking.searchParams.origin.cityEn}</p>
                      <p className="text-xs text-slate-400 font-mono font-bold">{booking.searchParams.origin.code}</p>
                    </div>

                    <div className="flex-1 px-4 text-center">
                      <p className="text-xs font-bold text-slate-400 mb-1">{formatDateArabic(booking.searchParams.departureDate)}</p>
                      <div className="relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-slate-200" />
                        <div className="absolute w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center">
                          <Plane className="w-4 h-4 transform -rotate-45" />
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-600 mt-1">{isAr ? 'مباشرة' : 'Direct'}</p>
                    </div>

                    <div>
                      <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{arrTime}</p>
                      <p className="text-sm font-black text-slate-800">{isAr ? booking.searchParams.destination.cityAr : booking.searchParams.destination.cityEn}</p>
                      <p className="text-xs text-slate-400 font-mono font-bold">{booking.searchParams.destination.code}</p>
                    </div>
                  </div>

                  {/* Boarding Info Strip: Gate, Seat, Boarding Time */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'البوابة (Gate)' : 'Gate'}</p>
                      <p className="text-xl font-black font-mono text-slate-900">{ticket.gate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'المقعد (Seat)' : 'Seat'}</p>
                      <p className="text-xl font-black font-mono text-amber-600">{ticket.seat}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{isAr ? 'وقت الصعود' : 'Boarding'}</p>
                      <p className="text-xl font-black font-mono text-slate-900">{depTime}</p>
                    </div>
                  </div>
                </div>

                {/* Right QR & Barcode Section (4 Cols) */}
                <div className="md:col-span-4 border-t md:border-t-0 md:border-r md:border-dashed md:border-slate-300 pt-6 md:pt-0 md:pr-6 flex flex-col items-center justify-center text-center space-y-4">
                  
                  {/* QR Code Mock Box */}
                  <div className="p-3 bg-slate-900 rounded-2xl shadow-inner text-white flex flex-col items-center">
                    <QrCode className="w-28 h-28 text-amber-400" />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">SCAN AT GATE {ticket.gate}</span>
                  </div>

                  {/* Barcode Strip */}
                  <div className="space-y-1 w-full">
                    <div className="h-10 bg-slate-900 rounded flex items-center justify-center px-4">
                      <div className="w-full h-6 flex justify-between items-center opacity-80">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-white h-full"
                            style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-mono text-[10px] text-slate-500 font-bold tracking-wider">{booking.pnr}-{ticket.seat}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBookAnother}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors"
        >
          <Plane className="w-4 h-4 text-amber-600" />
          <span>{isAr ? 'حجز رحلة جديدة' : 'Book Another Flight'}</span>
        </button>

        <button
          type="button"
          onClick={onManageBooking}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all"
        >
          <Ticket className="w-4 h-4" />
          <span>{isAr ? 'الذهاب إلى صفحة إدارة الحجز' : 'Go to Manage Booking'}</span>
        </button>
      </div>
    </div>
  );
};
