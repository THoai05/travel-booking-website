"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState("");
  const router = useRouter();

  // ✅ validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      alert("Vui lòng nhập email");
      return false;
    }
    if (email.length > 100) {
      alert("Email không được dài quá 100 ký tự");
      return false;
    }
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return false;
    }
    return true;
  };

  // countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // 1️⃣ gửi OTP qua EmailJS
  const sendOtp = async () => {
    if (!validateEmail(email)) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
    setGeneratedOtp(code);
    setTimeLeft(60);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          message: `Mã OTP của bạn là: ${code}`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      alert("OTP đã được gửi đến email của bạn");
    } catch (err) {
      console.error(err);
      alert("Gửi OTP thất bại. Vui lòng thử lại");
    }
  };

  // 2️⃣ xác minh OTP và nhận token từ backend
  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return alert("OTP phải gồm 6 chữ số");
    }
    if (otp !== generatedOtp || timeLeft <= 0) {
      return alert("OTP không hợp lệ hoặc đã hết hạn");
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/password-resets/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "email_code", value: email }),
        }
      );

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
      <h2 className="text-xl font-semibold mb-4">Xác minh email</h2>

      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={sendOtp}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
      >
        Gửi mã OTP
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
          <p className="text-sm text-gray-500 mb-2">
            Thời gian còn lại: {timeLeft}s
          </p>
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
