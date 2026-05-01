// TutorProfilePage.jsx -- src/pages/
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTutorProfile } from '../services/tutorService';
import TutorAvailabilityGrid from '../components/tutor/TutorAvailabilityGrid';
import TutorReviewList from '../components/tutor/TutorReviewList';
const AVATAR_COLORS = [
 'bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500',
 'bg-pink-500','bg-teal-500','bg-red-500','bg-indigo-500',
];
const TutorProfilePage = () => {
 const { id } = useParams();
 const [activeTab, setActiveTab] = useState('about');
 const { data, isLoading, isError } = useQuery({
 queryKey: ['tutor', id],
 queryFn: () => getTutorProfile(id),
 staleTime: 1000 * 60 * 5,
 });
 const tutor = data?.data;
 if (isLoading) return <div className='flex items-center justify-center min-h-screen'>
 <div className='w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
 </div>;
 if (isError || !tutor) return <div className='text-center py-20'>
 <p className='text-2xl font-bold'>Tutor not found</p>
 <Link to='/search' className='text-primary font-semibold'>Back to search</Link>
 </div>;
 const initials = (tutor.fullName||'').split(' ').map(n=>n[0]).join('').slice(0,2);
 const avatarColor = AVATAR_COLORS[(tutor.userId?.charCodeAt(0)||0) % AVATAR_COLORS.length];
 const TABS = ['about', 'availability', 'reviews'];
 return (
 <div className='min-h-screen bg-neutral-50'>
  {/* Hero Section */}
 <div className='bg-gradient-to-br from-primary to-blue-800 pt-12 pb-20 px-4'>
 <div className='max-w-4xl mx-auto'>
 <Link to='/search' className='text-blue-300 hover:text-white text-sm mb-6 inline-block'>
 Back to search results
 </Link>
 <div className='flex flex-col sm:flex-row items-start gap-6 mt-4'>
 <div className={`w-24 h-24 ${avatarColor} rounded-3xl flex items-center justify-center`}>
 <span className='text-3xl font-bold text-white'>{initials}</span>
 </div>
 <div className='flex-1'>
 <h1 className='text-3xl font-bold text-white'>{tutor.fullName}</h1>
 <p className='text-blue-200 text-lg'>{tutor.headline}</p>
 <div className='flex gap-4 text-sm text-blue-200 mt-2'>
 <span>Rating: {tutor.averageRating?.toFixed(1)}</span>
 <span>City: {tutor.city}</span>
 <span>Exp: {tutor.experienceYears}yrs</span>
 </div>
 <div className='flex gap-3 mt-5'>
 <Link to={`/book/${tutor.userId}`}
 className='px-6 py-3 bg-white text-primary font-bold rounded-xl'>
 Book Session
 </Link>
 </div>
 </div>
 <div className='bg-white/10 rounded-2xl p-5 text-center'>
 <p className='text-blue-200 text-xs uppercase'>Hourly Rate</p>
 <p className='text-3xl font-bold text-white'>
 PKR {tutor.hourlyRateMin?.toLocaleString()}
 </p>
 <p className='text-blue-300 text-sm'>-- {tutor.hourlyRateMax?.toLocaleString()}/hr</p>
 </div>
 </div>
 </div>
 </div>
 {/* Tab Content */}
 <div className='-mt-10 max-w-4xl mx-auto px-4 pb-16'>
 <div className='bg-white rounded-3xl shadow-xl overflow-hidden'>
 <div className='flex border-b border-neutral-100'>
 {TABS.map(tab => (
 <button key={tab} onClick={() => setActiveTab(tab)}
 className={`flex-1 py-4 text-sm font-semibold capitalize
 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}>
 {tab}
 </button>
 ))}
 </div>
 <div className='p-8'>
 {activeTab === 'about' && (
 <div className='space-y-6'>
 <div className='flex flex-wrap gap-2'>
 {tutor.subjects?.map(s => (
 <span key={s} className='px-4 py-2 bg-primary/10 text-primary text-sm font-semibold roundedfull'>
 {s}
 </span>
 ))}
 </div>
 <p className='text-neutral-600 leading-relaxed'>{tutor.bio}</p>
 </div>
 )}
 {activeTab === 'availability' && <TutorAvailabilityGrid tutorId={tutor.userId} />}
 {activeTab === 'reviews' && <TutorReviewList tutorId={tutor.userId}
 rating={tutor.averageRating} totalReviews={tutor.totalReviews} />}
 </div>
 </div>
 </div>
 </div>
 );
};
export default TutorProfilePage;