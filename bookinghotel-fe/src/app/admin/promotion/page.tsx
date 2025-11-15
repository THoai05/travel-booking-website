"use client";
import { useState } from "react";
import useDiscounts from "./useDiscounts";
import DiscountTable from "./DiscountTable";
import DiscountModal from "./DiscountModal"; // Đảm bảo import này đúng

export default function DiscountPage() {
  // Lấy TẤT CẢ các giá trị và hàm cần thiết từ hook
  const {
    data,
    page,          
    totalPages,    
    changePage, 
    create,
    update,
    remove
  } = useDiscounts();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Định nghĩa hàm xử lý cho nút phân trang (như đã làm ở lần trước)
  const handlePrev = () => {
    changePage(page - 1);
  };

  const handleNext = () => {
    changePage(page + 1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h1 className="text-xl font-semibold mb-4">Quản lý mã khuyến mãi</h1>

        {/* Nút Thêm */}
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
        >
          + Thêm mã mới
        </button>

        <DiscountTable
          data={data}
          page={page}              // Truyền page
          totalPages={totalPages}  //  Truyền totalPages
          onPrev={handlePrev}      //  Truyền onPrev
          onNext={handleNext}      //  Truyền onNext
          onEdit={(item) => { setEditing(item); setShowModal(true); }}
          onDelete={remove}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <DiscountModal
          item={editing}
          onClose={() => setShowModal(false)}
          onSave={(form) => {
            // Gọi update hoặc create
            editing ? update(editing.id, form) : create(form);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}