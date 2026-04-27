import api from './api';

const bookingService = {
  /**
   * Lists all meeting room bookings for the current building context.
   * @param {Object} params Filter parameters (status, room, date).
   */
  fetchMeetingBookings: async (params = {}) => {
    try {
      const response = await api.get('/api/community/meeting-bookings', { params });
      return response.data; // { success, data: { bookings, pagination } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Creates a new meeting room booking.
   * @param {Object} bookingData Booking details.
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/meeting-bookings', bookingData);
      return response.data; // { success, message, data: { booking } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches full details for a specific event including RSVPs.
   * (Included here as it's a form of booking/joining)
   */
  fetchEventDetails: async (id) => {
    try {
      const response = await api.get(`/api/community/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default bookingService;
