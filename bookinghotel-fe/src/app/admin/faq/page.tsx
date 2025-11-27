"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from "@/service/faq/faqService";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    status: string;
    categories: string;
    created_at: string;
    updated_at: string;
}

interface FaqForm {
    question: string;
    answer: string;
    categories: string;
    status: string;
    updated_at?: string;
}

export default function AdminFAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [form, setForm] = useState<FaqForm>({
        question: "",
        answer: "",
        categories: "",
        status: "active",
        updated_at: "",
    });
    const toast = useRef<Toast>(null);

    const categoryOptions = [
        { label: "Tour du lịch", value: "Tour du lịch" },
        { label: "Hoạt động", value: "Hoạt động" },
        { label: "Điểm đến", value: "Điểm đến" },
        { label: "Đặt phòng khách sạn", value: "Đặt phòng khách sạn" },
        { label: "Thuê xe", value: "Thuê xe" },
        { label: "Bất động sản nghỉ dưỡng", value: "Bất động sản nghỉ dưỡng" },
        { label: "Đặt vé", value: "Đặt vé" },
    ];

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const data = await getAllFaqs();
            setFaqs(data);
        } catch (err) {
            console.error("Lỗi tải FAQ:", err);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = async (faq: FAQ) => {
        try {
            // Fetch dữ liệu mới nhất trước khi sửa
            const data = await getAllFaqs();
            setFaqs(data);

            const freshFaq = data.find(f => f.id === faq.id);
            if (!freshFaq) {
                toast.current?.show({ severity: "error", summary: "Lỗi", detail: "FAQ đã bị xóa." });
                return;
            }

            setEditingFaq(freshFaq);
            setForm({
                question: freshFaq.question,
                answer: freshFaq.answer,
                categories: freshFaq.categories,
                status: freshFaq.status,
                updated_at: freshFaq.updated_at, // thêm dòng này
            });
            setVisible(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            if (editingFaq) {
                await updateFaq(editingFaq.id, form); // form đã có updated_at
                toast.current?.show({ severity: "success", summary: "Thành công", detail: "Cập nhật FAQ thành công", life: 3000 });
            } else {
                await createFaq(form);
                toast.current?.show({ severity: "success", summary: "Thành công", detail: "Thêm FAQ mới thành công", life: 3000 });
            }

            setVisible(false);
            setEditingFaq(null);

            setForm({ question: "", answer: "", categories: "", status: "active" });

            fetchFaqs();
        } catch (err: any) {
            if (err.response?.status === 409) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Xung đột dữ liệu",
                    detail: err.response.data.message,
                    life: 5000,
                });
            } else {
                const msg = err.response?.data?.message || "Đã có lỗi xảy ra khi lưu FAQ.";
                toast.current?.show({ severity: "error", summary: "Lỗi", detail: msg, life: 5000 });
            }
        }



    };

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
            try {
                await deleteFaq(id);
                fetchFaqs();
                toast.current?.show({ severity: "success", summary: "Thành công", detail: "Xóa FAQ thành công", life: 3000 });
            } catch (err: any) {
                console.error("Lỗi xóa FAQ:", err);

                // Nếu phần tử không tồn tại nữa
                if (err.response?.status === 404) {
                    toast.current?.show({
                        severity: "warn",
                        summary: "Không tìm thấy",
                        detail: "Câu hỏi này đã bị xóa trước đó.",
                        life: 5000,
                    });
                } else {
                    const msg = err.response?.data?.message || "Đã có lỗi xảy ra khi xóa FAQ.";
                    toast.current?.show({ severity: "error", summary: "Lỗi", detail: msg, life: 5000 });
                }

                // Load lại danh sách để đồng bộ với server
                fetchFaqs();
            }
        }
    };


    const handleToggleStatus = async (faq: FAQ) => {
        try {
            const newStatus = faq.status === "active" ? "hidden" : "active";
            await updateFaq(faq.id, { status: newStatus });
            fetchFaqs();
        } catch (err: any) {
            console.error("Lỗi khi đổi trạng thái FAQ:", err);
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Đã có lỗi xảy ra khi đổi trạng thái FAQ.", life: 5000 });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center p-6 space-y-6">
                <Toast ref={toast} />
                <div>
                    <h1 className="text-black font-bold text-2xl">Quản lý FAQ</h1>
                    <p>Quản lý câu hỏi thường gặp hiển thị cho khách hàng</p>
                </div>
                <Button
                    label="Thêm câu hỏi"
                    icon="pi pi-plus"
                    onClick={() => {
                        setEditingFaq(null);
                        setForm({ question: "", answer: "", categories: "", status: "active" });
                        setVisible(true);
                    }}
                    className="!bg-black !rounded-lg !text-white font-semibold justify-center items-center shadow-md border !border-gray-200 hover:scale-105 transition"
                />
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center pb-5">
                    <h1>
                        <span className="pi pi-question-circle mr-2"></span>Danh sách câu hỏi
                    </h1>
                    <div className="px-3 py-1 bg-gray-200 text-black rounded-2xl">{faqs.length} câu hỏi</div>
                </div>

                {loading ? (
                    <p className="p-5 text-gray-500">Đang tải dữ liệu...</p>
                ) : faqs.length === 0 ? (
                    <p className="p-5 text-gray-500">Chưa có câu hỏi nào.</p>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="bg-white border border-gray-200 rounded-xl mb-5">
                            <div className="m-5">
                                <h1 className="text-xl font-semibold">{faq.question}</h1>
                                <p>{faq.answer}</p>
                                <p className="italic text-gray-500 text-sm mt-2">
                                    Danh mục: {faq.categories} • Trạng thái:{" "}
                                    <span
                                        className={`font-semibold ${faq.status === "active" ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {faq.status === "active" ? "Hiển thị" : "Ẩn"}
                                    </span>
                                </p>
                                <hr className="my-6 border-t border-gray-300" />
                                <div className="flex justify-between items-center">
                                    <p>
                                        Tạo: {new Date(faq.created_at).toLocaleDateString()} • Cập nhật:{" "}
                                        {new Date(faq.updated_at).toLocaleDateString()} • ID: #{faq.id}
                                    </p>
                                    <div className="flex !mr-2 !space-x-2">
                                        <Button
                                            label={faq.status === "active" ? "Ẩn" : "Hiện"}
                                            icon={faq.status === "active" ? "pi pi-eye-slash" : "pi pi-eye"}
                                            className="!bg-white w-22 h-10 !text-black border !border-gray-200"
                                            onClick={() => handleToggleStatus(faq)}
                                        />
                                        <Button
                                            label="Sửa"
                                            icon="pi pi-file-edit"
                                            className="!bg-white w-22 h-10 !text-black border !border-gray-200"
                                            onClick={() => openEditModal(faq)}
                                        />
                                        <Button
                                            label="Xóa"
                                            icon="pi pi-trash"
                                            className="!bg-red-500 w-22 h-10 !text-white border !border-gray-200"
                                            onClick={() => handleDelete(faq.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog
                header={editingFaq ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
                visible={visible}
                style={{ width: "500px" }}
                onHide={() => setVisible(false)}
            >
                <div className="flex flex-col gap-4 p-2">
                    <span className="p-float-label">
                        <InputText
                            id="question"
                            value={form.question}
                            onChange={(e) => setForm({ ...form, question: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="question">Câu hỏi</label>
                    </span>

                    <span className="p-float-label">
                        <InputTextarea
                            id="answer"
                            rows={4}
                            value={form.answer}
                            onChange={(e) => setForm({ ...form, answer: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="answer">Câu trả lời</label>
                    </span>

                    <span className="p-float-label">
                        <Dropdown
                            id="categories"
                            value={form.categories}
                            options={categoryOptions}
                            onChange={(e) => setForm({ ...form, categories: e.value })}
                            className="w-full"
                            placeholder="Chọn danh mục"
                        />
                        <label htmlFor="categories">Danh mục</label>
                    </span>

                    <Button label="Lưu" icon="pi pi-check" onClick={handleSave} className="!bg-black !text-white" />
                </div>
            </Dialog>
        </div>
    );
}
