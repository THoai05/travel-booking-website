"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/axios/axios";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // lưu OTP tạm thời
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return alert("Vui lòng nhập email");
    if (!regex.test(email)) return alert("Email không hợp lệ");
    return true;
  };

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    if (!validateEmail(email)) return;
    setLoading(true);

    try {
      // gọi API backend để tạo OTP
      const res = await api.post("/reset-password/send-otp", { email });
      setGeneratedOtp(res.data.otp); // giả sử backend trả về otp
      setTimeLeft(60);
      alert("OTP đã được gửi đến email của bạn");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp || timeLeft <= 0) {
      return alert("OTP không hợp lệ hoặc đã hết hạn");
    }

    try {
      const res = await api.post("/reset-password/request-token", { email, otp });
      const token = res.data.token;
      if (!token) return alert("Không nhận được token từ server");
      router.push(`/auth/forgot-password/reset-password?token=${token}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Xác minh OTP thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Xác minh email bằng OTP</h2>

      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
      >
        {loading ? "Đang gửi..." : "Gửi mã OTP"}
      </button>

      {timeLeft > 0 && (
        <>
          <input
            type="text"
            placeholder="Nhập OTP (6 số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full border p-2 rounded mb-3"
          />
          <p className="text-sm text-gray-500 mb-2">Thời gian còn lại: {timeLeft}s</p>
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Xác minh OTP
          </button>
        </>
      )}
    </div>
  );
}
