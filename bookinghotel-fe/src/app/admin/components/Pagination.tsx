"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  totalItemsLabel?: string; // optional, mặc định là "posts"
  maxPageButtons?: number;   // số lượng nút trang hiển thị, mặc định 5
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  total,
  limit,
  onPageChange,
  totalItemsLabel = "posts",
  maxPageButtons = 5,
}) => {
  const totalPages = Math.ceil(total / limit);

  // Tính toán dãy số trang hiển thị
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{total}</span> {totalItemsLabel}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded-lg ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
