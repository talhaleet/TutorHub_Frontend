// src/components/common/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p =>
    p === 1 || p === totalPages ||
    Math.abs(p - currentPage) <= 2
  );
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        Prev
      </button>
      {visible.map((p, idx) => (
        <span key={p}>
          {idx > 0 && visible[idx-1] !== p - 1 && (
            <span className="px-1 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(p)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition
              ${p === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'}`}
          >{p}</button>
        </span>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        Next
         </button>
    </div>
  );
}