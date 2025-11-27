"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

interface Props {
    item?: any;
    onClose: () => void;
    onSave: (dto: any) => Promise<void>;
}

export default function DiscountModal({ item, onClose, onSave }: Props) {
    const [form, setForm] = useState({
        code: "",
        discountValue: "",
        startDate: "",
        endDate: "",
        status: "active",
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    // Xác định status theo ngày
    const determineStatus = (start: string, end: string) => {
        const now = new Date();
        if (!start || !end) return "active";
        const s = new Date(start);
        const e = new Date(end);
        return now < s || now > e ? "inactive" : "active";
    };

    // Auto-fill form khi edit
    useEffect(() => {
        if (item) {
            setForm({
                code: item.code || "",
                discountValue: item.discountValue?.toString() || "",
                startDate: item.startDate?.slice(0, 10) || "",
                endDate: item.endDate?.slice(0, 10) || "",
                status: determineStatus(item.startDate, item.endDate),
            });
        } else {
            setForm({ code: "", discountValue: "", startDate: "", endDate: "", status: "active" });
        }
    }, [item]);

    // Realtime validation
    useEffect(() => {
        const errs: any = {};
        if (!form.code.trim()) errs.code = "Mã khuyến mãi không được để trống";
        if (!form.discountValue || Number(form.discountValue) <= 0)
            errs.discountValue = "Giá trị giảm phải lớn hơn 0";
        if (!form.startDate) errs.startDate = "Ngày bắt đầu là bắt buộc";
        if (!form.endDate) errs.endDate = "Ngày kết thúc là bắt buộc";
        if (form.startDate && form.endDate && form.endDate < form.startDate)
            errs.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        setErrors(errs);
    }, [form]);

    // Auto-update status khi đổi ngày
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            status: determineStatus(form.startDate, form.endDate)
        }));
    }, [form.startDate, form.endDate]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Tính lại errors ngay trước submit
        const currentErrors: any = {};
        if (!form.code.trim()) currentErrors.code = "Mã khuyến mãi không được để trống";
        if (!form.discountValue || Number(form.discountValue) <= 0)
            currentErrors.discountValue = "Giá trị giảm phải lớn hơn 0";
        if (!form.startDate) currentErrors.startDate = "Ngày bắt đầu là bắt buộc";
        if (!form.endDate) currentErrors.endDate = "Ngày kết thúc là bắt buộc";
        if (form.startDate && form.endDate && form.endDate < form.startDate)
            currentErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            toast.error("Vui lòng kiểm tra các trường lỗi!");
            return;
        }

        setLoading(true);
        try {
            const dto = {
                code: form.code.trim(),
                discountValue: Number(form.discountValue),
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
                status: determineStatus(form.startDate, form.endDate),
            };
            await onSave(dto);
            // toast.success(item ? "Cập nhật thành công!" : "Tạo mới thành công!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={true} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-black/20 flex justify-center items-center z-50">
                        <span className="loader border-t-4 border-blue-600 w-10 h-10 rounded-full animate-spin"></span>
                    </div>
                )}

                <Dialog.Title className="text-lg font-semibold mb-2">
                    {item ? "Cập nhật mã khuyến mãi" : "Thêm mã khuyến mãi"}
                </Dialog.Title>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Mã khuyến mãi"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className={`w-full border px-3 py-2 rounded-lg ${errors.code ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.code && <p className="text-red-500 text-xs">{errors.code}</p>}

                    <input
                        type="number"
                        placeholder="Giảm (%)"
                        value={form.discountValue}
                        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        className={`w-full border px-3 py-2 rounded-lg ${errors.discountValue ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.discountValue && <p className="text-red-500 text-xs">{errors.discountValue}</p>}

                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className={`w-1/2 border px-3 py-2 rounded-lg ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
                        />
                        <input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            className={`w-1/2 border px-3 py-2 rounded-lg ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>
                    {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                    {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate}</p>}

                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full border px-3 py-2 rounded-lg"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            {item ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}
