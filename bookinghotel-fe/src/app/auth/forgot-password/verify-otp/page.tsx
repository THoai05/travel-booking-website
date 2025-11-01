"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/axios/axios";

export default function VerifyOtp() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const tokenOTP = searchParams.get("token") || "";

    const [otp, setOtp] = useState("");
    const [otpCountdown, setOtpCountdown] = useState(300);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // ⚠️ Thêm state error

    const handleVerify = async () => {
        setError(""); // reset lỗi
        if (!otp) return setError("Vui lòng nhập OTP");
        if (!/^\d{6}$/.test(otp)) return setError("OTP phải gồm 6 số");

        try {
            setLoading(true);
            const res = await api.post("/reset-password/verify-otp", { email, code: otp });
            alert("OTP hợp lệ! Bạn sẽ được chuyển đến đặt lại mật khẩu.");
            router.push(`/auth/forgot-password/reset-password?token=${tokenOTP}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "OTP không hợp lệ hoặc hết hạn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (otpCountdown > 0) {
            const timer = setInterval(() => setOtpCountdown((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
        if (otpCountdown === 0) {
            setError("OTP đã hết hạn, vui lòng gửi lại.");
            router.push("/auth/forgot-password");
        }
    }, [otpCountdown, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Nhập OTP</h2>
                <p>OTP đã được gửi tới email {email}</p>
                <p className="mb-2">
                    Thời gian còn lại: {Math.floor(otpCountdown / 60)}:
                    {String(otpCountdown % 60).padStart(2, "0")}
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border rounded-md p-2 mb-4"
                    maxLength={6}
                />
                <button
                    onClick={handleVerify}
                    disabled={loading || !otp}
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                >
                    {loading ? "Đang xác minh..." : "Xác minh OTP"}
                </button>
            </div>
        </div>
    );
}
