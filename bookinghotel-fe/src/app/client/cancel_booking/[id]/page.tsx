"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function CancelBookingPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params?.id;

    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [refundPreview, setRefundPreview] = useState<number | null>(null);
    const [completedRefund, setCompletedRefund] = useState<number | null>(null);

    const suggestions = [
        "Tôi đặt nhầm ngày",
        "Tôi tìm được nơi khác phù hợp hơn",
        "Giá chưa hợp lý",
        "Thay đổi kế hoạch cá nhân",
        "Khách sạn phản hồi quá chậm",
    ];

    // Lấy preview hoàn tiền
    useEffect(() => {
        if (!bookingId) return;

        const fetchRefundPreview = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3636/bookings/${bookingId}/refund-preview`
                );
                setRefundPreview(res.data?.refundAmount || 0);
            } catch (err) {
                console.error("Lấy preview hoàn tiền thất bại:", err);
                setRefundPreview(null);
            }
        };

        fetchRefundPreview();
    }, [bookingId]);

    // Hủy + tự động hoàn tiền
    const handleCancelAndRefund = async () => {
        if (!reason) {
            toast.error("Bạn phải nhập lý do hủy nhaaa ");
            return;
        }

        try {
            setLoading(true);

            // 1️⃣ Hủy booking
            await axios.patch(
                `http://localhost:3636/bookings/${bookingId}/cancel`,
                { reason }
            );

            // 2️⃣ Thực thi hoàn tiền
            const refundRes = await axios.post(
                `http://localhost:3636/bookings/${bookingId}/refund-execute`
            );

            // FIX: Đọc đúng key 'refundAmount' từ Backend trả về
            // Backend trả về: { refundAmount: 123000, ... }
            const finalAmount = refundRes.data?.refundAmount ?? 0;

            setCompletedRefund(finalAmount);

            toast.success(`Đã hủy và hoàn tiền ${finalAmount.toLocaleString()} VND thành công!`);

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Hủy/Hoàn tiền thất bại!");
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-14 p-6 bg-white shadow-lg rounded-xl relative">
            <h1 className="text-2xl font-bold mb-4">
                Hủy đặt phòng #{bookingId}
            </h1>

            <p className="text-gray-600 mb-4">
                Một vài gợi ý cho bạn:
            </p>

            {/* Gợi ý lý do */}
            <div className="mb-4">
                <div className="flex flex-col gap-2">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setReason(s)}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-left"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ô nhập lý do */}
            <textarea
                className="w-full border p-3 rounded-lg min-h-[120px]"
                placeholder="Hoặc tự chia sẻ điều khiến bạn đổi ý..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />

            {/* Preview hoàn tiền */}
            {refundPreview !== null && !completedRefund && (
                <p className="mt-4 text-green-600 font-semibold">
                    Số tiền dự kiến hoàn: {refundPreview} VND
                </p>
            )}

            {/* Thông báo hoàn tiền đã xong */}
            {completedRefund !== null && (
                <p className="mt-4 text-blue-600 font-bold">
                    Hoàn tiền thành công: {completedRefund} VND
                </p>
            )}

            {/* Nút mở modal */}
            <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                disabled={loading || completedRefund !== null}
            >
                {loading ? "Đang xử lý..." : completedRefund ? "Đã hủy & hoàn tiền" : "Hủy & Hoàn tiền"}
            </button>

            {/* ===== MODAL XÁC NHẬN ===== */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md animate-fade">
                        <h2 className="text-xl font-bold mb-2">Xác nhận hủy & hoàn tiền?</h2>
                        <p className="text-gray-600 mb-4">
                            Bạn có chắc chắn muốn hủy đặt phòng và nhận hoàn tiền không?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                            >
                                Thôi không hủy
                            </button>

                            <button
                                onClick={handleCancelAndRefund}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
