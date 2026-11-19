export interface SpecialOffer {
  id: string;
  titleAr: string;
  titleEn: string;
  originCode: string;
  destCode: string;
  originNameAr: string;
  destNameAr: string;
  destNameEn: string;
  priceFromEgp: number;
  image: string;
  badgeAr: string;
  badgeEn: string;
  airlineNameAr: string;
  airlineCode: string;
  tagAr: string;
}

export const POPULAR_DEALS: SpecialOffer[] = [
  {
    id: 'deal_ssh',
    titleAr: 'عطلات شرم الشيخ ورأس محمد',
    titleEn: 'Sharm El Sheikh Vacations',
    originCode: 'CAI',
    destCode: 'SSH',
    originNameAr: 'القاهرة',
    destNameAr: 'شرم الشيخ',
    destNameEn: 'Sharm El Sheikh',
    priceFromEgp: 1650,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Best Seller',
    airlineNameAr: 'مصر للطيران',
    airlineCode: 'MS',
    tagAr: 'شواطئ وغوص',
  },
  {
    id: 'deal_hrg',
    titleAr: 'سحر الغردقة والجونة وسهل حشيش',
    titleEn: 'Hurghada & El Gouna Escapes',
    originCode: 'CAI',
    destCode: 'HRG',
    originNameAr: 'القاهرة',
    destNameAr: 'الغردقة',
    destNameEn: 'Hurghada',
    priceFromEgp: 1720,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'عرض الموسم',
    badgeEn: 'Seasonal Deal',
    airlineNameAr: 'إير كايرو',
    airlineCode: 'SM',
    tagAr: 'منتجعات واستجمام',
  },
  {
    id: 'deal_lxr',
    titleAr: 'الأقصر عاصمة الحضارة ووادي الملوك',
    titleEn: 'Luxor Ancient Wonders',
    originCode: 'CAI',
    destCode: 'LXR',
    originNameAr: 'القاهرة',
    destNameAr: 'الأقصر',
    destNameEn: 'Luxor',
    priceFromEgp: 2150,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'رحلة أثرية',
    badgeEn: 'Heritage Tour',
    airlineNameAr: 'مصر للطيران',
    airlineCode: 'MS',
    tagAr: 'تاريخ وآثار',
  },
  {
    id: 'deal_asw',
    titleAr: 'أسوان والنوبة وسحر النيل الخالد',
    titleEn: 'Aswan & Nubian Culture',
    originCode: 'CAI',
    destCode: 'ASW',
    originNameAr: 'القاهرة',
    destNameAr: 'أسوان',
    destNameEn: 'Aswan',
    priceFromEgp: 2350,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'سحر النيل',
    badgeEn: 'Nile Magic',
    airlineNameAr: 'النيل للطيران',
    airlineCode: 'NP',
    tagAr: 'طبيعة وثقافة',
  },
  {
    id: 'deal_jed',
    titleAr: 'رحلات العمرة وزيارة الحرمين الشريفين',
    titleEn: 'Umrah & Sacred Visits to Jeddah',
    originCode: 'CAI',
    destCode: 'JED',
    originNameAr: 'القاهرة',
    destNameAr: 'جدة (العمرة)',
    destNameEn: 'Jeddah',
    priceFromEgp: 5200,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'رحلات العمرة',
    badgeEn: 'Umrah Flights',
    airlineNameAr: 'الخطوط السعودية',
    airlineCode: 'SV',
    tagAr: 'سياحة دينية',
  },
  {
    id: 'deal_dxb',
    titleAr: 'دبي - برج خليفة والتسوق الفاخر',
    titleEn: 'Dubai City Break',
    originCode: 'CAI',
    destCode: 'DXB',
    originNameAr: 'القاهرة',
    destNameAr: 'دبي',
    destNameEn: 'Dubai',
    priceFromEgp: 6800,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'خصم 15%',
    badgeEn: '15% Off',
    airlineNameAr: 'طيران الإمارات',
    airlineCode: 'EK',
    tagAr: 'تسوق وترفيه',
  },
];
