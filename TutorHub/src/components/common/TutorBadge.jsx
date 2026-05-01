// src/components/tutor/TutorBadge.jsx
export default function TutorBadge() {
  return (
     <span className="inline-flex items-center gap-1 bg-blue-600 text-white
      text-xs font-semibold px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293
          a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2
          a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      Verified
    </span>
  );
}