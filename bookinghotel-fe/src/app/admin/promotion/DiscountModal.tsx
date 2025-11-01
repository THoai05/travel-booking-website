"use client";
import { useState, useEffect } from "react";

export default function DiscountModal({ item, onClose, onSave }) {
    const [form, setForm] = useState({
        code: "",
        discountValue: "",
        startDate: "",
        endDate: "",
        status: "active",
    });

    // Khi bấm "Edit" thì tự động đổ data vào form
    useEffect(() => {
        if (item) {
            setForm({
                code: item.code,
                discountValue: item.discountValue,
                startDate: item.startDate,
                endDate: item.endDate,
                status: item.status,
            });
        } else {
            setForm({
                code: "",
                discountValue: "",
                startDate: "",
                endDate: "",
                status: "active",
            });
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.code || !form.discountValue || !form.startDate || !form.endDate) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-lg w-[400px] space-y-3"
            >
                <h2 className="text-lg font-semibold mb-2">
                    {item ? "Cập nhật mã khuyến mãi" : "Thêm mã khuyến mãi"}
                </h2>

                <input
                    placeholder="Mã khuyến mãi"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                />
                <input
                    placeholder="Giảm (%)"
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="w-1/2 border rounded-lg px-3 py-2"
                    />
                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className="w-1/2 border rounded-lg px-3 py-2"
                    />
                </div>

                <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {item ? "Lưu thay đổi" : "Thêm mới"}
                    </button>
                </div>
            </form>
        </div>
    );
}
