"use client";

import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    dob: "",
    gender: "male",
  });

  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // khi load trang đọc lại message từ localStorage
    const savedMsg = localStorage.getItem("registerMessage");
    const savedType = localStorage.getItem("registerType");
    if (savedMsg) {
      setMessage(savedMsg);
      setType(savedType as "success" | "error");
    }
  }, []);

  useEffect(() => {
    if (message) {
      localStorage.setItem("registerMessage", message);
      localStorage.setItem("registerType", type);
    }
  }, [message, type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setMessage("Đăng ký thành công 🎉");
        setType("success");
        setFormData({
          username: "",
          email: "",
          password: "",
          full_name: "",
          phone: "",
          dob: "",
          gender: "male",
        });
      } else {
        const err = await res.json();
        setMessage("Đăng ký thất bại: " + err.message);
        setType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối server ❌");
      setType("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded pl-12 pr-12 py-6 relative">
      <h2 className="text-xl font-semibold mb-4 text-center">Đăng ký</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Full name */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <input
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4 flex">
          <div className="flex mb-1">
            <label className="w-5 font-semibold text-red-500">*</label>
          </div>
          <div className="flex-1 flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Email là bắt buộc để khôi phục tài khoản.
            </p>
          </div>
        </div>

        {/* Password */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* DOB */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Gender */}
        <div className="mb-4 flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500"
        >
          Đăng ký ngay
        </button>
      </form>

      {/* Toast hiển thị nổi màn hình nhỏ */}
      {message && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-3 rounded shadow-lg text-white transition-all ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
