// src/pages/admin/AdminNotificationsPage.tsx
"use client";
import { useEffect, useState } from "react";
import NotificationService from "@/service/notification/NotificationService";
import { toast } from "react-hot-toast";


interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newType, setNewType] = useState("booking");
    const [newUserId, setNewUserId] = useState<number | "">("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    //web push
    const [newBroadcastTitle, setNewBroadcastTitle] = useState("");
    const [newBroadcastMessage, setNewBroadcastMessage] = useState("");
    const [newBroadcastUrl, setNewBroadcastUrl] = useState("/");

    // =========================
    // Load all notifications
    // =========================
    const fetchNotifications = async (pageNum = page) => {
        try {
            setLoading(true);
            const res = await NotificationService.getAllNotifications(pageNum, limit);
            // Nếu API trả về { data, total }
            const data = res.data.data ?? res.data;
            const total = res.data.total ?? data.length;
            setNotifications(data.map((n: any) => ({
                ...n,
                userId: n.user?.id ?? 0
            })));
            setTotalPages(Math.ceil(total / limit));
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi tải notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page, limit]);

    const handleCreate = async () => {
        if (!newTitle || !newMessage || !newUserId) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        try {
            const res = await NotificationService.createNotification({
                title: newTitle,
                message: newMessage,
                type: newType,
                user_id: newUserId
            });
            setNotifications(prev => [{ ...res.data, userId: res.data.user.id }, ...prev]);
            setNewTitle("");
            setNewMessage("");
            setNewUserId("");
            toast.success("Tạo notification thành công");
        } catch (err) {
            console.error(err);
            toast.error("Tạo thất bại");
        }
    };

    // =========================
    // Xóa notification
    // =========================
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return;
        try {
            await NotificationService.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("Xóa thành công");
        } catch (err) {
            console.error(err);
            toast.error("Xóa thất bại, sản phẩm không tồn tại");
        }
    };

    // =========================
    // Bắt đầu sửa
    // =========================
    const startEdit = (noti: Notification) => {
        setEditingId(noti.id);
        setEditTitle(noti.title);
        setEditMessage(noti.message);
    };

    const handleSave = async (id: number) => {
        try {
            await NotificationService.updateNotification(id, {
                title: editTitle,
                message: editMessage,
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, title: editTitle, message: editMessage } : n
                )
            );
            setEditingId(null);
            toast.success("Cập nhật thành công");
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại , sản phẩm không tồn tại");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleBroadcast = async () => {
        if (!newBroadcastTitle || !newBroadcastMessage) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            await NotificationService.broadcastNotification({
                title: newBroadcastTitle,
                message: newBroadcastMessage,
                url: newBroadcastUrl,
                type: "system"
            });

            toast.success("Gửi thông báo đến toàn bộ user thành công!");

            // Clear
            setNewBroadcastTitle("");
            setNewBroadcastMessage("");
            setNewBroadcastUrl("/");

        } catch (err) {
            console.error(err);
            toast.error("Gửi thất bại");
        }
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Quản lý Notifications</h1>

            {/* Form thêm */}
            <div className="mb-4 p-4 bg-white rounded shadow">
                <h2 className="font-semibold mb-2">Thêm Notification mới</h2>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="number"
                        placeholder="User ID"
                        value={newUserId}
                        onChange={(e) => setNewUserId(+e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="border px-2 py-1 rounded flex-1"
                    />
                    <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="booking">Booking</option>
                        <option value="payment">Payment</option>
                        <option value="promotion">Promotion</option>
                        <option value="system">System</option>
                    </select>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Thêm
                    </button>
                </div>
            </div>

            {/* Bảng notifications */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Message</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                                <th className="px-4 py-2 text-sm font-medium text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notifications.map((noti) => (
                                <tr key={noti.id} className={noti.isRead ? "bg-gray-50" : "bg-white"}>
                                    <td className="px-4 py-2">{noti.id}</td>
                                    <td className="px-4 py-2">{noti.userId}</td>
                                    <td className="px-4 py-2">
                                        {editingId === noti.id ? (
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                        ) : (
                                            noti.title
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingId === noti.id ? (
                                            <input
                                                value={editMessage}
                                                onChange={(e) => setEditMessage(e.target.value)}
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                        ) : (
                                            noti.message
                                        )}
                                    </td>
                                    <td className="px-4 py-2 capitalize">{noti.type}</td>
                                    <td className="px-4 py-2">
                                        {noti.isRead ? (
                                            <span className="text-green-600 font-semibold">Đã đọc</span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Chưa đọc</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{new Date(noti.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        {editingId === noti.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSave(noti.id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(noti)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(noti.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {notifications.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                                        Chưa có thông báo nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Form broadcast notification */}
            <div className="mb-4 p-4 bg-white rounded shadow border border-blue-400">
                <h2 className="font-semibold mb-2 text-blue-600 text-lg">
                    Gửi thông báo đến tất cả người dùng
                </h2>

                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={newBroadcastTitle}
                        onChange={(e) => setNewBroadcastTitle(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                    />

                    <textarea
                        placeholder="Nội dung"
                        value={newBroadcastMessage}
                        onChange={(e) => setNewBroadcastMessage(e.target.value)}
                        className="border px-2 py-1 rounded w-full h-20"
                    />

                    <input
                        type="text"
                        placeholder="URL khi click (optional)"
                        value={newBroadcastUrl}
                        onChange={(e) => setNewBroadcastUrl(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                    />

                    <button
                        onClick={handleBroadcast}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Gửi cho toàn bộ user
                    </button>
                </div>
            </div>

        </div>
    );
}
