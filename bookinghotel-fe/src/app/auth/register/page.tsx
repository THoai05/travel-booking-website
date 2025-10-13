"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
	dob: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 🧠 Xử lý nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧩 Gửi dữ liệu đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoadingMessage("Đang tạo tài khoản...");

    const { username, full_name, email, phone, dob, password, confirmPassword } = formData;

    // ✅ Kiểm tra dữ liệu
    if (!username || !full_name || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          username,
          full_name,
          email,
          phone,
          password,
		  dob, // ✅ gửi kèm ngày sinh
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại!");

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pexels-muffin-2468773.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center p-4">
        <div className="bg-black/60 border border-white/10 text-white p-6 sm:p-8 md:p-10 rounded-[5px] shadow-xl w-full max-w-md md:max-w-lg">
          <h2 className="text-xl sm:text-2xl font-light text-center mb-6 tracking-wider">
            REGISTER ACCOUNT
          </h2>

          {error && (
            <div className="bg-red-600 text-sm sm:text-base p-2 mb-3 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="relative group">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type="text"
                name="username"
                placeholder="USERNAME"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
                required
              />
            </div>

            {/* Full Name */}
            <div className="relative group">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type="text"
                name="full_name"
                placeholder="FULL NAME"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative group">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type="text"
                name="phone"
                placeholder="PHONE NUMBER"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
              />
            </div>
			
			{/* Date of Birth */}
			<div className="relative group">
			  <input
				type="date"
				name="dob"
				value={formData.dob}
				onChange={handleChange}
				className="w-full px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base
						   placeholder-gray-400 transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
			  />
			</div>

            {/* Password */}
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="PASSWORD"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors duration-300 hover:text-blue-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="CONFIRM PASSWORD"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
						   transition-all duration-300
						   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
						   hover:border-blue-400 hover:scale-[1.02]"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors duration-300 hover:text-blue-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 py-2 rounded hover:bg-blue-700 transition-all font-semibold mt-3 text-sm sm:text-base"
            >
              {loading ? "Đang đăng ký..." : "REGISTER"}
            </button>
          </form>

          <div className="text-center text-xs sm:text-sm mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-400 hover:underline">
              Login here
            </a>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-black/70 text-white w-50 h-32 flex flex-col items-center justify-center rounded-lg shadow-lg">
                <div className="w-10 h-10 border-4 border-t-blue-400 border-l-blue-400 border-b-transparent border-r-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-center text-sm">{loadingMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
