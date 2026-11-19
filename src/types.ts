export type TripType = 'round-trip' | 'one-way' | 'multi-city';

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export type Currency = 'EGP' | 'USD' | 'SAR' | 'EUR';

export type Language = 'ar' | 'en';

export interface Airport {
  code: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  countryAr: string;
  countryEn: string;
  isDomesticEgypt: boolean;
  terminals?: string[];
  popular?: boolean;
}

export interface Airline {
  code: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
}

export interface FlightSegment {
  id: string;
  airline: Airline;
  flightNumber: string;
  aircraft: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string; // ISO or "2026-08-20T08:30:00"
  arrivalTime: string;
  durationMinutes: number;
  terminalDeparture?: string;
  terminalArrival?: string;
  cabinClass: CabinClass;
}

export interface FareOption {
  id: string;
  nameAr: string;
  nameEn: string;
  priceDelta: number; // in EGP
  baggageCabin: string; // e.g. "7 كجم حقيبة يد"
  baggageChecked: string; // e.g. "حقيبة 23 كجم"
  seatSelectionIncluded: boolean;
  mealIncluded: boolean;
  refundable: boolean;
  changeFeeEgp: number;
  features: string[];
}

export interface Flight {
  id: string;
  outbound: {
    segments: FlightSegment[];
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    stops: number; // 0 for direct
    stopAirport?: Airport;
    stopDurationMinutes?: number;
  };
  inbound?: {
    segments: FlightSegment[];
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    stops: number;
    stopAirport?: Airport;
    stopDurationMinutes?: number;
  };
  airline: Airline;
  aircraft: string;
  flightNumber: string;
  basePriceEgp: number;
  availableSeats: number;
  fareOptions: FareOption[];
  isDirect: boolean;
  terminal: string;
}

export interface SearchParams {
  tripType: TripType;
  origin: Airport;
  destination: Airport;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  directOnly: boolean;
}

export interface PassengerInfo {
  id: string;
  type: 'adult' | 'child' | 'infant';
  title: 'Mr' | 'Mrs' | 'Ms' | 'Mstr' | 'Miss';
  firstName: string;
  lastName: string;
  nationality: string;
  nationalIdOrPassport: string;
  idType: 'national_id' | 'passport';
  dateOfBirth: string;
  seatOutbound?: string;
  seatInbound?: string;
  mealPreference?: string;
  extraBaggageCount: number;
  specialAssistance?: string;
}

export interface AddonServices {
  travelInsurance: boolean;
  cairoFastTrack: boolean;
  airportTransfer: boolean;
  smsNotification: boolean;
}

export type PaymentMethod = 
  | 'fawry' 
  | 'instapay' 
  | 'vodafone_cash' 
  | 'meeza' 
  | 'card' 
  | 'valu';

export interface BookingRecord {
  pnr: string; // 6-character booking reference e.g. EG89FA
  bookingDate: string;
  flight: Flight;
  selectedFare: FareOption;
  searchParams: SearchParams;
  passengers: PassengerInfo[];
  addons: AddonServices;
  contactEmail: string;
  contactPhone: string;
  totalPriceEgp: number;
  currencyPaid: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: 'confirmed' | 'pending_fawry' | 'paid';
  fawryRefNumber?: string;
  fawryExpiryTime?: string;
  status: 'confirmed' | 'checked_in' | 'cancelled';
  eTickets: {
    ticketNumber: string;
    passengerId: string;
    passengerName: string;
    flightNumber: string;
    seat: string;
    gate: string;
    terminal: string;
    boardingTime: string;
    qrData: string;
  }[];
}

export interface Seat {
  id: string;
  row: number;
  col: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  cabin: 'business' | 'economy';
  isExitRow: boolean;
  hasExtraLegroom: boolean;
  isOccupied: boolean;
  priceEgp: number;
  position: 'window' | 'middle' | 'aisle';
}

export interface LiveFlightInfo {
  flightNumber: string;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  scheduledTime: string;
  estimatedTime: string;
  status: 'On Time' | 'Boarding' | 'Departed' | 'Landed' | 'Delayed' | 'Cancelled';
  statusAr: 'في الموعد' | 'صعود الركاب' | 'أقلعت' | 'هبطت' | 'متأخرة' | 'ملغاة';
  terminal: string;
  gate: string;
  type: 'departure' | 'arrival';
}
