// src/components/common/StarRating.jsx
export default function StarRating({ value = 0, onChange, readonly = false, size = 18 }) {
  const stars = [1,2,3,4,5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map(star => (
        <svg key={star}
          style={{ width: size, height: size, cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => !readonly && onChange?.(star)}
          fill={star <= Math.round(value) ? '#F59E0B' : '#E5E7EB'}
          viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0
            00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118
            l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0
            l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118
            L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}