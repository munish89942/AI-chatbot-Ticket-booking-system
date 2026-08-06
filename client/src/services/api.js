import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:3001/api';
    }
    return 'https://backend-production-1f7f.up.railway.app/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export const getMuseumInfo = () => api.get('/info');
export const getTickets = () => api.get('/tickets');
export const getSlots = () => api.get('/slots');
export const bookTicket = (bookingData) => api.post('/book', bookingData);
export const chatWithAI = (message, history) => api.post('/chat', { message, history });
export const createOrder = (orderData) => api.post('/payment/order', orderData);
export const verifyPayment = (paymentData) => api.post('/payment/verify', paymentData);

// Admin
export const getBookings = () => api.get('/admin/bookings');
export const updateTicket = (id, data) => api.post('/admin/tickets', { id, ...data });

export default api;
