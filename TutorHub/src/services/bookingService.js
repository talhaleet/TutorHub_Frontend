// bookingService.js -- src/services/
import axiosInstance from './axiosInstance';
// Student/Parent: Create new booking request
export const createBooking = async (data) => {
 const res = await axiosInstance.post('/api/booking', data);
 return res.data; // Returns { data: { id, status, totalAmount, ... } }
};
// Get single booking by ID
export const getBooking = async (id) => {
 const res = await axiosInstance.get(`/api/booking/${id}`);
 return res.data;
};
// Get all bookings for the logged-in user
export const getMyBookings = async () => {
 const res = await axiosInstance.get('/api/booking/my');
 return res.data;
};
// Tutor: confirm a pending booking
export const confirmBooking = async (id) => {
 const res = await axiosInstance.put(`/api/booking/${id}/confirm`);
 return res.data;
};
// Cancel a booking (student, parent, or tutor)
export const cancelBooking = async (id, reason) => {
 const res = await axiosInstance.put(`/api/booking/${id}/cancel`, { reason });
 return res.data;
};