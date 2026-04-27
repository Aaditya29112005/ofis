import api from './api';

const ticketService = {
  /**
   * Lists all support tickets for the current building.
   * @param {Object} params Filter parameters (status, priority, search).
   */
  fetchTickets: async (params = {}) => {
    try {
      const response = await api.get('/api/community/tickets', { params });
      return response.data; // { success, data: { tickets, pagination } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Creates a new support ticket.
   * @param {Object} ticketData subject, description, priority, category, images, etc.
   */
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/api/tickets', ticketData);
      return response.data; // { success, ...populatedTicket }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletes a support ticket.
   * @param {string} id Ticket ID.
   */
  deleteTicket: async (id) => {
    try {
      const response = await api.delete(`/api/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lists all available ticket categories and their subcategories.
   */
  fetchCategories: async () => {
    try {
      const response = await api.get('/api/ticket-categories');
      return response.data; // Array of categories
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lists all staff users who can be assigned to tickets.
   */
  fetchStaff: async () => {
    try {
      const response = await api.get('/api/users/staff');
      return response.data; // { success, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default ticketService;
