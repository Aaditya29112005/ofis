import { create } from 'zustand';
import visitorService from '../services/visitorService';

export const useVisitorStore = create((set, get) => ({
  visitors: [],
  stats: {
    total: 0,
    invited: 0,
    checked_in: 0,
    checked_out: 0,
    cancelled: 0,
    no_show: 0
  },
  loading: false,
  error: null,

  refreshStats: async () => {
    try {
        const response = await visitorService.getVisitorStats();
        const statData = response?.data || (typeof response === 'object' && !Array.isArray(response) ? response : null);
        if (response?.success || statData) {
            set({ stats: statData });
        }
    } catch (err) {
        console.error('Error fetching visitor stats:', err);
    }
  },

  refreshVisitors: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
        const response = await visitorService.fetchVisitors(filters);
        const visitorData = Array.isArray(response) ? response : response?.data;
        if (response?.success || Array.isArray(visitorData)) {
            set({ visitors: visitorData || [], loading: false });
        } else {
            set({ error: 'Failed to fetch visitors', loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching visitors', loading: false });
    }
  },

  fetchTodayVisitors: async () => {
    set({ loading: true, error: null });
    try {
        const response = await visitorService.fetchTodayVisitors();
        const visitorData = Array.isArray(response) ? response : response?.data;
        if (response?.success || Array.isArray(visitorData)) {
            set({ visitors: visitorData || [], loading: false });
        }
    } catch (err) {
        set({ error: err.message || 'Error fetching today visitors', loading: false });
    }
  },

  approveCheckin: async (id) => {
    try {
        const response = await visitorService.approveCheckin(id);
        if (response.success) {
            // Update local state
            set((state) => ({
                visitors: state.visitors.map(v => v._id === id ? { ...v, status: 'invited' } : v)
            }));
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  checkinVisitor: async (id, data) => {
    try {
        const response = await visitorService.checkinVisitor(id, data);
        if (response.success) {
            set((state) => ({
                visitors: state.visitors.map(v => v._id === id ? { ...v, status: 'checked_in', ...response.data } : v)
            }));
            get().refreshStats();
            return response;
        }
    } catch (err) {
        throw err;
    }
  },

  checkoutVisitor: async (id) => {
    try {
        const response = await visitorService.checkoutVisitor(id);
        if (response.success) {
            set((state) => ({
                visitors: state.visitors.map(v => v._id === id ? { ...v, status: 'checked_out', ...response.data } : v)
            }));
            get().refreshStats();
            return response;
        }
    } catch (err) {
        throw err;
    }
  }
}));
