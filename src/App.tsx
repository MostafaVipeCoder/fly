/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plane, ShieldCheck, Clock, Award, PhoneCall, Sparkles, 
  MapPin, CheckCircle, Ticket, Heart, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { 
  AddonServices, BookingRecord, Currency, FareOption, Flight, 
  Language, PassengerInfo, SearchParams 
} from './types';
import { EGYPT_AIRPORTS, findAirportByCode } from './data/airports';
import { generateFlightsForSearch } from './data/mockFlights';
import { getSavedBookings, saveBooking } from './utils/storage';
import { Header } from './components/Header';
import { FlightSearchForm } from './components/FlightSearchForm';
import { FlightSearchResults } from './components/FlightSearchResults';
import { PassengerDetailsStep } from './components/PassengerDetailsStep';
import { PaymentStep } from './components/PaymentStep';
import { BookingConfirmation } from './components/BookingConfirmation';
import { ManageBookings } from './components/ManageBookings';
import { LiveFlightStatus } from './components/LiveFlightStatus';
import { TravelGuideAndOffers } from './components/TravelGuideAndOffers';
import { AITravelAssistant } from './components/AITravelAssistant';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('EGP');
  const isAr = language === 'ar';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'search' | 'offers' | 'live' | 'manage' | 'assistant'>('search');

  // Booking Flow Steps: 'search_view' -> 'results_view' -> 'passenger_view' -> 'payment_view' -> 'confirmation_view'
  const [bookingStep, setBookingStep] = useState<
    'search_view' | 'results_view' | 'passenger_view' | 'payment_view' | 'confirmation_view'
  >('search_view');

  // Active search state
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);

  // Selection state
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFare, setSelectedFare] = useState<FareOption | null>(null);
  const [confirmedPassengers, setConfirmedPassengers] = useState<PassengerInfo[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<AddonServices>({
    travelInsurance: true,
    cairoFastTrack: false,
    airportTransfer: false,
    smsNotification: true,
  });
  const [contactInfo, setContactInfo] = useState<{ email: string; phone: string }>({
    email: '',
    phone: '',
  });

  // Confirmed booking for viewing confirmation/boarding pass
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null);

  // Saved Bookings in localStorage
  const [savedBookings, setSavedBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    // Synchronize HTML dir attribute
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';

    // Load saved bookings
    setSavedBookings(getSavedBookings());
  }, [language, isAr]);

  const refreshSavedBookings = () => {
    setSavedBookings(getSavedBookings());
  };

  // Handler for user searching flights
  const handleSearchFlights = (params: SearchParams) => {
    setCurrentSearchParams(params);
    const flights = generateFlightsForSearch(params);
    setSearchResults(flights);
    setBookingStep('results_view');
    setActiveTab('search');
  };

  // Handler for selecting a flight and fare tier
  const handleSelectFlightAndFare = (flight: Flight, fare: FareOption) => {
    setSelectedFlight(flight);
    setSelectedFare(fare);
    setBookingStep('passenger_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for passenger details confirmed, move to payment
  const handleProceedToPayment = (
    passengers: PassengerInfo[],
    addons: AddonServices,
    contact: { email: string; phone: string }
  ) => {
    setConfirmedPassengers(passengers);
    setSelectedAddons(addons);
    setContactInfo(contact);
    setBookingStep('payment_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for payment success
  const handlePaymentSuccess = (booking: BookingRecord) => {
    saveBooking(booking);
    refreshSavedBookings();
    setCurrentBooking(booking);
    setBookingStep('confirmation_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for selecting a quick deal from offers or AI assistant
  const handleSelectDeal = (originCode: string, destCode: string) => {
    const origin = findAirportByCode(originCode);
    const dest = findAirportByCode(destCode);

    const today = new Date();
    const depDate = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const retDate = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const params: SearchParams = {
      tripType: 'round-trip',
      origin,
      destination: dest,
      departureDate: depDate,
      returnDate: retDate,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'economy',
      directOnly: false,
    };

    handleSearchFlights(params);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F7] text-slate-900 selection:bg-amber-500 selection:text-white font-['Cairo',sans-serif]">
      
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'search' && bookingStep === 'confirmation_view') {
            setBookingStep('search_view');
          }
        }}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        savedBookingsCount={savedBookings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Tab 1: Search & Booking Flow */}
        {activeTab === 'search' && (
          <div>
            {/* If in Search View: Show Hero Banner + Search Form */}
            {bookingStep === 'search_view' && (
              <div className="space-y-8 pb-16">
                {/* Visual Hero Section */}
                <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-[#002B49] text-white pt-12 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                  
                  {/* Subtle Background Egyptian Geometry / Atmosphere */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                  
                  <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                      <span>{isAr ? 'عروض حصرية على الرحلات الداخلية والدولية لمصر 2026' : 'Exclusive 2026 Egyptian Flight Fares'}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
                      {isAr ? (
                        <>
                          احجز تذاكر طيرانك في مصر <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                            بأفضل سعر وتأكيد فوري
                          </span>
                        </>
                      ) : (
                        <>
                          Book Flights Across Egypt <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                            With Instant Confirmation
                          </span>
                        </>
                      )}
                    </h1>

                    <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                      {isAr
                        ? 'قارن بين مصر للطيران، إير كايرو، النيل للطيران وجميع الشركات في منصة واحدة. ادفع بأمان عبر فوري، انستاباي، كارت ميزة، أو بالتقسيط عبر فاليو.'
                        : 'Compare EgyptAir, Air Cairo, Nile Air and international flights. Pay easily with Fawry, InstaPay, Meeza, or valU installments.'}
                    </p>
                  </div>
                </section>

                {/* Interactive Flight Search Box */}
                <div className="px-4 sm:px-6">
                  <FlightSearchForm
                    onSearch={handleSearchFlights}
                    language={language}
                    initialParams={currentSearchParams || undefined}
                  />
                </div>

                {/* Bento Grid Highlights Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Bento Cell 1: Official Civil Aviation & Security (4 cols) */}
                    <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{isAr ? 'حجز وتأكيد رسمي معتمد' : 'Official Civil Aviation'}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isAr ? 'إصدار فوري لبطاقة الصعود PNR برقم تذكرة إلكترونية معتمد ومربوط مباشرة بأنظمة الطيران المدني المصري.' : 'Instant e-ticket issuance and verified PNR boarding pass connected to Egyptian aviation systems.'}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-amber-700 font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>{isAr ? 'تأكيد مباشر 100%' : '100% Guaranteed PNR'}</span>
                      </div>
                    </div>

                    {/* Bento Cell 2: Local Egyptian Payment Methods (4 cols) */}
                    <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{isAr ? 'طرق دفع مصرية متنوعة' : 'Local Egyptian Pay'}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isAr ? 'دعم كامل لفوري بلس، انستاباي، كارت ميزة الوطني، المحافظ الإلكترونية، وتقسيط حتى 36 شهر عبر فاليو وسهولة.' : 'Full support for Fawry, InstaPay, Meeza card, e-wallets, and flexible valU installments.'}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">Fawry</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">InstaPay</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">Meeza</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">valU</span>
                      </div>
                    </div>

                    {/* Bento Cell 3: Live Radar & 24/7 Hotline (4 cols) */}
                    <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{isAr ? 'إتمام السفر والرادار اللحظي' : 'Online Check-in & Radar'}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isAr ? 'اختر مقعدك على خريطة الطائرة التفاعلية، وتتبع مواعيد الصعود وبوابات مطار القاهرة الدولي مباشرة.' : 'Interactive seat selection and real-time flight tracking for Cairo & regional airports.'}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setActiveTab('live')}
                          className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>{isAr ? 'فتح رادار الرحلات' : 'Open Flight Radar'}</span>
                          <span>➔</span>
                        </button>
                        <span className="text-[11px] text-slate-400 font-mono">19000</span>
                      </div>
                    </div>

                    {/* Bento Cell 4: Featured Deal Banner Spotlight (8 cols) */}
                    <div className="md:col-span-8 bg-gradient-to-r from-slate-900 via-slate-800 to-[#003B64] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-700/60 relative overflow-hidden flex flex-col justify-between">
                      <div className="relative z-10 space-y-3 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-0.5 rounded-full text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAr ? 'وجهة الأسبوع الأكثر طلباً' : 'Featured Destination of the Week'}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black">
                          {isAr ? 'شرم الشيخ والغردقة: شمس وبحر بأرخص سعر' : 'Sharm & Hurghada: Sun & Sea Airfares'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {isAr 
                            ? 'رحلات يومية مباشرة من مطار القاهرة ومطار برج العرب بأسعار تبدأ من 1,850 ج.م شاملة حقيبة 23 كجم ووجبة مجانية.'
                            : 'Daily direct flights from Cairo & Alexandria starting at 1,850 EGP with 23kg baggage included.'}
                        </p>
                      </div>

                      <div className="relative z-10 mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{isAr ? 'ابتداءً من:' : 'Starting at:'}</span>
                          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">1,850 ج.م</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectDeal('CAI', 'SSH')}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
                        >
                          {isAr ? 'حجز رحلة شرم الشيخ الآن' : 'Book Sharm Flight Now'}
                        </button>
                      </div>
                    </div>

                    {/* Bento Cell 5: AI Travel Assistant Bento Shortcut (4 cols) */}
                    <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-lg text-slate-950">{isAr ? 'المساعد الذكي للرحلات' : 'AI Travel Advisor'}</h3>
                        <p className="text-xs text-slate-900/90 font-medium leading-relaxed">
                          {isAr 
                            ? 'اسأل الذكاء الاصطناعي عن أفضل مواعيد السفر في مصر، أسعار تذاكر العمرة، أوزان الأمتعة وسياسات الإلغاء.'
                            : 'Ask our AI about best booking dates, Umrah airfares, luggage allowances, and airline baggage rules.'}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-amber-600/30">
                        <button
                          type="button"
                          onClick={() => setActiveTab('assistant')}
                          className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                        >
                          {isAr ? 'تحدث مع المساعد الذكي' : 'Chat with AI Assistant'}
                        </button>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Popular Egyptian Destinations preview on homepage */}
                <section className="py-4">
                  <TravelGuideAndOffers
                    onSelectDeal={handleSelectDeal}
                    currency={currency}
                    language={language}
                  />
                </section>
              </div>
            )}

            {/* If in Search Results View */}
            {bookingStep === 'results_view' && currentSearchParams && (
              <FlightSearchResults
                flights={searchResults}
                searchParams={currentSearchParams}
                onSelectFlight={handleSelectFlightAndFare}
                onModifySearch={() => setBookingStep('search_view')}
                currency={currency}
                language={language}
              />
            )}

            {/* If in Passenger Details View */}
            {bookingStep === 'passenger_view' && selectedFlight && selectedFare && currentSearchParams && (
              <PassengerDetailsStep
                flight={selectedFlight}
                selectedFare={selectedFare}
                searchParams={currentSearchParams}
                onProceedToPayment={handleProceedToPayment}
                onBack={() => setBookingStep('results_view')}
                currency={currency}
                language={language}
              />
            )}

            {/* If in Payment View */}
            {bookingStep === 'payment_view' && selectedFlight && selectedFare && currentSearchParams && (
              <PaymentStep
                flight={selectedFlight}
                selectedFare={selectedFare}
                searchParams={currentSearchParams}
                passengers={confirmedPassengers}
                addons={selectedAddons}
                contact={contactInfo}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setBookingStep('passenger_view')}
                currency={currency}
                language={language}
              />
            )}

            {/* If in Confirmation / Boarding Pass View */}
            {bookingStep === 'confirmation_view' && currentBooking && (
              <BookingConfirmation
                booking={currentBooking}
                onBookAnother={() => {
                  setBookingStep('search_view');
                  setSelectedFlight(null);
                  setSelectedFare(null);
                }}
                onManageBooking={() => setActiveTab('manage')}
                currency={currency}
                language={language}
              />
            )}
          </div>
        )}

        {/* Tab 2: Tourism Deals & Offers */}
        {activeTab === 'offers' && (
          <TravelGuideAndOffers
            onSelectDeal={handleSelectDeal}
            currency={currency}
            language={language}
          />
        )}

        {/* Tab 3: Live Flight Status Board */}
        {activeTab === 'live' && (
          <LiveFlightStatus language={language} />
        )}

        {/* Tab 4: Manage Bookings & Online Check-in */}
        {activeTab === 'manage' && (
          <ManageBookings
            bookings={savedBookings}
            onRefresh={refreshSavedBookings}
            onViewConfirmation={(b) => {
              setCurrentBooking(b);
              setBookingStep('confirmation_view');
              setActiveTab('search');
            }}
            onBookFlight={() => {
              setBookingStep('search_view');
              setActiveTab('search');
            }}
            currency={currency}
            language={language}
          />
        )}

        {/* Tab 5: AI Travel Assistant */}
        {activeTab === 'assistant' && (
          <AITravelAssistant
            onQuickBook={handleSelectDeal}
            language={language}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer language={language} />
    </div>
  );
}
