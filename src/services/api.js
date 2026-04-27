import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = 'https://ofis-square-test-server.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    async (config) => {
        const { token, user } = useAuthStore.getState();
        const isPublicEndpoint = config.url.includes('/api/auth/community/login') || config.url.includes('/api/auth/community/send-otp');
        
        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Attach buildingId if available for scoping community requests
        if (user?.buildingId) {
            config.headers['x-building-id'] = user.buildingId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Auto logout on token expiration
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;

