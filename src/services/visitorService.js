import api from './api';

const visitorService = {
  /**
   * Returns counts of visitors grouped by their current status for the building.
   */
  getVisitorStats: async () => {
    try {
      const response = await api.get('/api/community/visitors/stats');
      return response.data; // { success, data: { total, invited, checked_in, ... } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Retrieves a list of all visitors expected to arrive on the current day.
   */
  fetchTodayVisitors: async () => {
    try {
      const response = await api.get('/api/community/visitors/today');
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Retrieves a general list of visitors with optional filtering.
   * @param {Object} params status, search, date
   */
  fetchVisitors: async (params = {}) => {
    try {
      const response = await api.get('/api/community/visitors', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lists visitors who have a pending_checkin status.
   */
  fetchPendingVisitors: async () => {
    try {
      const response = await api.get('/api/community/visitors/pending-checkin');
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Approves a visitor's check-in request.
   */
  approveCheckin: async (id) => {
    try {
      const response = await api.post(`/api/community/visitors/${id}/approve-checkin`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Updates a visitor's status to checked_in and assigns a badge.
   * @param {string} id Visitor ID
   * @param {Object} data { badgeId, notes }
   */
  checkinVisitor: async (id, data) => {
    try {
      const response = await api.patch(`/api/community/visitors/${id}/checkin`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Marks a visitor as checked_out.
   */
  checkoutVisitor: async (id) => {
    try {
      const response = await api.patch(`/api/community/visitors/${id}/checkout`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Processes a visitor check-in via QR code scan.
   */
  scanQR: async (token) => {
    try {
      const response = await api.post('/api/community/visitors/scan', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Retrieves a list of members (hosts) in this building.
   */
  fetchMembers: async () => {
    try {
      const response = await api.get('/api/community/members');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default visitorService;
