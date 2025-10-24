"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/axios/axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null); // ✅ trạng thái token

  // ================== Kiểm tra token khi load trang ==================
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      try {
        const res = await api.post("/reset-password/check-token", { token });
        setTokenValid(res.data.valid);
      } catch (err) {
        console.error(err);
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  // ================== Đặt lại mật khẩu ==================
  const handleResetPassword = async () => {
    if (password !== confirmPassword)
      return alert("Mật khẩu xác nhận không khớp");

    try {
      setLoading(true);
      await api.post("/reset-password/reset", { token, newPassword: password });
      alert("Mật khẩu đã được đặt lại thành công!");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // ================== Giao diện ==================
  if (tokenValid === null) {
    // Đang kiểm tra token
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Đang kiểm tra liên kết...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    // Token hết hạn hoặc không hợp lệ
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-3 text-center">
          <p className="text-red-600 font-medium">
            ❌ Liên kết đặt lại mật khẩu của bạn đã hết hạn hoặc không hợp lệ.
            Vui lòng yêu cầu gửi lại liên kết mới.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-600 text-white py-2 rounded-lg"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Token hợp lệ → hiển thị form đặt lại mật khẩu
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />
        <button
          onClick={handleResetPassword}
          disabled={loading || !password || !confirmPassword}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </div>
    </div>
  );
}
