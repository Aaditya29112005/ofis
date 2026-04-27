import api from './api';

const printerService = {
  /**
   * Fetches all printer requests for the current building.
   * @param {Object} params status, search, building
   */
  fetchRequests: async (params = {}) => {
    try {
      const response = await api.get('/api/community/printer/requests', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Updates the status of a printer request.
   * @param {string} id Request ID
   * @param {string} status 'pending', 'ready', 'completed', 'cancelled'
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/community/printer/requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletes a printer request.
   */
  deleteRequest: async (id) => {
    try {
      const response = await api.delete(`/api/community/printer/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submits a new printer request (if needed in community panel).
   */
  createRequest: async (requestData) => {
    try {
      const response = await api.post('/api/community/printer/requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default printerService;
