import { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 1 / 48.5,
  SAR: 1 / 12.9,
  EUR: 1 / 52.8,
};

export const CURRENCY_SYMBOLS: Record<Currency, { ar: string; en: string }> = {
  EGP: { ar: 'ج.م', en: 'EGP' },
  USD: { ar: 'دولار', en: '$' },
  SAR: { ar: 'ر.س', en: 'SAR' },
  EUR: { ar: 'يورو', en: '€' },
};

export function formatPrice(egpAmount: number, currency: Currency, lang: 'ar' | 'en' = 'ar'): string {
  const converted = Math.round(egpAmount * CURRENCY_RATES[currency]);
  const formattedNumber = converted.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  const symbol = CURRENCY_SYMBOLS[currency][lang];

  return lang === 'ar' ? `${formattedNumber} ${symbol}` : `${symbol} ${formattedNumber}`;
}

export function formatDuration(durationMinutes: number, lang: 'ar' | 'en' = 'ar'): string {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (lang === 'ar') {
    if (hours === 0) return `${minutes} دقيقة`;
    if (minutes === 0) return `${hours} ساعة`;
    return `${hours} س ${minutes} د`;
  }
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatDateArabic(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function generatePNR(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'EG';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateETicketNumber(): string {
  const num = Math.floor(10000000000 + Math.random() * 90000000000);
  return `077-${num}`; // EgyptAir prefix is 077
}
