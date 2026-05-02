// PriceBreakdown.jsx -- src/components/payment/
const PLATFORM_FEE_PERCENT = 10;
const PriceBreakdown = ({ hourlyRateMin = 0, durationMinutes = 60 }) => {
 const hours = durationMinutes / 60;
 const sessionFee = Math.round(hourlyRateMin * hours);
 const platformFee = Math.round(sessionFee * PLATFORM_FEE_PERCENT / 100);
 const total = sessionFee + platformFee;
 const fmt = (n) => `PKR ${n.toLocaleString()}`;
 return (
 <div className='bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-5
 border border-primary/20'>
 <p className='text-sm font-bold text-neutral-700 mb-4'>Price Breakdown</p>
 <div className='space-y-3'>
 <div className='flex justify-between text-sm'>
 <span className='text-neutral-500'>
 Session Fee ({durationMinutes} min × {fmt(hourlyRateMin)}/hr)
 </span>
 <span className='font-semibold'>{fmt(sessionFee)}</span>
 </div>
 <div className='flex justify-between text-sm'>
 <span className='text-neutral-500'>
 Platform Fee ({PLATFORM_FEE_PERCENT}%)
 </span>
 <span className='font-semibold text-orange-600'>+{fmt(platformFee)}</span>
 </div>
 <div className='h-px bg-primary/20' />
 <div className='flex justify-between'>
 <span className='font-bold text-neutral-800'>Total</span>
 <span className='text-xl font-bold text-primary'>{fmt(total)}</span>
 </div>
 </div>
 <p className='text-xs text-neutral-400 mt-3'>
 Payment is processed securely via Stripe.
 Platform fee covers student support & guarantee.
 </p>
 </div>
 );
};
export default PriceBreakdown;