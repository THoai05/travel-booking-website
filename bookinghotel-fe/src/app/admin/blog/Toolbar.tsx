"use client";
import { FaSearch, FaTrash } from "react-icons/fa";

interface ToolbarProps {
  query: string;
  setQuery: (q: string) => void;
  showPublicOnly: boolean;
  setShowPublicOnly: (v: boolean) => void;
  selectedCount: number;
  totalFiltered: number;
  onSelectAll: () => void;
  selectAll: boolean;
  onDeleteSelected: () => void;
}

export default function Toolbar({
  query,
  setQuery,
  showPublicOnly,
  setShowPublicOnly,
  selectedCount,
  totalFiltered,
  onSelectAll,
  selectAll,
  onDeleteSelected,
}: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label className="relative w-full sm:w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài viết hoặc tác giả..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
        </label>

        <label className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
          <input
            type="checkbox"
            checked={showPublicOnly}
            onChange={() => setShowPublicOnly(!showPublicOnly)}
          />
          <span className="text-sm text-gray-600">Public only</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4"
            onChange={onSelectAll}
            checked={selectedCount > 0 && selectedCount === totalFiltered}
          />
          <span>{selectedCount} selected</span>
        </div>

        <button
          onClick={onDeleteSelected}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm 
            font-medium transition shadow-sm ${
              selectedCount > 0
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
        >
          <FaTrash className="text-base" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
