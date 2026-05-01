// TutorAvailabilityGrid.jsx -- src/components/tutor/
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../services/axiosInstance';
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm
const TutorAvailabilityGrid = ({ tutorId }) => {
 const { data } = useQuery({
 queryKey: ['availability', tutorId],
 queryFn: async () => {
 const res = await axiosInstance.get(`/api/tutor/${tutorId}/availability-public`);
 return res.data.data;
 },
 });
 const available = new Set();
 (data || []).forEach(slot => {
 if (!slot.isBlocked) {
 const start = parseInt(slot.startTime.split(':')[0]);
 const end = parseInt(slot.endTime.split(':')[0]);
 for (let h = start; h < end; h++) available.add(`${slot.dayOfWeek}-${h}`);
 }
 });
 return (
 <div>
 <h3 className='text-lg font-bold mb-4'>Weekly Availability</h3>
 <div className='overflow-x-auto'>
 <div className='min-w-[600px]'>
 <div className='grid grid-cols-8 gap-1 mb-1'>
 <div className='text-xs text-neutral-400 p-1'>Time</div>
 {DAYS.map(d => <div key={d} className='text-xs text-center font-semibold p-1'>{d}</div>)}
 </div>
 {HOURS.map(h => (
 <div key={h} className='grid grid-cols-8 gap-1 mb-1'>
 <div className='text-xs text-neutral-400 text-right pr-2 py-1'>
 {h > 12 ? `${h-12}pm` : h === 12 ? '12pm' : `${h}am`}
 </div>
 {[0,1,2,3,4,5,6].map(dayIdx => (
 <div key={dayIdx}
 className={`h-7 rounded ${available.has(`${dayIdx}-${h}`)
 ? 'bg-green-400/70 hover:bg-green-500'
 : 'bg-neutral-100'}`} />
 ))}
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};
export default TutorAvailabilityGrid;