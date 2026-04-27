import { create } from 'zustand';
import eventService from '../services/eventService';

export const useEventsStore = create((set, get) => ({
  events: [],
  categories: [],
  loading: false,
  error: null,

  refreshEvents: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await eventService.fetchEvents(filters);
        const eventData = Array.isArray(response) ? response : response?.data;
        
        if (response?.success || Array.isArray(eventData)) {
            set({ events: eventData || [], loading: false });
        } else {
            set({ error: 'Failed to fetch events', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching events', loading: false });
    }
  },

  fetchCategories: async () => {
    try {
        const response = await eventService.fetchCategories();
        const categoryData = Array.isArray(response) ? response : response?.data;
        if (response?.success || Array.isArray(categoryData)) {
            set({ categories: categoryData || [] });
        }
    } catch (err) {
        console.error('Error fetching event categories:', err);
    }
  },

  addEvent: async (eventData) => {
    set({ loading: true });
    try {
        const response = await eventService.createEvent(eventData);
        if (response.success) {
            set((state) => ({ 
                events: [response.data, ...state.events],
                loading: false 
            }));
            return response.data;
        }
    } catch (err) {
        set({ error: err.message || 'Failed to create event', loading: false });
        throw err;
    }
  },

  updateEvent: async (id, updatedEvent) => {
    set({ loading: true });
    try {
        const response = await eventService.updateEvent(id, updatedEvent);
        if (response.success) {
            set((state) => ({
                events: state.events.map(e => (e._id === id || e.id === id) ? response.data : e),
                loading: false
            }));
            return response.data;
        }
    } catch (err) {
        set({ error: err.message || 'Failed to update event', loading: false });
        throw err;
    }
  },

  deleteEvent: async (id) => {
    try {
        const response = await eventService.deleteEvent(id);
        if (response.success) {
            set((state) => ({
                events: state.events.filter(e => (e._id !== id && e.id !== id))
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  rsvpToEvent: async (id) => {
    try {
        const response = await eventService.rsvpToEvent(id);
        if (response.success) {
            // Update RSVP count in local state
            set((state) => ({
                events: state.events.map(e => (e._id === id || e.id === id) ? { ...e, rsvpCount: response.data.rsvpCount, hasRsvped: true } : e)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  cancelRsvp: async (id) => {
    try {
        const response = await eventService.cancelRsvp(id);
        if (response.success) {
            set((state) => ({
                events: state.events.map(e => (e._id === id || e.id === id) ? { ...e, rsvpCount: response.data.rsvpCount, hasRsvped: false } : e)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));

