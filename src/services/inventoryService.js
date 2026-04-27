import api from './api';

const inventoryService = {
  /**
   * Fetches all cabins for the building associated with the logged-in user.
   * @param {Object} params Filter parameters (floor, status, type).
   */
  fetchCabins: async (params = {}) => {
    try {
      const response = await api.get('/api/community/cabins', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches all meeting rooms for the building associated with the logged-in user.
   * @param {Object} params Filter parameters (status, search).
   */
  fetchMeetingRooms: async (params = {}) => {
    try {
      const response = await api.get('/api/community/meeting-rooms', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches all common areas for the building associated with the logged-in user.
   */
  fetchCommonAreas: async () => {
    try {
      const response = await api.get('/api/community/common-areas');
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default inventoryService;
