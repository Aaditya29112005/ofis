import api from './api';

const memberService = {
  /**
   * Fetches building clients (companies/individuals).
   * @param {Object} params type, kycStatus, search, sort
   */
  fetchClients: async (params = {}) => {
    try {
      const response = await api.get('/api/community/clients', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches on-demand users (guests/freelancers).
   * @param {Object} params search, page, limit
   */
  fetchOnDemandUsers: async (params = {}) => {
    try {
      const response = await api.get('/api/community/members', { 
        params: { ...params, type: 'on-demand' } 
      });
      return response.data; // { success, data: [...], pagination: {...} }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches details of a specific client including contacts.
   */
  getClientDetails: async (id) => {
    try {
      const response = await api.get(`/api/community/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default memberService;
