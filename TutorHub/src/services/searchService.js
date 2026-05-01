// searchService.js — src/services/
import axiosInstance from "./axiosInstance";

// ── Mock data — used until Day 11 SearchController is live ───
// Replace searchTutors() with real API call on Day 11
const MOCK_TUTORS = [
  {
    id: "usr-001",
    name: "Sara Ahmed",
    headline: "O-Level & A-Level Mathematics Expert",
    subjects: ["Mathematics", "Statistics"],
    gradeLevel: "A-Level",
    city: "Lahore",
    teachingMode: "Both",
    hourlyRateMin: 1200,
    hourlyRateMax: 1800,
    experienceYears: 5,
    averageRating: 4.9,
    totalReviews: 124,
    isVerified: true,
    initials: "SA",
    color: "bg-blue-500",
  },
  {
    id: "usr-002",
    name: "Ali Hassan",
    headline: "Chemistry & Biology — MDCAT Specialist",
    subjects: ["Chemistry", "Biology"],
    gradeLevel: "O-Level",
    city: "Karachi",
    teachingMode: "Online",
    hourlyRateMin: 900,
    hourlyRateMax: 1400,
    experienceYears: 3,
    averageRating: 4.8,
    totalReviews: 98,
    isVerified: true,
    initials: "AH",
    color: "bg-green-500",
  },
  {
    id: "usr-003",
    name: "Fatima Malik",
    headline: "English Literature & Urdu Language Coach",
    subjects: ["English", "Urdu"],
    gradeLevel: "Secondary",
    city: "Islamabad",
    teachingMode: "Online",
    hourlyRateMin: 700,
    hourlyRateMax: 1000,
    experienceYears: 4,
    averageRating: 5.0,
    totalReviews: 67,
    isVerified: false,
    initials: "FM",
    color: "bg-purple-500",
  },
  {
    id: "usr-004",
    name: "Omar Siddiqui",
    headline: "Physics & Computer Science — ICS & A-Level",
    subjects: ["Physics", "Computer Science"],
    gradeLevel: "A-Level",
    city: "Lahore",
    teachingMode: "Both",
    hourlyRateMin: 1500,
    hourlyRateMax: 2200,
    experienceYears: 7,
    averageRating: 4.7,
    totalReviews: 211,
    isVerified: true,
    initials: "OS",
    color: "bg-orange-500",
  },
  {
    id: "usr-005",
    name: "Hira Qureshi",
    headline: "Accounts & Economics — Cambridge Specialist",
    subjects: ["Accounting", "Economics"],
    gradeLevel: "O-Level",
    city: "Karachi",
    teachingMode: "InPerson",
    hourlyRateMin: 1000,
    hourlyRateMax: 1500,
    experienceYears: 4,
    averageRating: 4.6,
    totalReviews: 53,
    isVerified: true,
    initials: "HQ",
    color: "bg-pink-500",
  },
  {
    id: "usr-006",
    name: "Bilal Nawaz",
    headline: "Arabic & Islamiat — Hafiz with Teaching Degree",
    subjects: ["Arabic", "Islamiat"],
    gradeLevel: "Secondary",
    city: "Islamabad",
    teachingMode: "Both",
    hourlyRateMin: 600,
    hourlyRateMax: 900,
    experienceYears: 6,
    averageRating: 4.9,
    totalReviews: 89,
    isVerified: true,
    initials: "BN",
    color: "bg-teal-500",
  },
];

// ── searchTutors — use mock today, real API from Day 11 ───────
export const searchTutors = async (filters = {}) => {
  // TODO Day 11: replace mock with real call:
  // const params = new URLSearchParams(filters).toString();
  // const res = await axiosInstance.get(`/api/search/tutors?${params}`);
  // return res.data;   // { data: [...], total: N, page: N, pageSize: N }

  // MOCK: simulate network delay + apply client-side filtering
  await new Promise(r => setTimeout(r, 600));
  let results = [...MOCK_TUTORS];

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(kw) ||
      t.headline.toLowerCase().includes(kw) ||
      t.subjects.some(s => s.toLowerCase().includes(kw))
    );
  }
  if (filters.city) {
    results = results.filter(t =>
      t.city.toLowerCase() === filters.city.toLowerCase());
  }
  if (filters.teachingMode && filters.teachingMode !== "All") {
    results = results.filter(t =>
      t.teachingMode === filters.teachingMode || t.teachingMode === "Both");
  }
  if (filters.minRating) {
    results = results.filter(t =>
      t.averageRating >= parseFloat(filters.minRating));
  }
  if (filters.maxPrice) {
    results = results.filter(t =>
      t.hourlyRateMin <= parseInt(filters.maxPrice));
  }

  // Sort
  if (filters.sortBy === "price_asc")
    results.sort((a, b) => a.hourlyRateMin - b.hourlyRateMin);
  else if (filters.sortBy === "price_desc")
    results.sort((a, b) => b.hourlyRateMin - a.hourlyRateMin);
  else if (filters.sortBy === "experience")
    results.sort((a, b) => b.experienceYears - a.experienceYears);
  else
    results.sort((a, b) => b.averageRating - a.averageRating); // default: rating

  const page = parseInt(filters.page) || 1;
  const pageSize = 6;
  const total = results.length;
  const paged = results.slice((page - 1) * pageSize, page * pageSize);

  return { data: paged, total, page, pageSize };
};

// ── getSubjects — fetch all subjects for filter dropdown ──────
export const getSubjects = async () => {
  try {
    const res = await axiosInstance.get("/api/search/subjects");
    return res.data.data;
  } catch {
    // Fallback to hardcoded list if API not ready
    return [
      "Mathematics","Physics","Chemistry","Biology","Computer Science",
      "English","Urdu","Arabic","Islamiat","History","Geography",
      "Economics","Accounting","Business Studies","Psychology","Statistics",
      "Art","Music","Physical Education","Sociology"
    ];
  }
};
export const getGradeLevels = async () => {
  try {
    const res = await axiosInstance.get("/api/search/grade-levels");
    return res.data.data;
  } catch {
    return [
      "Primary (Grade 1-5)", "Secondary (Grade 6-10)",
      "O-Level", "A-Level", "University", "Other"
    ];
  }
};