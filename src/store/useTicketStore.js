import { create } from 'zustand';
import ticketService from '../services/ticketService';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  categories: [],
  staff: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 20 },

  refreshTickets: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await ticketService.fetchTickets(filters);
        if (response.success) {
            set({ 
                tickets: response.data.tickets, 
                pagination: response.data.pagination,
                loading: false 
            });
        } else {
            set({ error: 'Failed to fetch tickets', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching tickets', loading: false });
    }
  },

  fetchCategories: async () => {
    try {
        const categories = await ticketService.fetchCategories();
        set({ categories });
    } catch (err) {
        console.error('Error fetching ticket categories:', err);
    }
  },

  fetchStaff: async () => {
    try {
        const response = await ticketService.fetchStaff();
        if (response.success) {
            set({ staff: response.data });
        }
    } catch (err) {
        console.error('Error fetching staff list:', err);
    }
  },

  createTicket: async (ticketData) => {
    set({ loading: true });
    try {
        const response = await ticketService.createTicket(ticketData);
        if (response.success) {
            // Prepend new ticket to the list
            set((state) => ({
                tickets: [response.data, ...state.tickets],
                loading: false
            }));
            return response;
        }
    } catch (err) {
        set({ error: err.message || 'Ticket creation failed', loading: false });
        throw err;
    }
  },

  deleteTicket: async (id) => {
    try {
        const response = await ticketService.deleteTicket(id);
        if (response.success) {
            set((state) => ({
                tickets: state.tickets.filter(t => t._id !== id)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));
