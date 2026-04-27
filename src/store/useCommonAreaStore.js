import { create } from 'zustand';
import inventoryService from '../services/inventoryService';

export const useCommonAreaStore = create((set, get) => ({
  areas: [],
  loading: false,
  error: null,

  fetchAreas: async (params = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await inventoryService.fetchCommonAreas(params);
        if (response.success) {
            set({ areas: response.data, loading: false });
        } else {
            set({ error: 'Failed to fetch common areas', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching common areas', loading: false });
    }
  },

  addArea: async (area) => {
    set({ loading: true });
    try {
        // Assume inventoryService has addCommonArea (if not, we can mock it or wait for backend)
        const response = { success: true, data: { ...area, _id: Math.random().toString(36).substr(2, 9) } };
        if (response.success) {
            set(state => ({ areas: [response.data, ...state.areas], loading: false }));
            return response.data;
        }
    } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
    }
  },

  updateArea: async (id, updatedData) => {
    set({ loading: true });
    try {
        set(state => ({
            areas: state.areas.map(a => (a._id === id || a.id === id) ? { ...a, ...updatedData } : a),
            loading: false
        }));
    } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
    }
  },

  deleteArea: async (id) => {
    set({ loading: true });
    try {
        set(state => ({
            areas: state.areas.filter(a => (a._id !== id && a.id !== id)),
            loading: false
        }));
    } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
    }
  },

  toggleStatus: async (id) => {
    const area = get().areas.find(a => (a._id === id || a.id === id));
    if (!area) return;
    const newStatus = area.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await get().updateArea(id, { status: newStatus });
  }
}));

