import api from './api';

const rfidService = {
  /**
   * Fetches all RFID cards for the current building.
   * @param {Object} params status, search, client, tech
   */
  fetchCards: async (params = {}) => {
    try {
      const response = await api.get('/api/community/rfid', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Imports new RFID cards from a physical scan or CSV.
   * @param {Array} cards Array of card IDs and technology types.
   */
  importCards: async (cards) => {
    try {
      const response = await api.post('/api/community/rfid/import', { cards });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Assigns a card to a member/user.
   */
  assignCard: async (id, userId) => {
    try {
      const response = await api.patch(`/api/community/rfid/${id}/assign`, { userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Activates or deactivates a card.
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/community/rfid/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletes an RFID card record.
   */
  deleteCard: async (id) => {
    try {
      const response = await api.delete(`/api/community/rfid/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default rfidService;
