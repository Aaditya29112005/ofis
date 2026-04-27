import api from './api';

const eventService = {
  /**
   * Fetches events for the current building.
   * @param {Object} params status, search, categoryId, sortBy
   */
  fetchEvents: async (params = {}) => {
    try {
      const response = await api.get('/api/community/events', { params });
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new event.
   */
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/api/community/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches details for a specific event.
   */
  fetchEventDetails: async (id) => {
    try {
      const response = await api.get(`/api/community/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Updates an existing event.
   */
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/api/community/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletes an event.
   */
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/api/community/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Publishes a draft event.
   */
  publishEvent: async (id) => {
    try {
      const response = await api.patch(`/api/community/events/${id}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * RSVP to an event.
   */
  rsvpToEvent: async (id) => {
    try {
      const response = await api.post(`/api/community/events/${id}/rsvp`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cancel RSVP to an event.
   */
  cancelRsvp: async (id) => {
    try {
      const response = await api.delete(`/api/community/events/${id}/rsvp`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lists all available event categories.
   */
  fetchCategories: async () => {
    try {
      const response = await api.get('/api/community/event-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default eventService;
