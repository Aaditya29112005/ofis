import { create } from 'zustand';
import inventoryService from '../services/inventoryService';
import bookingService from '../services/bookingService';

export const useMeetingRoomStore = create((set) => ({
  bookings: [],
  rooms: [],
  loading: false,
  error: null,
  discountCap: 2, 

  refreshRooms: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await inventoryService.fetchMeetingRooms(filters);
        if (response.success) {
            set({ rooms: response.data, loading: false });
        } else {
            set({ error: 'Failed to fetch rooms', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching rooms', loading: false });
    }
  },

  refreshBookings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await bookingService.fetchMeetingBookings(filters);
        if (response.success) {
            set({ bookings: response.data.bookings, loading: false });
        } else {
            set({ error: 'Failed to fetch bookings', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching bookings', loading: false });
    }
  },

  addBooking: async (bookingData) => {
    set({ loading: true });
    try {
        const response = await bookingService.createBooking(bookingData);
        if (response.success) {
            set((state) => ({ 
                bookings: [response.data.booking, ...state.bookings],
                loading: false 
            }));
            return response.data;
        }
    } catch (err) {
        set({ error: err.message || 'Booking failed', loading: false });
        throw err;
    }
  },

  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b)
  })),

  // These might need specialized API calls if we want to sync with server
  updateVisitorStatus: (bookingId, visitorId, status) => set((state) => ({
    bookings: state.bookings.map(b => b._id === bookingId ? {
      ...b,
      visitors: (b.visitors || []).map(v => v._id === visitorId ? { ...v, status } : v)
    } : b)
  })),

  addVisitor: (bookingId, visitor) => set((state) => ({
    bookings: state.bookings.map(b => b._id === bookingId ? {
      ...b,
      visitors: [...(b.visitors || []), { ...visitor, _id: Math.random().toString(36).substr(2, 9), status: 'invited' }]
    } : b)
  })),
}));

