import { create } from 'zustand';
import dayPassService from '../services/dayPassService';

export const useDayPassStore = create((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },

  refreshBookings: async (params = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await dayPassService.fetchBookings(params);
        if (response.success) {
            set({ 
                bookings: response.data, 
                pagination: response.pagination || get().pagination,
                loading: false 
            });
        } else {
            set({ error: 'Failed to fetch bookings', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching bookings', loading: false });
    }
  },

  createBooking: async (data) => {
    set({ loading: true });
    try {
        const response = await dayPassService.createBooking(data);
        if (response.success) {
            get().refreshBookings();
            return response;
        }
    } catch (err) {
        set({ error: err.message || 'Booking failed', loading: false });
        throw err;
    }
  },

  cancelBooking: async (id) => {
    try {
        const response = await dayPassService.cancelBooking(id);
        if (response.success) {
            set((state) => ({
                bookings: state.bookings.map(b => (b._id === id || b.id === id) ? { ...b, status: 'cancelled' } : b)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));
