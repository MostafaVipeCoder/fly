import React, { useState } from 'react';
import { 
  CreditCard, Smartphone, Zap, Building2, CheckCircle2, ShieldCheck, 
  ArrowLeft, ArrowRight, Copy, Check, Clock, AlertTriangle, Lock 
} from 'lucide-react';
import { AddonServices, BookingRecord, Currency, FareOption, Flight, Language, PassengerInfo, PaymentMethod, SearchParams } from '../types';
import { formatPrice, generatePNR, generateETicketNumber } from '../utils/formatters';

interface PaymentStepProps {
  flight: Flight;
  selectedFare: FareOption;
  searchParams: SearchParams;
  passengers: PassengerInfo[];
  addons: AddonServices;
  contact: { email: string; phone: string };
  onPaymentSuccess: (booking: BookingRecord) => void;
  onBack: () => void;
  currency: Currency;
  language: Language;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  flight,
  selectedFare,
  searchParams,
  passengers,
  addons,
  contact,
  onPaymentSuccess,
  onBack,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('fawry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('5078 •••• •••• 4291');
  const [cardHolder, setCardHolder] = useState('AHMED MOHAMED');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('389');

  // Wallet phone number
  const [walletPhone, setWalletPhone] = useState(contact.phone || '01012345678');

  // ValU installment months
  const [valuMonths, setValuMonths] = useState<number>(6);

  // Calculate grand total
  const baseTicketTotal = (flight.basePriceEgp + selectedFare.priceDelta) * searchParams.adults
    + (flight.basePriceEgp + selectedFare.priceDelta) * 0.75 * searchParams.children
    + (flight.basePriceEgp + selectedFare.priceDelta) * 0.10 * searchParams.infants;

  const extraBaggageTotal = passengers.reduce((sum, p) => sum + (p.extraBaggageCount * 450), 0);
  const insurancePrice = addons.travelInsurance ? 250 * passengers.length : 0;
  const fastTrackPrice = addons.cairoFastTrack ? 450 * passengers.length : 0;
  const transferPrice = addons.airportTransfer ? 350 : 0;
  const smsPrice = addons.smsNotification ? 35 : 0;

  const grandTotalEgp = baseTicketTotal + extraBaggageTotal + insurancePrice + fastTrackPrice + transferPrice + smsPrice;

  // Generated Fawry Ref
  const fawryCode = '78942103';

  const handleCopyFawry = () => {
    navigator.clipboard.writeText(fawryCode);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const pnr = generatePNR();
      const gates = ['G12', 'G14', 'E08', 'F04', 'D10'];
      const randomGate = gates[Math.floor(Math.random() * gates.length)];

      const eTickets = passengers.map((p, idx) => ({
        ticketNumber: generateETicketNumber(),
        passengerId: p.id,
        passengerName: `${p.title} ${p.firstName} ${p.lastName}`.toUpperCase(),
        flightNumber: flight.flightNumber,
        seat: p.seatOutbound || `${12 + idx}A`,
        gate: randomGate,
        terminal: flight.terminal,
        boardingTime: flight.outbound.departureTime,
        qrData: `PNR:${pnr}|FLIGHT:${flight.flightNumber}|SEAT:${p.seatOutbound || '12A'}|DATE:${flight.outbound.departureTime}`,
      }));

      const newBooking: BookingRecord = {
        pnr,
        bookingDate: new Date().toISOString(),
        flight,
        selectedFare,
        searchParams,
        passengers,
        addons,
        contactEmail: contact.email,
        contactPhone: contact.phone,
        totalPriceEgp: grandTotalEgp,
        currencyPaid: currency,
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === 'fawry' ? 'pending_fawry' : 'confirmed',
        fawryRefNumber: selectedMethod === 'fawry' ? fawryCode : undefined,
        fawryExpiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        eTickets,
      };

      setIsProcessing(false);
      onPaymentSuccess(newBooking);
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{isAr ? 'الرجوع إلى بيانات المسافرين' : 'Back to Passenger Details'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-mono">3 / 3</span>
          <span>{isAr ? 'الدفع وتأكيد الحجز الفوري' : 'Payment & Instant Confirmation'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment Gateways Selection */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>{isAr ? 'اختر وسيلة الدفع المناسبة لك في مصر' : 'Select Egyptian Payment Gateway'}</span>
            </h3>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* Fawry */}
              <button
                type="button"
                id="pay-method-fawry"
                onClick={() => setSelectedMethod('fawry')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'fawry'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🟡</span>
                  {selectedMethod === 'fawry' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'فوري (Fawry)' : 'Fawry Pay'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'كود دفع بجميع المنافذ' : 'Pay at any kiosk'}</p>
                </div>
              </button>

              {/* InstaPay */}
              <button
                type="button"
                id="pay-method-instapay"
                onClick={() => setSelectedMethod('instapay')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'instapay'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚡</span>
                  {selectedMethod === 'instapay' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'انستاباي (InstaPay)' : 'InstaPay'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'تحويل بنكي لحظي فوري' : 'Instant Bank Transfer'}</p>
                </div>
              </button>

              {/* Mobile Wallets: Vodafone Cash */}
              <button
                type="button"
                id="pay-method-vodafone"
                onClick={() => setSelectedMethod('vodafone_cash')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'vodafone_cash'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📱</span>
                  {selectedMethod === 'vodafone_cash' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'فودافون كاش ومحافظ مصر' : 'Mobile Wallets'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'أورانج / اتصالات / وي' : 'Vodafone / Orange Cash'}</p>
                </div>
              </button>

              {/* Meeza Card */}
              <button
                type="button"
                id="pay-method-meeza"
                onClick={() => setSelectedMethod('meeza')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'meeza'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💳</span>
                  {selectedMethod === 'meeza' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'كارت ميزة الوطني' : 'Meeza Card'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'البطاقة الوطنية المصرية' : 'Egypt National Card'}</p>
                </div>
              </button>

              {/* Visa / MasterCard */}
              <button
                type="button"
                id="pay-method-card"
                onClick={() => setSelectedMethod('card')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌐</span>
                  {selectedMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'فيزا / ماستركارد' : 'Visa / MasterCard'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'دولي ومحلي 3D Secure' : 'Credit / Debit Cards'}</p>
                </div>
              </button>

              {/* ValU */}
              <button
                type="button"
                id="pay-method-valu"
                onClick={() => setSelectedMethod('valu')}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  selectedMethod === 'valu'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💎</span>
                  {selectedMethod === 'valu' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="mt-3">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{isAr ? 'تقسيط فاليو (valU)' : 'valU Installments'}</p>
                  <p className="text-[10px] text-slate-500">{isAr ? 'قسط على حتى 24 شهر' : 'Up to 24 Months'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Method Details Box */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            
            {/* Fawry View */}
            {selectedMethod === 'fawry' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <Clock className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-semibold">
                    {isAr
                      ? 'سيتم حجز مقاعدك مؤقتاً لمدة 24 ساعة حتى سداد المبلغ في أي منفذ فوري أو عبر تطبيق myFawry.'
                      : 'Seats are reserved for 24 hours. Complete payment at any Fawry point or myFawry app.'}
                  </p>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 text-center space-y-3">
                  <p className="text-xs text-amber-300 font-bold">{isAr ? 'كود الدفع المرجعي لفوري (Fawry Pay Code):' : 'Fawry Payment Reference Code:'}</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400 tracking-widest">{fawryCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyFawry}
                      className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-200 transition-colors"
                    >
                      {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedText ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'كود الخدمة في ماكينات فوري: 788 (مدفوعات الطيران والسياحة)' : 'Fawry Service Code: 788'}
                  </p>
                </div>
              </div>
            )}

            {/* InstaPay View */}
            {selectedMethod === 'instapay' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'التحويل الفوري عبر شبكة انستاباي (InstaPay IPA)' : 'Instant Transfer via InstaPay'}</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    {isAr
                      ? 'قم بالتحويل إلى العنوان اللحظي الموحد لحساب شركة الطيران وتأكيد العملية فورياً:'
                      : 'Transfer instantly to the official flight booking address:'}
                  </p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-300 font-mono font-bold text-xs sm:text-sm text-slate-900">
                    <span>egyptwings.flight@instapay</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('egyptwings.flight@instapay');
                        alert(isAr ? 'تم نسخ عنوان انستاباي' : 'InstaPay address copied');
                      }}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs px-2.5 py-1 rounded-lg"
                    >
                      {isAr ? 'نسخ العنوان' : 'Copy IPA'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vodafone Cash & Wallets */}
            {selectedMethod === 'vodafone_cash' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {isAr ? 'رقم محفظة فودافون كاش / أورانج كاش / اتصالات كاش' : 'Mobile Wallet Number'}
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="font-mono font-bold text-xs text-slate-500">🇪🇬 +20</span>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="01012345678"
                      className="bg-transparent w-full text-xs font-bold font-mono text-slate-900 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {isAr ? 'ستصلك رسالة تأكيد على هاتفك لطلب إدخال الرقم السري للمحفظة وإتمام الخصم مباشرة.' : 'A USSD prompt will be sent to your phone to authorize payment with PIN.'}
                </p>
              </div>
            )}

            {/* Card & Meeza Forms */}
            {(selectedMethod === 'card' || selectedMethod === 'meeza') && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {selectedMethod === 'meeza' ? (isAr ? 'رقم كارت ميزة (16 رقم)' : 'Meeza Card Number') : (isAr ? 'رقم بطاقة الائتمان / الخصم' : 'Card Number')}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'الاسم على البطاقة' : 'Cardholder Name'}
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      maxLength={4}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ValU Installments */}
            {selectedMethod === 'valu' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-slate-600 font-medium">
                  {isAr ? 'اختر خطة التقسيط المناسبة لك بدون مقدم عبر تطبيق فاليو (valU):' : 'Choose your installment plan with 0 down payment:'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((m) => {
                    const monthly = Math.round(grandTotalEgp / m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setValuMonths(m)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          valuMonths === m
                            ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <p className="text-xs font-bold">{m} {isAr ? 'أشهر' : 'Months'}</p>
                        <p className="text-sm font-black text-amber-700 mt-1">{formatPrice(monthly, currency, language)} / {isAr ? 'شهر' : 'mo'}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price & Confirmation Card */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
            <h4 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3">
              {isAr ? 'تأكيد الحجز النهائي' : 'Booking Confirmation'}
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{isAr ? 'الوجهة:' : 'Route:'}</span>
                <span className="font-bold text-slate-900">{searchParams.origin.cityAr} ⇄ {searchParams.destination.cityAr}</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'الرحلة:' : 'Flight:'}</span>
                <span className="font-bold text-slate-900">{flight.flightNumber} ({flight.airline.nameAr})</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'عدد المسافرين:' : 'Travelers:'}</span>
                <span className="font-bold text-slate-900">{passengers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'الفئة المختارة:' : 'Fare:'}</span>
                <span className="font-bold text-slate-900">{selectedFare.nameAr}</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-1 text-center">
              <p className="text-xs text-amber-400 font-bold">{isAr ? 'المبلغ المطلوب سداده:' : 'Total Amount Due:'}</p>
              <p className="text-3xl font-black font-mono text-white">
                {formatPrice(grandTotalEgp, currency, language)}
              </p>
            </div>

            <button
              type="button"
              id="confirm-booking-btn"
              disabled={isProcessing}
              onClick={handleCompletePayment}
              className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/20 text-base flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جارٍ تأكيد وإصدار التذاكر...' : 'Confirming & Issuing Tickets...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>{isAr ? 'إتمام الحجز وإصدار بطاقة الصعود' : 'Complete & Issue Boarding Pass'}</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'ضمان استرجاع وإصدار فوري معتمد' : 'Guaranteed Instant Ticket Delivery'}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
