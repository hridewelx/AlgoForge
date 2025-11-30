import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange, isDark = true }) => {
  const goToPage = (page) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const buttonClass = isDark
    ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-8">
      {/* First Page */}
      <button
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        title="First Page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-500/20"
                  : isDark
                    ? "bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Page */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        title="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        title="Last Page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
