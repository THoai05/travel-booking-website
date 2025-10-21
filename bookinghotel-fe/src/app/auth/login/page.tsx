"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Login = ({ onClose, onSwitchToRegister }: { onClose: () => void; onSwitchToRegister: () => void; }) => {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoadingMessage("Đang đăng nhập...");

    if (!formData.emailOrUsername || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (formData.emailOrUsername.length > 100) {
      setError("Tên đăng nhập hoặc email không được vượt quá 100 ký tự!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      setLoading(false);
      return;
    }

    if (formData.password.length > 255) {
      setError("Mật khẩu không được lớn hơn 255 ký tự!");
      setLoading(false);
      return;
    }

    try {
      // 🔹 login
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          usernameOrEmail: formData.emailOrUsername,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại!");

      // 🔹 lưu token với thời gian hết hạn nếu người dùng chọn "Ghi nhớ"
      if (rememberMe) {
        // Thời gian hết hạn: 1 ngày
        const expiresIn = 1 * 24 * 60 * 60 * 1000;
        const expiryTime = new Date().getTime() + expiresIn;

        const tokenData = {
          token: data.token,
          expiry: expiryTime,
        };

        localStorage.setItem("token", JSON.stringify(tokenData));
      } else {
        // Thời gian hết hạn: 1 tiếng
        const expiresIn = 1 * 60 * 60 * 1000;
        const expiryTime = new Date().getTime() + expiresIn;

        const tokenData = {
          token: data.token,
          expiry: expiryTime,
        };

        localStorage.setItem("token", JSON.stringify(tokenData));
      }

      // 🔹 lấy profile
      // 🔹 Lấy token thật từ localStorage
      const tokenData = localStorage.getItem("token");
      if (!tokenData) throw new Error("Không tìm thấy token trong localStorage");

      const parsed = JSON.parse(tokenData);
      const token = parsed.token; // chỉ lấy phần token
      console.log("JWT token:", token);

      // 🔹 Gọi API lấy profile
      const profileRes = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });


      const profileData = await profileRes.json();
      console.log("role:", profileData.role);


      // 🔹 redirect theo role
      if (profileData.role === "admin") {     
        router.push("/admin");
      } else if (profileData.role === "customer") {
        router.push("/client");
      }




    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <FiX size={22} />
      </button>

      {/* Logo + tiêu đề */}
      <h1 className="text-2xl font-bold text-[#0068ff] mb-2 text-center">
        Travel Booking
      </h1>
      <p className="text-sm text-gray-500 mb-5 text-center">
        Đăng nhập để tiếp tục
      </p>

      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3 text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
        {/* Username */}
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Username hoặc email"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0068ff]"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0068ff]"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#0068ff]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Ghi nhớ + Quên mật khẩu */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              className="accent-[#0068ff]"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ghi nhớ đăng nhập
          </label>
          <a
            href="/auth/forgot-password"
            className="text-[#0068ff] hover:underline"
          >
            Quên mật khẩu
          </a>
        </div>

        {/* Nút đăng nhập */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0068ff] text-white font-semibold py-2 rounded-lg mt-2 hover:bg-[#0053cc] transition"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Chân trang */}
      <div className="mt-6 text-sm text-gray-700 border-t pt-3 text-center">
        Bạn chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-green-600 hover:underline font-medium"
        >
          Đăng ký
        </button>
      </div>

      {/* Overlay loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-[#0068ff] border-l-[#0068ff] border-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-700">{loadingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );

};

export default Login;
