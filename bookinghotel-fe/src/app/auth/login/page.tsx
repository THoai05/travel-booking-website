"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Login = () => {
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

		// 🔹 lưu token
		if (rememberMe) localStorage.setItem("token", data.token);
		else localStorage.removeItem("token");

		// 🔹 lấy profile
		const token = localStorage.getItem("token");
		console.log("JWT token:", token);

		const profileRes = await fetch("/api/auth", {
		  method: "GET",
		  headers: {
			Authorization: `Bearer ${token}`,
		  },
		});

		const profileData = await profileRes.json();

		// 🔹 redirect theo role
		router.push(profileData.role === "admin" ? "/admin" : "/client");

	  } catch (err: any) {
		setError(err.message || "Đăng nhập thất bại!");
	  } finally {
		setLoading(false);
	  }
	};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7f0ff]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 text-center">
        {/* Logo + Header */}
        <h1 className="text-2xl font-bold text-[#0068ff] mb-2 text-center">Travel Booking</h1>
         <p className="text-sm text-while-200 text-center mb-6">
            Welcome back, please login to your account
          </p>


        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#0068ff]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Remember + Forgot */}
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

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0068ff] text-white font-semibold py-2 rounded-lg mt-2 hover:bg-[#0053cc] transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-700 border-t pt-4">
          <p className="text-center text-sm text-white-200 mt-6">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-green-600 hover:underline">
              Signup
            </a>
          </p>
        </div>

       
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg flex flex-col items-center shadow-lg">
            <div className="w-10 h-10 border-4 border-t-[#0068ff] border-l-[#0068ff] border-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-700">{loadingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
