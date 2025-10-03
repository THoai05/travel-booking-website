"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPhonePage() {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Hàm gửi OTP
  const sendOtp = async () => {
    if (!phone) return alert("Vui lòng nhập số điện thoại");

    // Kiểm tra định dạng cơ bản (034... hoặc +84...)
    if (!/^(\+84|0)\d{9,10}$/.test(phone))
      return alert("Số điện thoại không hợp lệ");

    setSending(true);

    // Tạo OTP 6 số
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeLeft(60);

    try {
      // Gửi phone nguyên gốc lên backend để tìm user
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-resets/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "sms", value: phone, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Không thể gửi OTP");
        setSending(false);
        return;
      }

      alert("OTP đã được gửi đến số điện thoại của bạn");
      setSending(false);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại");
      setSending(false);
    }
  };

  // Xác minh OTP và nhận token từ backend
  const handleVerify = async () => {
    if (otp === "" || otp !== generatedOtp || timeLeft <= 0) {
      return alert("OTP không hợp lệ hoặc đã hết hạn");
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-resets/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "sms_verify", value: phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.message || "Không thể tạo token");
      }

      const data = await res.json();
      router.push(`/forgot-password/reset-password?token=${data.token}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Xác minh số điện thoại</h2>

      <input
        type="tel"
        placeholder="Nhập số điện thoại (034... hoặc +84...)"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))} // bỏ khoảng trắng
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={sendOtp}
        disabled={sending}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
      >
        {sending ? "Đang gửi..." : "Gửi mã OTP"}
      </button>

      {timeLeft > 0 && (
        <>
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full border p-2 rounded mb-3"
          />
          <p className="text-sm text-gray-500 mb-2">Thời gian còn lại: {timeLeft}s</p>
          <button
            onClick={handleVerify}
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Xác minh
          </button>
        </>
      )}
    </div>
  );
}
