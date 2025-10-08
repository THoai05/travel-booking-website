"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // lấy token từ URL

  const handleReset = async () => {
    if (!token) return alert("Token không hợp lệ");

    if (password.length < 8) return alert("Mật khẩu phải từ 8 ký tự");
    if (password.length > 225) return alert("Mật khẩu không vượt quá 225 ký tự");
    if (password !== confirm) return alert("Mật khẩu không khớp");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-resets/reset/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.message || "Đặt lại mật khẩu thất bại");
      }

      alert("Đặt lại mật khẩu thành công 🎉");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>

      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu mới"
          value={password}
          maxLength={225}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded pr-10"
        />
        <span className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <div className="relative mb-3">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          maxLength={225}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-2 rounded pr-10"
        />
        <span className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowConfirm(!showConfirm)}>
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <button onClick={handleReset} className="w-full bg-red-500 text-white py-2 rounded-lg">
        Lưu mật khẩu mới
      </button>
    </div>
  );
}
