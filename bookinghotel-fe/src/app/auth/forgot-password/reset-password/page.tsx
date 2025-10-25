"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/axios/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [error, setError] = useState(""); // ⚠️ Thêm error state

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      try {
        setLoading(true);
        setLoadingMessage("Đang kiểm tra liên kết...");
        const res = await api.post("/reset-password/check-token", { token });
        setTokenValid(res.data.valid);
      } catch (err) {
        console.error(err);
        setTokenValid(false);
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

    verifyToken();
  }, [token]);

  const handleResetPassword = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 8 || password.length > 255) {
      setError("Mật khẩu phải từ 8 đến 255 ký tự");
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Đang đặt lại mật khẩu...");
      await api.post("/reset-password/reset", { token, newPassword: password });
      alert("Mật khẩu đã được đặt lại thành công!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Có lỗi khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-10 h-10 border-4 border-t-[#0068ff] border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      {tokenValid === null && !loading && <p className="text-gray-600">Đang kiểm tra liên kết...</p>}

      {tokenValid === false && !loading && (
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
      )}

      {tokenValid && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10"
            />
            <div
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10"
            />
            <div
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading || !password || !confirmPassword}
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </div>
      )}
    </div>
  );
}
