import React, { useState } from 'react';
import { 
  Ticket, Search, CheckCircle, Clock, XCircle, Plane, Armchair, 
  Printer, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { BookingRecord, Currency, Language } from '../types';
import { formatPrice, formatDateArabic } from '../utils/formatters';
import { updateBookingStatus } from '../utils/storage';

interface ManageBookingsProps {
  bookings: BookingRecord[];
  onRefresh: () => void;
  onViewConfirmation: (booking: BookingRecord) => void;
  onBookFlight: () => void;
  currency: Currency;
  language: Language;
}

export const ManageBookings: React.FC<ManageBookingsProps> = ({
  bookings,
  onRefresh,
  onViewConfirmation,
  onBookFlight,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  const [searchPnr, setSearchPnr] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<BookingRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const pnrClean = searchPnr.trim().toUpperCase();

    const found = bookings.find(b => b.pnr === pnrClean);
    setSearchedBooking(found || null);
  };

  const handleCheckIn = (pnr: string) => {
    updateBookingStatus(pnr, 'checked_in');
    onRefresh();
    alert(isAr ? 'تم إتمام إجراءات السفر بنجاح (Online Check-in) وتفعيل بطاقة الصعود!' : 'Online check-in completed successfully!');
  };

  const handleCancelBooking = (pnr: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?')) {
      updateBookingStatus(pnr, 'cancelled');
      onRefresh();
      alert(isAr ? 'تم إلغاء الحجز وجارٍ تحويل المبلغ المسترد إلى وسيلة الدفع.' : 'Booking cancelled. Refund is in process.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
          {isAr ? 'إدارة الحجوزات وإتمام إجراءات السفر' : 'Manage Bookings & Online Check-in'}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
          {isAr
            ? 'ابحث برقم الحجز (PNR) واسم العائلة لإتمام إجراءات السفر إلكترونياً، وتغيير المقعد، وطباعة التذكرة.'
            : 'Look up your booking by PNR to check in online, select seats, or print boarding passes.'}
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {isAr ? 'رقم الحجز المرجعي (PNR)' : 'Booking Reference (PNR)'}
            </label>
            <input
              type="text"
              id="manage-pnr-input"
              value={searchPnr}
              onChange={(e) => setSearchPnr(e.target.value)}
              placeholder="e.g. EG89FA"
              required
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm font-bold font-mono uppercase text-slate-900 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {isAr ? 'اسم العائلة (اللقب)' : 'Last Name'}
            </label>
            <input
              type="text"
              id="manage-lastname-input"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              placeholder={isAr ? 'مثال: محمد' : 'e.g. Mohamed'}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              id="search-booking-pnr-btn"
              className="w-full bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-black p-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>{isAr ? 'بحث عن الحجز' : 'Find Trip'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Searched Booking Result */}
      {hasSearched && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">
            {isAr ? 'نتيجة البحث:' : 'Search Result:'}
          </h3>

          {searchedBooking ? (
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-500 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center text-2xl">
                    {searchedBooking.flight.airline.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-slate-900">{searchedBooking.flight.airline.nameAr}</span>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">{searchedBooking.pnr}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {searchedBooking.flight.flightNumber} • {searchedBooking.flight.terminal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {searchedBooking.status === 'checked_in' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isAr ? 'تم إتمام إجراءات السفر (Checked-In)' : 'Checked In'}
                    </span>
                  ) : searchedBooking.status === 'cancelled' ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {isAr ? 'حجز ملغي' : 'Cancelled'}
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {isAr ? 'حجز مؤكد - في انتظار موعد السفر' : 'Confirmed'}
                    </span>
                  )}
                </div>
              </div>

              {/* Route & Times */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xl font-black text-slate-900">{searchedBooking.searchParams.origin.cityAr}</p>
                  <p className="text-xs text-slate-400 font-mono">{searchedBooking.searchParams.origin.code}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-amber-600">{formatDateArabic(searchedBooking.searchParams.departureDate)}</p>
                  <Plane className="w-5 h-5 text-slate-900 mx-auto transform -rotate-45 my-1" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-slate-900">{searchedBooking.searchParams.destination.cityAr}</p>
                  <p className="text-xs text-slate-400 font-mono">{searchedBooking.searchParams.destination.code}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewConfirmation(searchedBooking)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'عرض وطباعة بطاقة الصعود' : 'View Boarding Pass'}</span>
                </button>

                {searchedBooking.status !== 'checked_in' && searchedBooking.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => handleCheckIn(searchedBooking.pnr)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isAr ? 'إتمام إجراءات السفر إلكترونياً (Online Check-in)' : 'Online Check-in'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                {isAr ? `لم يتم العثور على حجز برقم ${searchPnr}` : `No booking found for PNR ${searchPnr}`}
              </p>
              <p className="text-xs text-slate-500">
                {isAr ? 'تأكد من كتابة كود الحجز بشكل صحيح (مثل: EG89FA).' : 'Please verify the booking code.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* List of All Saved / Active Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-600" />
            <span>{isAr ? 'سجل رحلاتي وحجوزاتي المحفوظة' : 'My Saved Bookings'}</span>
          </h3>

          <span className="text-xs font-bold text-slate-500">
            {bookings.length} {isAr ? 'حجوزات مسجلة' : 'records'}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-slate-200 space-y-4">
            <Plane className="w-12 h-12 text-slate-300 mx-auto transform -rotate-45" />
            <h4 className="font-bold text-slate-800 text-base">
              {isAr ? 'لا توجد حجوزات سابقة محفوظة بعد' : 'No bookings saved yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isAr ? 'ابدأ بالبحث عن رحلتك القادمة إلى شرم الشيخ، الغردقة، الأقصر، أو جدة ودبي.' : 'Search for flights across Egyptian and international destinations.'}
            </p>
            <button
              type="button"
              onClick={onBookFlight}
              className="bg-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md"
            >
              {isAr ? 'احجز رحلتك الآن' : 'Book a Flight Now'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div
                key={b.pnr}
                id={`saved-booking-${b.pnr}`}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.flight.airline.logo}</span>
                    <span className="font-bold text-sm text-slate-900">{b.flight.airline.nameAr}</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-amber-600">{b.pnr}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === 'checked_in' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {b.status === 'checked_in' ? (isAr ? 'تم إتمام السفر' : 'Checked In') : (isAr ? 'مؤكد' : 'Confirmed')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">{b.searchParams.origin.cityAr}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.searchParams.origin.code}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-slate-500">{formatDateArabic(b.searchParams.departureDate)}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.flight.flightNumber}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900">{b.searchParams.destination.cityAr}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.searchParams.destination.code}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-900">
                    {formatPrice(b.totalPriceEgp, currency, language)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewConfirmation(b)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      {isAr ? 'عرض التذكرة' : 'View Pass'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
