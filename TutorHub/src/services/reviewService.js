// src/services/reviewService.js
import axiosInstance from "./axiosInstance";

// Get all reviews for a tutor
export const getTutorReviews = async (tutorId) => {
  try {
    const res = await axiosInstance.get(`/api/reviews/tutor/${tutorId}`);
    return res.data;
  } catch {
    return { data: [] };
  }
};

// (Optional) Add review
export const addReview = async (data) => {
  const res = await axiosInstance.post("/api/reviews", data);
  return res.data;
};