import React, { useState } from 'react';
import { 
  Users, User, Phone, Mail, ShieldCheck, Sparkles, Luggage, 
  Car, Bell, ArrowRight, ArrowLeft, Armchair, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { AddonServices, Currency, FareOption, Flight, Language, PassengerInfo, SearchParams } from '../types';
import { formatPrice } from '../utils/formatters';
import { SeatSelectionModal } from './SeatSelectionModal';

interface PassengerDetailsStepProps {
  flight: Flight;
  selectedFare: FareOption;
  searchParams: SearchParams;
  onProceedToPayment: (
    passengers: PassengerInfo[], 
    addons: AddonServices, 
    contact: { email: string; phone: string }
  ) => void;
  onBack: () => void;
  currency: Currency;
  language: Language;
}

export const PassengerDetailsStep: React.FC<PassengerDetailsStepProps> = ({
  flight,
  selectedFare,
  searchParams,
  onProceedToPayment,
  onBack,
  currency,
  language,
}) => {
  const isAr = language === 'ar';

  // Initialize passengers based on searchParams
  const [passengers, setPassengers] = useState<PassengerInfo[]>(() => {
    const list: PassengerInfo[] = [];
    
    for (let i = 0; i < searchParams.adults; i++) {
      list.push({
        id: `adult_${i + 1}`,
        type: 'adult',
        title: 'Mr',
        firstName: i === 0 ? 'أحمد' : '',
        lastName: i === 0 ? 'محمد' : '',
        nationality: 'Egyptian',
        nationalIdOrPassport: i === 0 ? '29508150102345' : '',
        idType: 'national_id',
        dateOfBirth: '1995-08-15',
        extraBaggageCount: 0,
        mealPreference: 'وجبة عادية حلال (Standard Halal)',
        seatOutbound: i === 0 ? '12A' : `${12 + i}B`,
      });
    }

    for (let i = 0; i < searchParams.children; i++) {
      list.push({
        id: `child_${i + 1}`,
        type: 'child',
        title: 'Mstr',
        firstName: '',
        lastName: '',
        nationality: 'Egyptian',
        nationalIdOrPassport: '',
        idType: 'national_id',
        dateOfBirth: '2016-04-10',
        extraBaggageCount: 0,
        mealPreference: 'وجبة أطفال (Child Meal)',
        seatOutbound: `${14 + i}C`,
      });
    }

    for (let i = 0; i < searchParams.infants; i++) {
      list.push({
        id: `infant_${i + 1}`,
        type: 'infant',
        title: 'Mstr',
        firstName: '',
        lastName: '',
        nationality: 'Egyptian',
        nationalIdOrPassport: '',
        idType: 'national_id',
        dateOfBirth: '2024-02-20',
        extraBaggageCount: 0,
        mealPreference: 'وجبة رضع (Baby Food)',
        seatOutbound: 'حجر الوالدين (Lap)',
      });
    }

    return list;
  });

  const [contactEmail, setContactEmail] = useState('traveler.eg@gmail.com');
  const [contactPhone, setContactPhone] = useState('01012345678');

  // Addon services
  const [addons, setAddons] = useState<AddonServices>({
    travelInsurance: true,
    cairoFastTrack: false,
    airportTransfer: false,
    smsNotification: true,
  });

  // Seat modal
  const [showSeatModal, setShowSeatModal] = useState(false);

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // Pricing breakdown calculations
  const baseTicketTotal = (flight.basePriceEgp + selectedFare.priceDelta) * searchParams.adults
    + (flight.basePriceEgp + selectedFare.priceDelta) * 0.75 * searchParams.children
    + (flight.basePriceEgp + selectedFare.priceDelta) * 0.10 * searchParams.infants;

  const extraBaggageTotal = passengers.reduce((sum, p) => sum + (p.extraBaggageCount * 450), 0);
  const insurancePrice = addons.travelInsurance ? 250 * passengers.length : 0;
  const fastTrackPrice = addons.cairoFastTrack ? 450 * passengers.length : 0;
  const transferPrice = addons.airportTransfer ? 350 : 0;
  const smsPrice = addons.smsNotification ? 35 : 0;

  const grandTotalEgp = baseTicketTotal + extraBaggageTotal + insurancePrice + fastTrackPrice + transferPrice + smsPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if names filled
    for (const p of passengers) {
      if (!p.firstName.trim() || !p.lastName.trim()) {
        alert(isAr ? 'يرجى إدخال الاسم الأول واسم العائلة لجميع المسافرين' : 'Please fill all passenger names.');
        return;
      }
      if (!p.nationalIdOrPassport.trim()) {
        alert(isAr ? 'يرجى إدخال الرقم القومي أو رقم جواز السفر' : 'Please provide National ID or Passport number.');
        return;
      }
    }

    if (!contactEmail.includes('@') || !contactPhone.trim()) {
      alert(isAr ? 'يرجى إدخال بريد إلكتروني ورقم هاتف صحيح' : 'Please provide a valid contact email and phone.');
      return;
    }

    onProceedToPayment(passengers, addons, { email: contactEmail, phone: contactPhone });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{isAr ? 'الرجوع إلى نتائج البحث' : 'Back to Flight Results'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-mono">2 / 3</span>
          <span>{isAr ? 'بيانات المسافرين والخدمات الإضافية' : 'Passenger Details & Services'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Passenger Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Flight Summary Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                {flight.airline.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-base">
                  <span>{isAr ? flight.airline.nameAr : flight.airline.nameEn}</span>
                  <span className="text-amber-400 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">{flight.flightNumber}</span>
                  <span className="text-xs text-slate-400">• {isAr ? selectedFare.nameAr : selectedFare.nameEn}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {searchParams.origin.cityAr} ({searchParams.origin.code}) ➔ {searchParams.destination.cityAr} ({searchParams.destination.code}) | {flight.outbound.departureTime.split('T')[1].substring(0, 5)} - {flight.outbound.arrivalTime.split('T')[1].substring(0, 5)}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="open-seat-map-btn"
              onClick={() => setShowSeatModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Armchair className="w-4 h-4" />
              <span>{isAr ? 'اختيار مقاعد الطائرة' : 'Choose Seats'}</span>
            </button>
          </div>

          {/* Passenger Cards */}
          {passengers.map((passenger, idx) => {
            const isAdult = passenger.type === 'adult';
            const isChild = passenger.type === 'child';
            const isInfant = passenger.type === 'infant';

            return (
              <div
                key={passenger.id}
                id={`passenger-card-${passenger.id}`}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-black flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {isAdult && (isAr ? `المسافر ${idx + 1} (بالغ)` : `Passenger ${idx + 1} (Adult)`)}
                        {isChild && (isAr ? `المسافر ${idx + 1} (طفل 2-11 سنة)` : `Passenger ${idx + 1} (Child)`)}
                        {isInfant && (isAr ? `المسافر ${idx + 1} (رضيع < سنتين)` : `Passenger ${idx + 1} (Infant)`)}
                      </h4>
                    </div>
                  </div>

                  {passenger.seatOutbound && (
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl text-xs font-bold text-slate-800">
                      <Armchair className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'المقعد:' : 'Seat:'}</span>
                      <span className="text-amber-600 font-mono font-black">{passenger.seatOutbound}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                  {/* Title */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'اللقب' : 'Title'}
                    </label>
                    <select
                      value={passenger.title}
                      onChange={(e) => updatePassenger(idx, 'title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    >
                      <option value="Mr">{isAr ? 'السيد (Mr)' : 'Mr'}</option>
                      <option value="Mrs">{isAr ? 'السيدة (Mrs)' : 'Mrs'}</option>
                      <option value="Ms">{isAr ? 'الآنسة (Ms)' : 'Ms'}</option>
                      <option value="Mstr">{isAr ? 'طفل (Mstr)' : 'Mstr'}</option>
                    </select>
                  </div>

                  {/* First Name */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'الاسم الأول (كما بالهوية / الجواز)' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(idx, 'firstName', e.target.value)}
                      placeholder={isAr ? 'مثال: أحمد' : 'e.g. Ahmed'}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'اسم العائلة / اللقب' : 'Last / Family Name'}
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(idx, 'lastName', e.target.value)}
                      placeholder={isAr ? 'مثال: الشاذلي' : 'e.g. Elshazly'}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Nationality */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'الجنسية' : 'Nationality'}
                    </label>
                    <select
                      value={passenger.nationality}
                      onChange={(e) => updatePassenger(idx, 'nationality', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    >
                      <option value="Egyptian">🇪🇬 {isAr ? 'مصر (Egyptian)' : 'Egypt'}</option>
                      <option value="Saudi">🇸🇦 {isAr ? 'السعودية (Saudi)' : 'Saudi Arabia'}</option>
                      <option value="Emirati">🇦🇪 {isAr ? 'الإمارات (Emirati)' : 'UAE'}</option>
                      <option value="Kuwaiti">🇰🇼 {isAr ? 'الكويت (Kuwaiti)' : 'Kuwait'}</option>
                      <option value="Other">🌍 {isAr ? 'جنسية أخرى (Other)' : 'Other'}</option>
                    </select>
                  </div>

                  {/* ID Type & Number */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'نوع الوثيقة' : 'Document Type'}
                    </label>
                    <select
                      value={passenger.idType}
                      onChange={(e) => updatePassenger(idx, 'idType', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    >
                      <option value="national_id">{isAr ? 'الرقم القومي المصري (بطاقة)' : 'Egyptian National ID'}</option>
                      <option value="passport">{isAr ? 'جواز السفر (Passport)' : 'Passport'}</option>
                    </select>
                  </div>

                  {/* ID / Passport Number */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {passenger.idType === 'national_id' ? (isAr ? 'الرقم القومي (14 رقم)' : 'National ID') : (isAr ? 'رقم جواز السفر' : 'Passport No')}
                    </label>
                    <input
                      type="text"
                      value={passenger.nationalIdOrPassport}
                      onChange={(e) => updatePassenger(idx, 'nationalIdOrPassport', e.target.value)}
                      placeholder={passenger.idType === 'national_id' ? '29508150102345' : 'A12345678'}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold font-mono text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => updatePassenger(idx, 'dateOfBirth', e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Meal Preference */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {isAr ? 'تفضيل الوجبة على الطائرة' : 'Meal Preference'}
                    </label>
                    <select
                      value={passenger.mealPreference}
                      onChange={(e) => updatePassenger(idx, 'mealPreference', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    >
                      <option value="وجبة عادية حلال (Standard Halal)">{isAr ? 'وجبة عادية حلال مجاناً' : 'Standard Halal'}</option>
                      <option value="وجبة نباتية (Vegetarian)">{isAr ? 'وجبة نباتية' : 'Vegetarian'}</option>
                      <option value="وجبة خالية من الغلوتين (Gluten Free)">{isAr ? 'خالية من الغلوتين' : 'Gluten Free'}</option>
                      <option value="وجبة لمرضى السكري (Diabetic)">{isAr ? 'لمرضى السكري' : 'Diabetic Meal'}</option>
                      <option value="وجبة أطفال (Child Meal)">{isAr ? 'وجبة أطفال خاصة' : 'Child Meal'}</option>
                    </select>
                  </div>

                  {/* Extra Baggage counter */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>{isAr ? 'حقيبة إضافية 23 كجم (+450 ج.م)' : 'Extra 23kg Bag'}</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <span className="text-xs font-bold text-slate-800">
                        {passenger.extraBaggageCount} {isAr ? 'حقيبة' : 'Bags'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={passenger.extraBaggageCount <= 0}
                          onClick={() => updatePassenger(idx, 'extraBaggageCount', Math.max(0, passenger.extraBaggageCount - 1))}
                          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-xs disabled:opacity-30"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          disabled={passenger.extraBaggageCount >= 3}
                          onClick={() => updatePassenger(idx, 'extraBaggageCount', passenger.extraBaggageCount + 1)}
                          className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'معلومات التواصل لإرسال التذاكر الإلكترونية' : 'Contact Information for E-Tickets'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  {isAr ? 'البريد الإلكتروني (لاستلام التذكرة PDF)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  id="contact-email-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  {isAr ? 'رقم الهاتف / واتساب المصري' : 'Phone / WhatsApp'}
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-amber-500">
                  <span className="font-mono text-xs font-bold text-slate-500 border-l pl-2">🇪🇬 +20</span>
                  <input
                    type="tel"
                    id="contact-phone-input"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="01012345678"
                    required
                    className="bg-transparent w-full text-xs font-bold font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add-on Services Checklist */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'خدمات إضافية مميزة لراحتك في السفر' : 'Optional Travel Add-ons'}</span>
            </h4>

            <div className="space-y-3">
              {/* Travel Insurance */}
              <label className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.travelInsurance}
                    onChange={(e) => setAddons({ ...addons, travelInsurance: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'تأمين السفر الشامل وحماية الإلغاء الطبي' : 'Comprehensive Travel & Cancellation Insurance'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isAr ? 'تغطية طبية تصل إلى 500,000 ج.م وتعويض فوري عن تأخر الأمتعة أو إلغاء الرحلة' : 'Medical coverage up to 500k EGP + baggage delay protection'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                  {formatPrice(250 * passengers.length, currency, language)}
                </span>
              </label>

              {/* Fast Track Cairo */}
              <label className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.cairoFastTrack}
                    onChange={(e) => setAddons({ ...addons, cairoFastTrack: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'خدمة المسار السريع وصالة كبار الزوار (VIP Lounge)' : 'Cairo Airport Fast Track & Lounge Access'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isAr ? 'إنهاء إجراءات الجوازات والأمتعة بدون انتظار مع بوفيه فاخر بصالة المطار' : 'Priority check-in, fast-track passport control & VIP lounge buffet'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                  {formatPrice(450 * passengers.length, currency, language)}
                </span>
              </label>

              {/* Airport Transfer */}
              <label className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.airportTransfer}
                    onChange={(e) => setAddons({ ...addons, airportTransfer: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-blue-600" />
                      <span>{isAr ? 'سيارة ليموزين خاصة للتوصيل من/إلى المطار' : 'Airport Private Chauffeur Transfer'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isAr ? 'سائق خاص ينتظرك بالاسم أمام صالة الوصول بسيارة حديثة مكيفة' : 'Private driver with name greeting card outside arrival gate'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                  {formatPrice(350, currency, language)}
                </span>
              </label>

              {/* SMS Notifications */}
              <label className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.smsNotification}
                    onChange={(e) => setAddons({ ...addons, smsNotification: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'تنبيهات فورية لتغير البوابة وموعد الصعود عبر SMS وواتساب' : 'Live WhatsApp & SMS Gate Alerts'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isAr ? 'إشعار فوري عند فتح باب الطائرة أو تغيير بوابة الإقلاع في المطار' : 'Instant updates on gate change and boarding call'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                  {formatPrice(35, currency, language)}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Checkout Box */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
            <h4 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3">
              {isAr ? 'ملخص الفاتورة والسعر' : 'Price Summary'}
            </h4>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between font-semibold">
                <span>{isAr ? 'سعر تذاكر الطيران:' : 'Flight Tickets:'}</span>
                <span className="font-mono">{formatPrice(baseTicketTotal, currency, language)}</span>
              </div>

              {extraBaggageTotal > 0 && (
                <div className="flex justify-between">
                  <span>{isAr ? 'أمتعة إضافية (23 كجم):' : 'Extra Baggage:'}</span>
                  <span className="font-mono text-amber-700 font-bold">{formatPrice(extraBaggageTotal, currency, language)}</span>
                </div>
              )}

              {insurancePrice > 0 && (
                <div className="flex justify-between">
                  <span>{isAr ? 'تأمين السفر الشامل:' : 'Travel Insurance:'}</span>
                  <span className="font-mono text-emerald-700 font-bold">{formatPrice(insurancePrice, currency, language)}</span>
                </div>
              )}

              {fastTrackPrice > 0 && (
                <div className="flex justify-between">
                  <span>{isAr ? 'المسار السريع وصالة كبار الزوار:' : 'Fast Track & Lounge:'}</span>
                  <span className="font-mono font-bold">{formatPrice(fastTrackPrice, currency, language)}</span>
                </div>
              )}

              {transferPrice > 0 && (
                <div className="flex justify-between">
                  <span>{isAr ? 'ليموزين المطار:' : 'Airport Transfer:'}</span>
                  <span className="font-mono font-bold">{formatPrice(transferPrice, currency, language)}</span>
                </div>
              )}

              {smsPrice > 0 && (
                <div className="flex justify-between">
                  <span>{isAr ? 'تنبيهات SMS وواتساب:' : 'SMS & WhatsApp Alerts:'}</span>
                  <span className="font-mono font-bold">{formatPrice(smsPrice, currency, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>{isAr ? 'الضرائب ورسوم المطار المصرية:' : 'Airport Taxes & Fees:'}</span>
                <span className="text-emerald-600 font-bold">{isAr ? 'مشمولة بالكامل' : 'Included'}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{isAr ? 'الإجمالي الكلي:' : 'Grand Total:'}</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {formatPrice(grandTotalEgp, currency, language)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="proceed-to-payment-btn"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 text-sm sm:text-base flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isAr ? 'المتابعة لاختيار طريقة الدفع' : 'Proceed to Payment'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center space-y-1">
              <p>🔒 {isAr ? 'حجزك مؤكد ومشفر بأعلى معايير الأمان 256-bit' : '256-bit SSL Secure Booking'}</p>
            </div>
          </div>
        </aside>
      </form>

      {/* Seat Selection Modal */}
      {showSeatModal && (
        <SeatSelectionModal
          flight={flight}
          passengers={passengers}
          onSaveSeats={(updated) => setPassengers(updated)}
          onClose={() => setShowSeatModal(false)}
          currency={currency}
          language={language}
        />
      )}
    </div>
  );
};
