"use client";

import { useState } from "react";
import api from "@/axios/axios";
import emailjs from "@emailjs/browser";
import { useSearchParams, useRouter } from "next/navigation";

export default function EnterEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const method = searchParams.get("method") as "email-link" | "email-otp";

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [linkSent, setLinkSent] = useState(false); // ✅ trạng thái link-sent
    const [error, setError] = useState(""); // ⚠️ thêm state error

    const EMAILJS_SERVICE_ID = "service_ydsxt82";
    const EMAILJS_LINK_TEMPLATE_ID = "template_v94dvwg";
    const EMAILJS_OTP_TEMPLATE_ID = "template_193axxj";
    const EMAILJS_PUBLIC_KEY = "iozY7qNmKJZLr6Yq9";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!(?:[0-9]+\.)+[a-zA-Z]{2,})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSend = async () => {
        setError("");

        if (!email) return setError("Vui lòng nhập email");
        if (!emailRegex.test(email)) return setError("Email không hợp lệ");
        if (email.length > 100) return setError("Email không được vượt quá 100 ký tự");

        try {
            setLoading(true);
            setLoadingMessage("Đang gửi...");

            if (method === "email-link") {
                // Gửi link qua email
                const res = await api.post("/reset-password/send-link", { email });
                const token = res.data.token;
                const resetLink = `${window.location.origin}/auth/forgot-password/reset-password?token=${token}`;

                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_LINK_TEMPLATE_ID,
                    { to_email: email, reset_link: resetLink },
                    EMAILJS_PUBLIC_KEY
                );

                setLinkSent(true); // ✅ hiển thị màn hình link-sent

            } else if (method === "email-otp") {
                const res = await api.post("/reset-password/send-otp", { email });
                const token = res.data.token;

                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_OTP_TEMPLATE_ID,
                    { to_email: email, otp_code: res.data.code },
                    EMAILJS_PUBLIC_KEY
                );

                router.push(`/auth/forgot-password/verify-otp?email=${email}&token=${token}`);
            } else {
                setError("Phương thức không hợp lệ " + method);
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi khi gửi email!");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
            {loading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                        <div className="w-10 h-10 border-4 border-t-[#0068ff] border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm text-gray-700">{loadingMessage}</p>
                    </div>
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                {!linkSent ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Nhập email của bạn</h2>

                        {error && (// ✅ hiển thị thông báo lỗi
                            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md p-2 mb-4"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !email}
                            className="w-full bg-blue-500 text-white py-2 rounded-md"
                        >
                            {loading ? "Đang gửi..." : "Gửi"}
                        </button>

                        {/* 🔹 Footer & Nút quay lại chọn phương án */}
                        <div className="mt-6 border-t pt-4">
                            <p className="text-center text-gray-500 text-sm">
                                Chọn lại phương án?{" "}
                                <button
                                    onClick={() => router.back()}
                                    className="text-blue-500 font-medium hover:underline"
                                >
                                    Quay lại
                                </button>
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3 text-center">
                        <p className="text-blue-600 font-medium">
                            ✅ Link đổi mật khẩu đã được gửi vào email của bạn. <br />
                            Vui lòng kiểm tra hộp thư!
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-gray-600 text-white py-2 rounded-lg"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
