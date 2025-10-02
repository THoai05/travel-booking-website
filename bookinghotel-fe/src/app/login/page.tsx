"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

	 const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
	  setToast(null);

	  // Kiểm tra mật khẩu ≥ 8 ký tự
	  if (formData.password.length < 8) {
		setToast({ message: "Mật khẩu phải từ 8 ký tự trở lên", type: "error" });
		return;
	  }

	  setLoading(true);

	try {
	  // Giả lập delay 2.5s để xem loading
	  await new Promise((resolve) => setTimeout(resolve, 2500));

	  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	  });

	  const data = await res.json();
	  setLoading(false);

	  if (res.ok) {
		// Lưu thông tin user vào localStorage
		localStorage.setItem("user", JSON.stringify(data.user));
		// Nếu backend trả token, có thể lưu token luôn:
		// localStorage.setItem("token", data.token);

		setToast({ message: "Đăng nhập thành công 🎉", type: "success" });
		setFormData({ usernameOrEmail: "", password: "" });
	  } else {
		setToast({ message: "Đăng nhập thất bại: " + data.message, type: "error" });
	  }

	} catch (err) {
	  setLoading(false);
	  setToast({ message: "Lỗi kết nối server ❌", type: "error" });
	}
	};


  const refreshToast = () => setToast(null); // reset thông báo

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded p-8 relative">
      <h2 className="text-xl font-semibold mb-6 text-center">Đăng nhập</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Tên đăng nhập hoặc Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            className="w-full border p-2 rounded ml-2"
            required
          />
        </div>

        <div className="flex items-center">
          <label className="w-5 font-semibold text-red-500">*</label>
          <div className="relative flex-1 ml-2">
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

        <button
          type="submit"
          className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-600 relative"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Đang đăng nhập...
            </div>
          ) : (
            "Đăng nhập ngay"
          )}
        </button>
      </form>

      {/* Toast / thông báo nhỏ */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-3 rounded shadow-md text-white flex items-center space-x-2 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={refreshToast} className="text-white hover:text-gray-200 ml-2">
            ❌
          </button>
        </div>
      )}


<button
  onClick={() => router.push("/register")}
  className="w-full bg-white border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100 mt-4"
>
  Đăng ký ngay
</button>
	<p className="text-sm text-center mt-2 text-gray-500">
          Quên mật khẩu?{" "}
          <a href="/forgot-password" className="text-blue-500 underline">
            Nhấn vào đây
          </a>
    </p>
	
    </div>
	 
  );
}
