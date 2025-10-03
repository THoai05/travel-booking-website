"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

export default function VerifyEmailLinkPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // ✅ Hàm kiểm tra email
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

  const handleSendLink = async () => {
    if (!validateEmail(email)) return; // kiểm tra trước khi gửi
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/password-resets/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "email_link", value: email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Không thể gửi link");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.token;

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          message: `Click vào link để đổi mật khẩu: ${window.location.origin}/forgot-password/reset-password?token=${token}`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSuccess(true);
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

      {success ? (
        <div className="space-y-3">
          <p className="text-green-600 font-medium">
            ✅ Link đổi mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra
            hộp thư!
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-600 text-white py-2 rounded-lg"
          >
            Quay lại đăng nhập
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
