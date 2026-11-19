import { BookingRecord } from '../types';

const STORAGE_KEY = 'egypt_flight_bookings_v1';

export function getSavedBookings(): BookingRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading bookings from localStorage:', err);
    return [];
  }
}

export function saveBooking(booking: BookingRecord): void {
  try {
    const current = getSavedBookings();
    const existingIndex = current.findIndex(b => b.pnr === booking.pnr);
    if (existingIndex >= 0) {
      current[existingIndex] = booking;
    } else {
      current.unshift(booking);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error saving booking to localStorage:', err);
  }
}

export function findBookingByPnr(pnr: string): BookingRecord | undefined {
  const current = getSavedBookings();
  return current.find(b => b.pnr.toUpperCase() === pnr.trim().toUpperCase());
}

export function updateBookingStatus(pnr: string, status: BookingRecord['status']): BookingRecord | undefined {
  const current = getSavedBookings();
  const index = current.findIndex(b => b.pnr.toUpperCase() === pnr.trim().toUpperCase());
  if (index >= 0) {
    current[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current[index];
  }
  return undefined;
}
