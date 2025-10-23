"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/axios/axios";

export default function VerifyEmailLinkPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return alert("Vui lòng nhập email");
    if (!regex.test(email)) return alert("Email không hợp lệ");
    return true;
  };

  const handleSendLink = async () => {
    if (!validateEmail(email)) return;
    setLoading(true);

    try {
      const res = await api.post("/reset-password/send-link", { email });
      alert(res.data.message || "Link đã được gửi thành công");
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gửi link thất bại. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Gửi link đổi mật khẩu</h2>

      {success ? (
        <>
          <p className="text-green-600 mb-3">
            ✅ Link đổi mật khẩu đã được gửi. Vui lòng kiểm tra email!
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-gray-600 text-white py-2 rounded-lg"
          >
            Quay lại đăng nhập
          </button>
        </>
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
