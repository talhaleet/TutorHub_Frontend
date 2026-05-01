// src/components/common/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visible = pages.filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      Math.abs(p - currentPage) <= 2
  );

  const btnBase =
    "rounded-md border border-gray-300 text-xs sm:text-sm font-medium transition " +
    "hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-2 py-3">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} px-2 sm:px-3 py-1.5 sm:py-2`}
      >
        Prev
      </button>

      {/* Pages */}
      {visible.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && visible[idx - 1] !== p - 1 && (
            <span className="px-1 text-gray-400 text-xs sm:text-sm">
              ...
            </span>
          )}

          <button
            onClick={() => onPageChange(p)}
            className={`${btnBase} px-2 sm:px-3 py-1.5 sm:py-2 min-w-[32px] sm:min-w-[40px]
              ${
                p === currentPage
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : ""
              }`}
          >
            {p}
          </button>
        </span>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} px-2 sm:px-3 py-1.5 sm:py-2`}
      >
        Next
      </button>
    </div>
  );
}