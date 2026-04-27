import { create } from 'zustand';
import printerService from '../services/printerService';

const MOCK_BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'OfisSquare Main', value: 'OfisSquare Main' },
  { label: 'Cyber City Hub', value: 'Cyber City Hub' },
  { label: 'Sector 44 Tower', value: 'Sector 44 Tower' },
];

export const usePrinterStore = create((set, get) => ({
  requests: [],
  buildings: MOCK_BUILDINGS,
  loading: false,
  error: null,

  refreshRequests: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await printerService.fetchRequests(filters);
        if (response.success) {
            set({ requests: response.data, loading: false });
        } else {
            set({ error: 'Failed to fetch printer requests', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching printer requests', loading: false });
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
        const response = await printerService.updateStatus(id, newStatus);
        if (response.success) {
            set((state) => ({
                requests: state.requests.map(r => (r._id === id || r.id === id) ? { ...r, status: newStatus } : r)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  addRequest: async (requestData) => {
    try {
        const response = await printerService.createRequest(requestData);
        if (response.success) {
            set((state) => ({
                requests: [response.data, ...state.requests]
            }));
            return response;
        }
    } catch (err) {
        // Fallback or optimistic add if backend is mocked
        set((state) => ({
            requests: [{ ...requestData, _id: Math.random().toString(36).substr(2, 9) }, ...state.requests]
        }));
        return { success: true, data: requestData };
    }
  },

  deleteRequest: async (id) => {
    try {
        const response = await printerService.deleteRequest(id);
        if (response.success) {
            set((state) => ({
                requests: state.requests.filter(r => (r._id !== id && r.id !== id))
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));

