"use client";

import { useState } from "react";
import useDiscounts from "./useDiscounts";
import DiscountModal from "./DiscountModal";
import DiscountTable from "./DiscountTable";

export default function DiscountPage() {
  const {
    data,
    page,
    totalPages,
    create,
    update,
    remove,
    getOne,
    changePage,
  } = useDiscounts();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const handleEdit = async (id: number) => {
    try {
      const item = await getOne(id);
      setEditing(item);
      setShowModal(true);
    } catch (_) {
      setEditing(null);
      setShowModal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div >

        <DiscountTable
          data={data}
          page={page}
          totalPages={totalPages}
          onEdit={(item) => handleEdit(item.id)}
          onDelete={remove}
          onPrev={() => changePage(page - 1)}
          onNext={() => changePage(page + 1)}
        />
      </div>

      {showModal && (
        <DiscountModal
          item={editing}
          onClose={() => setShowModal(false)}
          onSave={async (dto) => {
            if (editing) await update(editing.id, dto);
            else await create(dto);
          }}
        />
      )}
    </div>
  );
}
