import axios from 'axios';

// Mock Data
export const MOCK_BOOKINGS = [
  {
    id: '1',
    roomName: 'Meeting Room 1',
    capacity: 4,
    memberName: 'Ritik Kansal',
    memberLocation: 'Sohna...',
    startTime: '20 Mar 9:00 AM',
    endTime: '20 Mar 4:00 PM',
    status: 'BOOKED', // BOOKED, COMPLETED, CANCELLED, ONGOING
    invoiceStatus: 'Paid',
    attendees: 3,
    notes: 'Project kickoff meeting',
    catering: ['Coffee', 'Snacks'],
    visitors: [{ name: 'John Doe', email: 'john@example.com' }]
  },
  {
    id: '2',
    roomName: 'Meeting Room 2',
    capacity: 4,
    memberName: 'Nasir Ansari',
    memberLocation: 'Empir...',
    startTime: '21 Mar 10:00 AM',
    endTime: '21 Mar 11:00 AM',
    status: 'COMPLETED',
    invoiceStatus: 'Pending',
    attendees: 2,
    notes: 'Client follow-up',
    catering: [],
    visitors: []
  }
];

const API_BASE_URL = 'https://api.example.com'; // Placeholder

const bookingApi = {
  getBookings: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: MOCK_BOOKINGS }), 1000);
    });
  },
  createBooking: async (booking) => {
    return axios.post(`${API_BASE_URL}/bookings`, booking);
  },
  updateBooking: async (id, booking) => {
    return axios.put(`${API_BASE_URL}/bookings/${id}`, booking);
  },
  deleteBooking: async (id) => {
    return axios.delete(`${API_BASE_URL}/bookings/${id}`);
  }
};

export default bookingApi;
