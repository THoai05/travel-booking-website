"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/axios/axios";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async () => {
    if (!token) return alert("Token không hợp lệ");
    if (password.length < 8) return alert("Mật khẩu phải từ 8 ký tự");
    if (password !== confirm) return alert("Mật khẩu không khớp");

    setLoading(true);
    try {
      const res = await api.post("/reset-password/reset", { token, newPassword: password });
      alert(res.data.message || "Đặt lại mật khẩu thành công 🎉");
      router.push("/auth/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>

      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded-lg"
      >
        {loading ? "Đang lưu..." : "Lưu mật khẩu mới"}
      </button>
    </div>
  );
}
