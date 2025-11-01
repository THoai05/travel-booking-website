"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { toast } from "react-hot-toast";
import { FiTrash2, FiRefreshCw, FiUserCheck } from "react-icons/fi";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    createdAt: string;
    isRead: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Mở modal chi tiết
    const [detailId, setDetailId] = useState<number | null>(null);
    const [detailData, setDetailData] = useState<Notification | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    // 🔹 Lấy userId
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await api.get("auth/profile");
                if (res.data?.id) setUserId(res.data.id);
                else toast.error("Không tìm thấy thông tin người dùng!");
            } catch {
                toast.error("Không thể lấy thông tin người dùng!");
            }
        };
        fetchUserId();
    }, []);

    // 🔹 Load thông báo
    const loadNotifications = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const res = await api.get(`/notifications/user/${userId}`);
            setNotifications(res.data);
        } catch {
            toast.error("Không thể tải thông báo!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadNotifications();
    }, [userId]);

    // 🔹 Toggle chọn
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // 🔹 Đánh dấu đã đọc
    const markSelectedAsRead = async () => {
        if (selectedIds.length === 0) return;
        try {
            for (const id of selectedIds) await api.patch(`/notifications/${id}/read`);
            toast.success("Đã đánh dấu là đã đọc!");
            setNotifications((prev) =>
                prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: true } : n))
            );
            setSelectedIds([]);
        } catch {
            toast.error("Không thể cập nhật trạng thái!");
        }
    };

    // 🔹 Xóa thông báo
    const deleteSelected = async () => {
        if (selectedIds.length === 0) return;
        try {
            for (const id of selectedIds) await api.delete(`/notifications/${id}`);
            toast.success("Đã xóa thông báo đã chọn!");
            setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
            setSelectedIds([]);
        } catch {
            toast.error("Không thể xóa thông báo!");
        }
    };

    // 🔹 Lấy danh sách thông báo theo trang
    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 🔹 Tạo danh sách số trang kiểu “…” truncated
    const getPaginationNumbers = () => {
        const pages: (number | string)[] = [];
        const totalNumbers = 4; // số trang trung tâm muốn hiển thị
        const total = totalPages;

        if (total <= 6) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(total - 1, currentPage + 2);

            if (start > 2) pages.push("...");
            else start = 2;

            for (let i = start; i <= end; i++) pages.push(i);
            if (end < total - 1) pages.push("...");
            pages.push(total);
        }
        return pages;
    };

    // 🔹 Xem chi tiết thông báo
    const openDetail = async (id: number) => {
        try {
            setDetailLoading(true);
            const res = await api.get(`/notifications/${id}`);
            setDetailData(res.data);

            // Tự động đánh dấu đã đọc
            if (!res.data.isRead) {
                await api.patch(`/notifications/${id}/read`);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
                );
            }

            setDetailId(id);
        } catch {
            toast.error("Không thể lấy chi tiết thông báo!");
        } finally {
            setDetailLoading(false);
        }
    };

    // 🔹 Đóng modal
    const closeDetail = () => {
        setDetailId(null);
        setDetailData(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6" onClick={() => toast.dismiss()}>
            {/* Thanh tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm trong thư"
                className="w-full max-w-2xl p-2 rounded border border-gray-300 mb-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Hàng nút chức năng */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={loadNotifications}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <FiRefreshCw className="text-xl" />
                    {loading ? "Đang tải..." : "Load dữ liệu"}
                </button>

                <button
                    onClick={markSelectedAsRead}
                    disabled={selectedIds.length === 0}
                    className={`flex items-center gap-2 border shadow px-4 py-2 rounded-lg transition
                        ${selectedIds.length === 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
                        }`}
                >
                    <FiUserCheck className="text-xl" />
                    Đã đọc
                </button>

                <button
                    onClick={deleteSelected}
                    disabled={selectedIds.length === 0}
                    className={`flex items-center gap-2 border shadow px-4 py-2 rounded-lg transition
                        ${selectedIds.length === 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 hover:bg-gray-100 text-red-500"
                        }`}
                >
                    <FiTrash2 className="text-xl" />
                    Xóa
                </button>
            </div>

            {/* Danh sách thông báo */}
            <div className="w-full max-w-2xl flex flex-col gap-4">
                {paginatedNotifications.map((n) => (
                    <div
                        key={n.id}

                        className={`p-4 rounded-xl border shadow-sm flex justify-between items-start transition cursor-pointer
                        ${n.isRead ? "bg-white" : "bg-blue-50"}
                        ${selectedIds.includes(n.id)
                                ? "border-blue-500 ring-2 ring-blue-300"
                                : "border-gray-200 hover:border-blue-400"
                            }`}
                    >
                        <div onClick={() => openDetail(n.id)}>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {n.title || "Tiêu đề"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                                Loại thông báo:{" "}
                                <span className="font-medium text-gray-700 capitalize">
                                    {n.type}
                                </span>
                            </p>
                            <p className="text-gray-700 text-sm">{n.message}</p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-sm text-gray-500">
                                {new Date(n.createdAt).toLocaleString("vi-VN", {
                                    hour12: false,
                                })}
                            </span>

                            <input
                                type="checkbox"
                                checked={selectedIds.includes(n.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelect(n.id); }}
                                className="w-5 h-5 accent-blue-600 cursor-pointer"
                            />
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && !loading && (
                    <p className="text-center text-gray-500">
                        Không có thông báo nào.
                    </p>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {getPaginationNumbers().map((num, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof num === "number" && setCurrentPage(num)}
                            disabled={num === "..."}
                            className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal chi tiết */}
            {detailId && detailData && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                        <button
                            onClick={closeDetail}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
                        >
                            ×
                        </button>
                        {detailLoading ? (
                            <p className="text-center text-gray-500">Đang tải chi tiết...</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    {detailData.title || "Tiêu đề"}
                                </h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    Loại thông báo:{" "}
                                    <span className="font-medium text-gray-700 capitalize">
                                        {detailData.type}
                                    </span>
                                </p>
                                <p className="text-gray-700 mb-4">{detailData.message}</p>
                                <span className="text-sm text-gray-500">
                                    {new Date(detailData.createdAt).toLocaleString("vi-VN", { hour12: false })}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
