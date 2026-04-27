import api from './api';

const dayPassService = {
  /**
   * Fetches day pass bookings for the current building.
   * @param {Object} params status, search, page, limit
   */
  fetchBookings: async (params = {}) => {
    try {
      const response = await api.get('/api/community/daypass/bookings', { params });
      return response.data; // { success, data: [...], pagination: {...} }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Creates a new day pass booking.
   * @param {Object} data customerName, email, phone, building, date, etc.
   */
  createBooking: async (data) => {
    try {
      const response = await api.post('/api/community/daypass/book', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cancels a day pass booking.
   */
  cancelBooking: async (id) => {
    try {
      const response = await api.patch(`/api/community/daypass/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Generates or fetches the invoice for a booking.
   */
  getInvoice: async (id) => {
    try {
      const response = await api.get(`/api/community/daypass/bookings/${id}/invoice`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default dayPassService;
