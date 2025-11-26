"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { toast } from "react-hot-toast";
import { FiTrash2, FiRefreshCw, FiUserCheck, FiHome, FiCreditCard, FiGift, FiCheckSquare, } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";


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

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { user, setUser } = useAuth();


    // Modal chi tiết
    const [detailId, setDetailId] = useState<number | null>(null);
    const [detailData, setDetailData] = useState<Notification | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Tìm kiếm & lọc
    const [searchTitle, setSearchTitle] = useState("");
    const [filterType, setFilterType] = useState("");

    // 🔹 Lấy userId
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await api.get("auth/profile");
                if (res.data?.id) setUserId(res.data.id);
                else {
                    toast.error("Vui lòng đăng nhập lại! Không tìm thấy thông tin người dùng!");
                    setUser(null);
                }
            } catch {
                toast.error("Vui lòng đăng nhập lại! Không thể lấy thông tin người dùng!");
                setUser(null);
            }
        };
        fetchUserId();
    }, []);

    // 🔹 Load thông báo
    // 🔹 Load thông báo
    const loadNotifications = async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/notifications/user/${userId}`);
            setNotifications(res.data);
        } catch {
            toast.error("Không thể tải thông báo!");
        }
    };

    useEffect(() => {
        if (!userId) return;

        // 🔥 Gọi ngay lần đầu
        loadNotifications();

        // 🔥 Lặp lại mỗi 3 giây
        const interval = setInterval(() => {
            loadNotifications();
        }, 3000);

        // 🔥 Clear interval khi component unmount
        return () => clearInterval(interval);

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

    // 🔹 Filter & pagination
    const filteredNotifications = notifications
        .filter(
            (n) =>
                n.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
                (filterType === "" || n.type === filterType)
        );

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPaginationNumbers = () => {
        const pages: (number | string)[] = [];
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
            const res = await api.get(`/notifications/detail/${id}`);
            setDetailData(res.data);

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

    const closeDetail = () => {
        setDetailId(null);
        setDetailData(null);
    };

    // 🔹 Chọn tất cả
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedNotifications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedNotifications.map((n) => n.id));
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-6" onClick={() => toast.dismiss()}>
            {/* Tìm kiếm & lọc */}
            <div className="w-full max-w-2xl flex flex-col gap-2 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo tiêu đề..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />


            </div>

            <div className="relative w-full max-w-2xl mb-4">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-[3px] text-left flex justify-between items-center shadow-sm hover:border-blue-400 focus:outline-none"
                >
                    {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "Tất cả loại"}
                    <span className="ml-2">▾</span>
                </button>

                {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[3px] shadow-lg">
                        {["", "booking", "payment", "promotion"].map((type) => (
                            <div
                                key={type}
                                onClick={() => {
                                    setFilterType(type);
                                    setDropdownOpen(false);
                                }}
                                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${filterType === type ? "bg-blue-50 font-semibold" : ""
                                    }`}
                            >
                                {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Tất cả loại"}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hàng nút chức năng */}
            <div className="flex w-full gap-4 mb-6">
                <button
                    onClick={loadNotifications}
                    disabled={loading}
                    className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-[5px] hover:bg-gray-100 transition text-sm"
                >
                    <FiRefreshCw className="text-xl" />
                    {loading ? "Đang tải..." : "Load data"}
                </button>

                <button
                    onClick={toggleSelectAll}
                    className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-[5px] hover:bg-gray-100 transition text-sm"
                >
                    <FiCheckSquare className="text-xl" />
                    {selectedIds.length === paginatedNotifications.length
                        ? "Bỏ chọn tất cả"
                        : "Chọn tất cả"}
                </button>

                <button
                    onClick={markSelectedAsRead}
                    disabled={selectedIds.length === 0}
                    className={`flex-1 flex justify-center items-center gap-2 border shadow px-4 py-2 rounded-[5px] transition text-sm
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
                    className={`flex-1 flex justify-center items-center gap-2 border shadow px-4 py-2 rounded-[5px] transition text-sm
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
            <div className="w-full max-w-2xl flex flex-col gap-3">
                {paginatedNotifications.map((n) => (
                    <div
                        key={n.id}
                        className={`p-3 rounded-[5px] border border-gray-300 shadow-sm flex justify-between items-start transition cursor-pointer
        ${n.isRead ? "bg-white" : "bg-blue-50"}
        ${selectedIds.includes(n.id)
                                ? "border-blue-500 ring-1 ring-blue-200"
                                : "hover:border-blue-400"
                            }`}
                    >
                        {/* Icon và nội dung */}
                        <div onClick={() => openDetail(n.id)} className="flex gap-3 items-start">
                            {/* Icon theo loại thông báo */}
                            <div className="text-2xl mt-1">
                                {n.type === "booking" && <FiHome />}
                                {n.type === "payment" && <FiCreditCard />}
                                {n.type === "promotion" && <FiGift />}
                                {!["booking", "payment", "promotion"].includes(n.type) && "🔔"}
                            </div>

                            {/* Nội dung chính */}
                            <div className="flex flex-col">
                                <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                                    {n.title || "Tiêu đề"}
                                </h3>
                                <p className="text-xs text-gray-500 mb-1 capitalize">
                                    {n.type}
                                </p>
                                <p className="text-gray-700 text-sm">
                                    {n.message.length > 100 ? n.message.substring(0, 100) + "..." : n.message}
                                </p>
                            </div>
                        </div>

                        {/* Thời gian và checkbox */}
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-400">
                                {new Date(n.createdAt).toLocaleString("vi-VN", { hour12: false })}
                            </span>

                            <input
                                type="checkbox"
                                checked={selectedIds.includes(n.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelect(n.id); }}
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                            />
                        </div>
                    </div>
                ))}

                {filteredNotifications.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-6">Không có thông báo nào.</p>
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
                <div className="fixed inset-0 bg-black/40 flex justify-center items-start p-4 overflow-auto z-50">
                    <div className="bg-white rounded-[5px] p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
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
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{detailData.title || "Tiêu đề"}</h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    Loại thông báo: <span className="font-medium text-gray-700 capitalize">{detailData.type}</span>
                                </p>
                                <p className="text-gray-700 mb-4">{detailData.message}</p>
                                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[21/9]">
                                    <img
                                        src="/images/pexels-muffin-2468773.jpg"
                                        alt="Muffin"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-gray-700 mb-4"></p>
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
