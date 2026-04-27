import { create } from 'zustand';
import rfidService from '../services/rfidService';

export const useRFIDStore = create((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  refreshCards: async (params = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await rfidService.fetchCards(params);
        if (response.success) {
            set({ cards: response.data, loading: false });
        } else {
            set({ error: 'Failed to fetch cards', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching cards', loading: false });
    }
  },

  importCards: async (cardsList) => {
    set({ loading: true });
    try {
        const response = await rfidService.importCards(cardsList);
        if (response.success) {
            get().refreshCards();
            return response;
        }
    } catch (err) {
        set({ error: err.message || 'Import failed', loading: false });
        throw err;
    }
  },

  deleteCard: async (id) => {
    try {
        const response = await rfidService.deleteCard(id);
        if (response.success) {
            set((state) => ({
                cards: state.cards.filter(c => (c._id !== id && c.id !== id))
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  updateCardStatus: async (id, status) => {
    try {
        const response = await rfidService.updateStatus(id, status);
        if (response.success) {
            set((state) => ({
                cards: state.cards.map(c => (c._id === id || c.id === id) ? { ...c, status } : c)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));
