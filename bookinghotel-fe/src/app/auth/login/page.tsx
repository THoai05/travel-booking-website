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
    setError("Mật khẩu phải có không được lớn hơn 255 ký tự!");
    setLoading(false);
    return;
  }

    try {
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

      if (rememberMe) localStorage.setItem("loginData", JSON.stringify(data.user));
      else localStorage.removeItem("loginData");

      router.push(data.user.role === "admin" ? "/admin" : "/client");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
	  style={{ backgroundColor: "#66CCFF" }} // mã màu bạn muốn
    >
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl text-black transition-all duration-300">
          <h2 className="text-3xl font-semibold mb-2 text-left">Login</h2>
          <p className="text-sm text-gray-200 text-left mb-6">
            Welcome back, please login to your account
          </p>

          {error && (
            <div className="bg-red-600/80 text-sm p-2 rounded text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="relative group">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-400 transition-colors" />
              <input
                type="text"
                name="emailOrUsername"
                placeholder="User Name or Email"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-300 text-white text-sm focus:outline-none focus:border-green-400 transition-all duration-300 hover:border-green-400"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-300 text-white text-sm focus:outline-none focus:border-green-400 transition-all duration-300 hover:border-green-400"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-green-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-green-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="/auth/forgot-password"
                className="text-green-300 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 rounded-xl mt-4 hover:opacity-90 transition-all"
            >
              {loading ? "Đang đăng nhập..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-200 mt-6">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-green-300 hover:underline">
              Signup
            </a>
          </p>

          <p className="text-[10px] text-center mt-4 text-gray-300">
            Created by anggidwiliputra
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-black/70 text-white px-6 py-4 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-green-400 border-l-green-400 border-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm">{loadingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
