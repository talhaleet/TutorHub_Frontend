import axiosInstance from './axiosInstance';

// paymentService.js — src/services/
export const createPaymentIntent = async (bookingId) => {
 const res = await axiosInstance.post('/api/payment/create-intent', { bookingId });
 return res.data;
};
export const confirmPayment = async (paymentIntentId) => {
 const res = await axiosInstance.post('/api/payment/confirm', { paymentIntentId });
 return res.data;
};