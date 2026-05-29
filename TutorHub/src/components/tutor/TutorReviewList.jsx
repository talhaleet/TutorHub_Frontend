// TutorReviewList.jsx -- src/components/tutor/
import { useQuery } from '@tanstack/react-query';
import { getTutorReviews } from '../../services/reviewService';
import { format } from 'date-fns';
const StarBar = ({ count, total, label }) => {
 const pct = total > 0 ? Math.round((count / total) * 100) : 0;
 return (
 <div className='flex items-center gap-3 text-sm'>
 <span className='text-neutral-500 w-8 text-right'>{label}*</span>
 <div className='flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden'>
 <div className='h-2 bg-yellow-400 rounded-full' style={{ width: `${pct}%` }} />
 </div>
 <span className='text-neutral-400 w-8'>{pct}%</span>
 </div>
 );
};
const TutorReviewList = ({ tutorId, rating, totalReviews }) => {
 const { data } = useQuery({
 queryKey: ['reviews', tutorId],
 queryFn: () => getTutorReviews(tutorId),
 retry: false,
 });
 const reviews = data?.data || [];
 const counts = { 5:0, 4:0, 3:0, 2:0, 1:0 };
 reviews.forEach(r => { counts[r.rating] = (counts[r.rating]||0)+1; });
 return (
 <div>
 <div className='flex gap-8 mb-8'>
 <div className='text-center'>
 <div className='text-6xl font-bold'>{rating?.toFixed(1)||'--'}</div>
 <div className='text-neutral-500 text-sm'>{totalReviews} reviews</div>
 </div>
 <div className='flex-1 space-y-2'>
 {[5,4,3,2,1].map(n => (
 <StarBar key={n} count={counts[n]} total={totalReviews} label={n} />
 ))}
 </div>
 </div>
 {reviews.length === 0 ? (
 <p className='text-center py-12 text-neutral-400'>No reviews yet.</p>
 ) : (
 <div className='space-y-4'>
 {reviews.map(review => (
 <div key={review.id} className='bg-neutral-50 rounded-2xl p-5 border'>
 <div className='flex justify-between'>
 <div>
 <p className='font-semibold'>{review.studentName || 'Anonymous'}</p>
 <p className='text-yellow-400'>{('*').repeat(review.rating)}</p>
 </div>
 <p className='text-xs text-neutral-400'>
 {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : ''}
 </p>
 </div>
 {review.comment && <p className='text-neutral-600 text-sm mt-3'>{review.comment}</p>}
 </div>
 ))}
 </div>
 )}
 </div>
 );
};
export default TutorReviewList;