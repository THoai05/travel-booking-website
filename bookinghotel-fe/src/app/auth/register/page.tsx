"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff, FiX } from "react-icons/fi";

const Register = ({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
}) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    gender: "other",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 🧠 Xử lý input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧩 Gửi dữ liệu đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoadingMessage("Đang tạo tài khoản...");

    const { username, fullName, email, phone, dob, password, gender, confirmPassword } = formData;

    // --- VALIDATION ---
    if (!username || !fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      setLoading(false);
      return;
    }
    if (username.length < 3 || username.length > 50 || !/^[a-zA-Z0-9_.]+$/.test(username)) {
      setError("Username không hợp lệ!");
      setLoading(false);
      return;
    }

    // 2️⃣ Không có khoảng trắng đầu/cuối
    if (fullName !== fullName.trim()) {
      setError("Họ và tên không được có khoảng trắng đầu hoặc cuối.");
      setLoading(false);
      return;
    }

    // 3️⃣ Không có 2 khoảng trắng liên tiếp
    if (/\s{2,}/.test(fullName)) {
      setError("Họ và tên không được có 2 khoảng trắng liên tiếp.");
      setLoading(false);
      return;
    }
    
    if (fullName.length > 100 || !/^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+$/.test(fullName)) {
      setError("Họ và tên không hợp lệ!");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@(?!(?:[0-9]+\.)+[a-zA-Z]{2,})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) || email.length > 100) {
      setError("Email không hợp lệ!");
      setLoading(false);
      return;
    }
    
    if (phone) {
      // Chỉ cho phép số 0–9, bắt đầu 0 hoặc +84, tổng 10–11 chữ số
      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    
      // Loại bỏ ký tự full-width (０１２３…)
      const fullWidthCheck = /[０-９]/;
    
      if (!phoneRegex.test(phone) || fullWidthCheck.test(phone) || phone.length > 20) {
        setError(
          "Số điện thoại phải bắt đầu bằng 0 hoặc +84, chỉ nhập số bình thường, 10–11 chữ số."
        );
        setLoading(false);
        return;
      }
    }
    
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      today.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);
      if (birthDate > today) {
        setError("Ngày sinh không được lớn hơn ngày hiện tại.");
        setLoading(false);
        return;
      }
      const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
      if (age < 16) {
        setError("Bạn phải đủ 16 tuổi trở lên.");
        setLoading(false);
        return;
      }
    }
    if (password.length < 8 || password.length > 225) {
      setError("Mật khẩu không hợp lệ!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    // --- Gửi API ---
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          username,
          fullName,
          email,
          phone,
          dob,
          gender,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại!");

      alert("Đăng ký thành công! Vui lòng đăng nhập.");

      // --- Trigger header update method
      localStorage.setItem("methodShowLoginregister", JSON.stringify("showLogin"));
      window.dispatchEvent(new Event("storage"));

      onSwitchToLogin(); // chuyển sang login modal

    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative max-h-[calc(100vh-40px)] overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <FiX size={24} />
      </button>

      <h1 className="text-2xl font-bold text-sky-500 mb-2 text-center">Bluevera</h1>

      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Username */}
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" required />
        </div>

        {/* Full Name */}
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" required />
        </div>

        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" required />
        </div>

        {/* Phone */}
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" />
        </div>

        {/* DOB */}
        <div>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none text-gray-700" />
        </div>

        {/* Gender */}
        <div>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none text-gray-700">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" required />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none" required />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-sky-500 text-white font-semibold py-2 rounded-lg hover:bg-sky-700 transition">
          {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        <span>Bạn đã có tài khoản? </span>
        <button type="button" onClick={onSwitchToLogin} className="text-sky-500 hover:underline">Đăng nhập ngay</button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-10 h-10 border-4 border-t-[#0068ff] border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-700">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
