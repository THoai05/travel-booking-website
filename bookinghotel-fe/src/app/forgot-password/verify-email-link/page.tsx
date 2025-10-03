"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

export default function VerifyEmailLinkPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendLink = async () => {
    if (!email) return alert("Vui lòng nhập email");
    setLoading(true);

    try {
      // Gọi backend để tạo token
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-resets/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "email_link", value: email }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Không thể gửi link");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.token; // token backend

      // Gửi email bằng EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          message: `Click vào link để đổi mật khẩu: ${window.location.origin}/forgot-password/reset-password?token=${token}`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      alert("Link đổi mật khẩu đã được gửi vào email của bạn");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Gửi link đổi mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <button
        onClick={handleSendLink}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {loading ? "Đang gửi..." : "Gửi link đổi mật khẩu"}
      </button>
    </div>
  );
}
