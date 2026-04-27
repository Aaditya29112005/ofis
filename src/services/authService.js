import api from './api';

const authService = {
  /**
   * Sends OTP to the specified phone number.
   * @param {string} phone 10-digit mobile number.
   */
  sendOtp: async (phone) => {
    try {
      const response = await api.post('/api/auth/community/send-otp', { phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verifies OTP and logs in the user.
   * @param {string} phone 10-digit mobile number.
   * @param {string} otp 6-digit verification code.
   */
  login: async (phone, otp) => {
    try {
      const response = await api.post('/api/auth/community/login', { phone, otp });
      return response.data; // { success, accessToken, user }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
