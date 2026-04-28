// Pagination.jsx — src/components/common/

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Show page numbers with ellipsis for large page counts
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    if (currentPage > 3) pages.push('...');

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');

    pages.push(totalPages);

    return pages;
  };

  const btnClass = (active, disabled) =>
    `min-w-[36px] h-9 px-2 rounded-xl text-sm font-medium transition-all duration-200
    ${
      disabled
        ? 'opacity-40 cursor-not-allowed'
        : active
        ? 'bg-primary text-white shadow-card'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
    }`;

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={btnClass(false, currentPage === 1)}
      >
        ← Prev
      </button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`e${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={btnClass(page === currentPage, false)}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={btnClass(false, currentPage === totalPages)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;