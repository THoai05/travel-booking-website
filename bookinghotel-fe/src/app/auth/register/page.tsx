"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Register = ({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: () => void; }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
	gender: 'other', // ✅ phải có field gender
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

    const { username, full_name, email, phone, dob, password, gender, confirmPassword } = formData;

    // --- BẮT ĐẦU VALIDATION ---

    // 1. Kiểm tra trường bắt buộc
    if (!username || !full_name || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      setLoading(false);
      return;
    }

    // 2. Kiểm tra Username
    if (username.length < 3) {
        setError("Username phải có ít nhất 3 ký tự trở lên.");
        setLoading(false);
        return;
    }
    if (username.length > 50) {
        setError("Username không dài quá 50 ký tự.");
        setLoading(false);
        return;
    }
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        setError("Sai định dạng username (chỉ cho phép chữ, số, '_', '.').");
        setLoading(false);
        return;
    }

    // 3. Kiểm tra Họ và tên (full_name)
    if (full_name.length > 100) {
        setError("Họ và tên không được quá 100 ký tự.");
        setLoading(false);
        return;
    }
    const fullNameRegex = /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/;
    if (!fullNameRegex.test(full_name)) {
        setError("Họ và tên không có số, ký tự đặc biệt.");
        setLoading(false);
        return;
    }

    // 4. Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("Sai định dạng email.");
        setLoading(false);
        return;
    }
    if (email.length > 100) {
        setError("Email không dài quá 100 ký tự.");
        setLoading(false);
        return;
    }

    // 5. Kiểm tra Số điện thoại (nếu có nhập)
    if (phone) {
        const phoneRegex = /^(0|\+84)\d{9,10}$/;
        if (!phoneRegex.test(phone) || phone.length > 20) {
            setError("Số điện thoại phải bắt đầu bằng số 0 hoặc +84 và có từ 10 đến 11 chữ số.");
            setLoading(false);
            return;
        }
    }

    // 6. Kiểm tra Ngày sinh (dob)
    if (dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        today.setHours(0, 0, 0, 0); // Bỏ qua giờ để so sánh ngày
        if (birthDate > today) {
            setError("Ngày sinh không được lớn hơn ngày hiện tại.");
            setLoading(false);
            return;
        }
    }
    
    // 7. Kiểm tra Mật khẩu
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      setLoading(false);
      return;
    }
    if (password.length > 225) { // Theo tài liệu là 225
        setError("Mật khẩu không được quá 225 ký tự.");
        setLoading(false);
        return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    // --- KẾT THÚC VALIDATION ---

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
          dob,
		  gender,
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

	<div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative max-h-[calc(100vh-40px)] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <FiX size={24} />
        </button>
		
        {/* Logo */}
		<h1 className="text-2xl font-bold text-[#0068ff] mb-2 text-center">Travel Booking</h1>
         <p className="text-sm text-while-200 text-center mb-6">
            Welcome back, please register to your account
         </p>
		  
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
              required
            />
          </div>

          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="full_name"
              placeholder="Họ và tên"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
            />
          </div>

          {/* DOB */}
          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none text-gray-700"
            />
          </div>
		  
          <div>
			<select
			  name="gender"
			  value={formData.gender}
			  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
			  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none text-gray-700"
			>
			  <option value="male">Male</option>
			  <option value="female">Female</option>
			  <option value="other">Other</option>
			</select>
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
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068ff] outline-none"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0068ff] text-white font-semibold py-2 rounded-lg hover:bg-[#0053cc] transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <span>Bạn đã có tài khoản? </span>
			<button
			  type="button"
			  onClick={onSwitchToLogin}
			  className="text-[#0068ff] hover:underline"
			>
			  Đăng nhập ngay
			</button>
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
