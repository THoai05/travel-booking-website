"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const sendOtp = () => {
    if (!email) return alert("Vui lòng nhập email");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeLeft(60);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_name: email,
          code,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => alert("OTP đã được gửi đến email của bạn"),
        (err) => {
          console.error(err);
          alert("Gửi OTP thất bại");
        }
      );
  };

  const handleVerify = () => {
    if (otp === generatedOtp) alert("Xác minh thành công!");
    else alert("OTP không hợp lệ");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Xác minh email</h2>
      <input
        type="email"
        placeholder="Nhập email Yahoo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <button
        onClick={sendOtp}
        className="w-full bg-blue-500 text-white py-2 rounded mb-4"
      >
        Gửi OTP
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
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Xác minh
          </button>
        </>
      )}
    </div>
  );
}
