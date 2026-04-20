export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  variant = 'default' 
}) {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const buttonClass = variant === 'slim'
    ? 'px-3 py-1 font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
    : 'px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs';

  return (
    <div className="px-6 py-4 bg-surface-dim border-t-2 border-black">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Showing page {currentPage} of {totalPages}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={buttonClass}
          >
            ««
          </button>
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={buttonClass}
          >
            «
          </button>
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={buttonClass}
          >
            »
          </button>
          <button 
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={buttonClass}
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}
