"use client";
import { useState } from "react";
import useDiscounts from "./useDiscounts";
import DiscountModal from "./DiscountModal";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function DiscountPage() {
    const { data, page, totalPages, changePage, create, update, remove } = useDiscounts();
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);  

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="bg-white rounded-2xl shadow-sm p-5">
                <h1 className="text-xl font-semibold mb-4">Quản lý mã khuyến mãi</h1>

                <button
                    onClick={() => { setEditing(null); setShowModal(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
                >
                    + Thêm mã mới
                </button>

                <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="py-3 px-4">Mã</th>
                                <th className="py-3 px-4">Giảm (%)</th>
                                <th className="py-3 px-4">Bắt đầu</th>
                                <th className="py-3 px-4">Kết thúc</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 text-blue-600 font-medium">{item.code}</td>
                                        <td className="py-3 px-4 text-green-600 font-semibold">{item.discountValue}%</td>
                                        <td className="py-3 px-4">{new Date(item.startDate).toLocaleDateString("vi-VN")}</td>
                                        <td className="py-3 px-4">{new Date(item.endDate).toLocaleDateString("vi-VN")}</td>
                                        <td className="py-3 px-4">{item.status === "active" ? "Active" : "Inactive"}</td>
                                        <td className="py-3 px-4 flex gap-3">
                                            <button onClick={() => { setEditing(item); setShowModal(true); }} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button
                                                onClick={() => {
                                                    const confirmDelete = window.confirm(
                                                        `Bạn có chắc chắn muốn xóa mã giảm giá "${item.code}" không?`
                                                    );
                                                    if (confirmDelete) remove(item.id);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="text-center py-5 text-gray-500">Không có mã giảm giá nào</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                        <button onClick={() => changePage(page - 1)} disabled={page <= 1} className="px-3 py-1.5 rounded-lg border text-sm">
                            <ChevronLeft size={16} /> Trước
                        </button>
                        <p className="text-gray-600 text-sm">Trang <span className="font-semibold">{page}</span> / {totalPages}</p>
                        <button onClick={() => changePage(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg border text-sm">
                            Sau <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <DiscountModal
                    item={editing}
                    onClose={() => setShowModal(false)}
                    onSave={editing ? (dto) => update(editing.id, dto) : create}
                />
            )}
        </div>
    );
}
