"use client";
import { useState } from "react";
import useDiscounts from "./useDiscounts";
import DiscountTable from "./DiscountTable";
import DiscountModal from "./DiscountModal";

export default function DiscountPage() {
  const { data, create, update, remove } = useDiscounts();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h1 className="text-xl font-semibold mb-4">Quản lý mã khuyến mãi</h1>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
        >
          + Thêm mã mới
        </button>

        <DiscountTable data={data} onEdit={(item) => { setEditing(item); setShowModal(true); }} onDelete={remove} />
      </div>

      {showModal && (
        <DiscountModal
          item={editing}
          onClose={() => setShowModal(false)}
          onSave={(form) => {
            editing ? update(editing.id, form) : create(form);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
