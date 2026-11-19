import { Airline, FareOption, Flight, FlightSegment, SearchParams } from '../types';
import { findAirportByCode } from './airports';

export const AIRLINES: Record<string, Airline> = {
  EGYPTAIR: {
    code: 'MS',
    nameAr: 'مصر للطيران',
    nameEn: 'EGYPTAIR',
    logo: '🦅',
    primaryColor: '#002B49',
    accentColor: '#B38F48',
  },
  AIR_CAIRO: {
    code: 'SM',
    nameAr: 'إير كايرو',
    nameEn: 'Air Cairo',
    logo: '✈️',
    primaryColor: '#D32F2F',
    accentColor: '#1976D2',
  },
  NILE_AIR: {
    code: 'NP',
    nameAr: 'النيل للطيران',
    nameEn: 'Nile Air',
    logo: '🌊',
    primaryColor: '#0A3B5C',
    accentColor: '#00A896',
  },
  FLYEGYPT: {
    code: 'FT',
    nameAr: 'فلاي إيجيبت',
    nameEn: 'FlyEgypt',
    logo: '🪶',
    primaryColor: '#E65100',
    accentColor: '#FFB300',
  },
  SAUDIA: {
    code: 'SV',
    nameAr: 'الخطوط السعودية',
    nameEn: 'Saudia',
    logo: '🌴',
    primaryColor: '#006C35',
    accentColor: '#C49A45',
  },
  EMIRATES: {
    code: 'EK',
    nameAr: 'طيران الإمارات',
    nameEn: 'Emirates',
    logo: '👑',
    primaryColor: '#D71921',
    accentColor: '#C79A40',
  },
  FLYNAS: {
    code: 'XY',
    nameAr: 'طيران ناس',
    nameEn: 'Flynas',
    logo: '⚡',
    primaryColor: '#78BE20',
    accentColor: '#00205B',
  },
  TURKISH: {
    code: 'TK',
    nameAr: 'الخطوط الجوية التركية',
    nameEn: 'Turkish Airlines',
    logo: '🇹🇷',
    primaryColor: '#C8102E',
    accentColor: '#231F20',
  },
};

export const DEFAULT_FARE_OPTIONS: FareOption[] = [
  {
    id: 'eco_light',
    nameAr: 'اقتصادي لايت (Eco Light)',
    nameEn: 'Economy Light',
    priceDelta: 0,
    baggageCabin: '7 كجم حقيبة يد + حقيبة لابتوب',
    baggageChecked: 'غير مشمول (حقيبة مدفوعة)',
    seatSelectionIncluded: false,
    mealIncluded: true,
    refundable: false,
    changeFeeEgp: 950,
    features: [
      'حقيبة يد مجانية 7 كجم',
      'وجبة ومشروبات مجانية على متن الطائرة',
      'إمكانية تعديل الموعد برسوم 950 ج.م',
      'غير قابل للاسترداد',
    ],
  },
  {
    id: 'eco_standard',
    nameAr: 'اقتصادي قياسي (Eco Standard)',
    nameEn: 'Economy Standard',
    priceDelta: 650,
    baggageCabin: '7 كجم حقيبة يد',
    baggageChecked: '1 حقيبة 23 كجم مشمولة',
    seatSelectionIncluded: true,
    mealIncluded: true,
    refundable: true,
    changeFeeEgp: 450,
    features: [
      '1 حقيبة مسجلة 23 كجم مجاناً',
      'حقيبة يد 7 كجم',
      'اختيار المقعد القياسي مجاناً',
      'وجبة ساخنة ومشروبات ترحيبية',
      'تعديل الموعد برسوم مخفضة 450 ج.م',
      'استرداد التذكرة متاح بخصم رمزي',
    ],
  },
  {
    id: 'eco_flex',
    nameAr: 'اقتصادي مرن (Eco Flex)',
    nameEn: 'Economy Flex',
    priceDelta: 1450,
    baggageCabin: '7 كجم حقيبة يد',
    baggageChecked: '2 حقيبة (2 × 23 كجم)',
    seatSelectionIncluded: true,
    mealIncluded: true,
    refundable: true,
    changeFeeEgp: 0,
    features: [
      '2 حقيبة مسجلة (إجمالي 46 كجم)',
      'تغيير موعد الرحلة مجاناً بالكامل (0 ج.م)',
      'استرداد المبلغ كامل قبل السفر',
      'أولوية إنهاء إجراءات السفر بالمطار',
      'اختيار مقاعد بمساحة أرجل إضافية',
    ],
  },
  {
    id: 'business',
    nameAr: 'درجة رجال الأعمال (Business Class)',
    nameEn: 'Business Class',
    priceDelta: 4800,
    baggageCabin: '2 × 8 كجم حقائب يد',
    baggageChecked: '2 حقيبة (2 × 32 كجم) + أولوية',
    seatSelectionIncluded: true,
    mealIncluded: true,
    refundable: true,
    changeFeeEgp: 0,
    features: [
      'مقاعد فاخرة تنحني للسرير الكامل',
      'دخول صالة كبار الزوار (Lounge) بمطار القاهرة والمطارات الدولية',
      'إنهاء إجراءات السفر والصعود عبر المسار السريع',
      'قائمة طعام فاخرة وإفطار/عشاء من الشيف',
      'أمتعة مضاعفة (64 كجم) مع علامة الأولوية Priority',
    ],
  },
];

// Helper to generate base price based on distance
function calculateEstimatedPrice(originCode: string, destCode: string): number {
  const isDomestic = (
    ['CAI', 'SSH', 'HRG', 'LXR', 'ASW', 'HBE', 'RMF', 'SPX', 'HMB', 'ATZ', 'ABS', 'MUH'].includes(originCode) &&
    ['CAI', 'SSH', 'HRG', 'LXR', 'ASW', 'HBE', 'RMF', 'SPX', 'HMB', 'ATZ', 'ABS', 'MUH'].includes(destCode)
  );

  if (isDomestic) {
    // Domestic Egypt prices usually range ~ 1,450 to 3,200 EGP
    if ((originCode === 'CAI' && destCode === 'SSH') || (originCode === 'SSH' && destCode === 'CAI')) return 1650;
    if ((originCode === 'CAI' && destCode === 'HRG') || (originCode === 'HRG' && destCode === 'CAI')) return 1720;
    if ((originCode === 'CAI' && destCode === 'LXR') || (originCode === 'LXR' && destCode === 'CAI')) return 2150;
    if ((originCode === 'CAI' && destCode === 'ASW') || (originCode === 'ASW' && destCode === 'CAI')) return 2350;
    if ((originCode === 'CAI' && destCode === 'RMF') || (originCode === 'RMF' && destCode === 'CAI')) return 2800;
    return 1850;
  }

  // Regional / Saudi / Gulf / Middle East
  if (['JED', 'MED', 'RUH', 'DMM', 'KWI', 'DOH', 'DXB', 'AUH', 'AMM', 'BEY'].includes(destCode) || ['JED', 'MED', 'RUH', 'DMM', 'KWI', 'DOH', 'DXB', 'AUH', 'AMM', 'BEY'].includes(originCode)) {
    if (destCode === 'JED' || originCode === 'JED') return 5200; // Jeddah / Umrah
    if (destCode === 'DXB' || originCode === 'DXB') return 6800; // Dubai
    if (destCode === 'RUH' || originCode === 'RUH') return 5900; // Riyadh
    if (destCode === 'KWI' || originCode === 'KWI') return 6200; // Kuwait
    if (destCode === 'DOH' || originCode === 'DOH') return 7400; // Doha
    return 5500;
  }

  // Europe / Istanbul
  if (['IST', 'SAW'].includes(destCode) || ['IST', 'SAW'].includes(originCode)) return 6400;
  if (['LHR', 'CDG', 'FCO', 'FRA'].includes(destCode) || ['LHR', 'CDG', 'FCO', 'FRA'].includes(originCode)) return 11800;

  return 6500;
}

function getEstimatedDurationMinutes(originCode: string, destCode: string): number {
  if (
    (originCode === 'CAI' && destCode === 'SSH') || (originCode === 'SSH' && destCode === 'CAI') ||
    (originCode === 'CAI' && destCode === 'HRG') || (originCode === 'HRG' && destCode === 'CAI')
  ) return 60;

  if (
    (originCode === 'CAI' && destCode === 'LXR') || (originCode === 'LXR' && destCode === 'CAI') ||
    (originCode === 'CAI' && destCode === 'ASW') || (originCode === 'ASW' && destCode === 'CAI')
  ) return 75;

  if (
    (originCode === 'CAI' && destCode === 'JED') || (originCode === 'JED' && destCode === 'CAI') ||
    (originCode === 'CAI' && destCode === 'MED') || (originCode === 'MED' && destCode === 'CAI')
  ) return 135;

  if (
    (originCode === 'CAI' && destCode === 'DXB') || (originCode === 'DXB' && destCode === 'CAI') ||
    (originCode === 'CAI' && destCode === 'AUH') || (originCode === 'AUH' && destCode === 'CAI')
  ) return 215;

  if (
    (originCode === 'CAI' && destCode === 'IST') || (originCode === 'IST' && destCode === 'CAI')
  ) return 145;

  if (
    (originCode === 'CAI' && destCode === 'LHR') || (originCode === 'LHR' && destCode === 'CAI') ||
    (originCode === 'CAI' && destCode === 'CDG') || (originCode === 'CDG' && destCode === 'CAI')
  ) return 310;

  return 120;
}

export function generateFlightsForSearch(params: SearchParams): Flight[] {
  const { origin, destination, departureDate, returnDate, tripType } = params;
  const basePrice = calculateEstimatedPrice(origin.code, destination.code);
  const baseDuration = getEstimatedDurationMinutes(origin.code, destination.code);

  const availableAirlines = [
    AIRLINES.EGYPTAIR,
    AIRLINES.AIR_CAIRO,
    AIRLINES.NILE_AIR,
    AIRLINES.FLYEGYPT,
    AIRLINES.SAUDIA,
    AIRLINES.FLYNAS,
  ];

  const aircraftList = [
    'Airbus A320neo',
    'Boeing 737-800',
    'Airbus A321neo',
    'Boeing 787-9 Dreamliner',
    'Airbus A330-300',
  ];

  const times = [
    { dep: '06:15', arrOffset: 0, flightNoPrefix: 'MS 142', airline: AIRLINES.EGYPTAIR, terminal: 'مبنى 3' },
    { dep: '08:45', arrOffset: 1, flightNoPrefix: 'SM 481', airline: AIRLINES.AIR_CAIRO, terminal: 'مبنى 1' },
    { dep: '11:30', arrOffset: 2, flightNoPrefix: 'NP 204', airline: AIRLINES.NILE_AIR, terminal: 'مبنى 1' },
    { dep: '14:20', arrOffset: 0, flightNoPrefix: 'MS 780', airline: AIRLINES.EGYPTAIR, terminal: 'مبنى 3' },
    { dep: '17:50', arrOffset: 3, flightNoPrefix: 'FT 310', airline: AIRLINES.FLYEGYPT, terminal: 'مبنى 2' },
    { dep: '21:10', arrOffset: 0, flightNoPrefix: 'MS 890', airline: AIRLINES.EGYPTAIR, terminal: 'مبنى 3' },
    { dep: '23:30', arrOffset: 2, flightNoPrefix: 'SM 912', airline: AIRLINES.AIR_CAIRO, terminal: 'مبنى 1' },
  ];

  return times.map((t, idx) => {
    const flightPrice = Math.round(basePrice * (0.88 + (idx * 0.07)));
    const duration = baseDuration + (idx % 2 === 0 ? 0 : 15);

    const [depHours, depMins] = t.dep.split(':').map(Number);
    const depDateObj = new Date(`${departureDate}T${t.dep}:00`);
    const arrDateObj = new Date(depDateObj.getTime() + duration * 60 * 1000);
    const arrTimeFormatted = `${String(arrDateObj.getHours()).padStart(2, '0')}:${String(arrDateObj.getMinutes()).padStart(2, '0')}`;

    const is1Stop = idx === 4; // one flight with a brief stop in Hurghada or Cairo
    const stopAirport = origin.code === 'CAI' ? findAirportByCode('HRG') : findAirportByCode('CAI');

    const outboundSegment: FlightSegment = {
      id: `seg_out_${idx}`,
      airline: t.airline,
      flightNumber: t.flightNoPrefix,
      aircraft: aircraftList[idx % aircraftList.length],
      departureAirport: origin,
      arrivalAirport: is1Stop ? stopAirport : destination,
      departureTime: `${departureDate}T${t.dep}:00`,
      arrivalTime: `${departureDate}T${arrTimeFormatted}:00`,
      durationMinutes: duration,
      terminalDeparture: t.terminal,
      terminalArrival: destination.isDomesticEgypt ? 'مبنى 1' : 'المبنى الرئيسي',
      cabinClass: params.cabinClass,
    };

    const flight: Flight = {
      id: `fl_${origin.code}_${destination.code}_${idx}_${departureDate}`,
      airline: t.airline,
      aircraft: aircraftList[idx % aircraftList.length],
      flightNumber: t.flightNoPrefix,
      basePriceEgp: flightPrice,
      availableSeats: Math.floor(Math.random() * 8) + 2,
      isDirect: !is1Stop,
      terminal: t.terminal,
      fareOptions: DEFAULT_FARE_OPTIONS,
      outbound: {
        segments: [outboundSegment],
        departureTime: `${departureDate}T${t.dep}:00`,
        arrivalTime: `${departureDate}T${arrTimeFormatted}:00`,
        durationMinutes: is1Stop ? duration + 55 : duration,
        stops: is1Stop ? 1 : 0,
        stopAirport: is1Stop ? stopAirport : undefined,
        stopDurationMinutes: is1Stop ? 50 : undefined,
      },
    };

    if (tripType === 'round-trip' && returnDate) {
      const returnDepTime = idx % 2 === 0 ? '10:30' : '19:45';
      const returnArrObj = new Date(new Date(`${returnDate}T${returnDepTime}:00`).getTime() + duration * 60 * 1000);
      const retArrFormatted = `${String(returnArrObj.getHours()).padStart(2, '0')}:${String(returnArrObj.getMinutes()).padStart(2, '0')}`;

      flight.inbound = {
        segments: [{
          id: `seg_in_${idx}`,
          airline: t.airline,
          flightNumber: `${t.flightNoPrefix.split(' ')[0]} ${Number(t.flightNoPrefix.split(' ')[1]) + 1}`,
          aircraft: aircraftList[idx % aircraftList.length],
          departureAirport: destination,
          arrivalAirport: origin,
          departureTime: `${returnDate}T${returnDepTime}:00`,
          arrivalTime: `${returnDate}T${retArrFormatted}:00`,
          durationMinutes: duration,
          terminalDeparture: 'المبنى الرئيسي',
          terminalArrival: t.terminal,
          cabinClass: params.cabinClass,
        }],
        departureTime: `${returnDate}T${returnDepTime}:00`,
        arrivalTime: `${returnDate}T${retArrFormatted}:00`,
        durationMinutes: duration,
        stops: 0,
      };
    }

    return flight;
  });
}
