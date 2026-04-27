import { create } from 'zustand';
import inventoryService from '../services/inventoryService';

export const useCabinStore = create((set) => ({
  cabins: [],
  loading: false,
  error: null,
  
  updateCabinStatus: (id, status) => set((state) => ({
    cabins: state.cabins.map(c => c._id === id ? { ...c, status } : c)
  })),

  refreshCabins: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await inventoryService.fetchCabins(filters);
        if (response.success) {
            set({ cabins: response.data, loading: false });
        } else {
            set({ error: 'Failed to fetch cabins', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Something went wrong', loading: false });
    }
  }
}));

