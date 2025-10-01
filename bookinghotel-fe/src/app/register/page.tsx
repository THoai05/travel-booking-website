"use client";

import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

	const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();

	  try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(formData), // 👈 gửi full formData
		});

		if (res.ok) {
		  setMessage("Đăng ký thành công 🎉");
		  setFormData({
			username: "",
			email: "",
			password: "",
			full_name: "",
			phone: "",
			dob: "",
			gender: "male",
		  }); // reset form
		} else {
		  const err = await res.json();
		  setMessage("Đăng ký thất bại: " + err.message);
		}
	  } catch (error) {
		console.error(error);
		setMessage("Lỗi kết nối server ❌");
	  }
	};


  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded pl-12 pr-12 py-6">
		<h2 className="text-xl font-semibold mb-4 text-center">
			Đăng ký 
		</h2>

      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
	  
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 		
			</label>
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
		
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 		
			</label>
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
		
		<div className="mb-4 flex ">
		  <div className="flex mb-1">
			<label className="w-5 font-semibold text-red-500">*</label>
		  </div>
		  {/* Input và chú thích bên phải, xếp dọc */}
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
			  Email là bắt buộc để khôi phục tài khoản Bookinghotel. Địa chỉ Gmail sẽ được định dạng lại để ngăn chặn email trái phép.
			</p>
		  </div>
		</div>

		
		
		
		
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 
			</label>
			<div className="relative flex-1">
			  <input
				type={showPassword ? "text" : "password"} // đổi type theo state
				name="password"
				placeholder="Mật khẩu"
				value={formData.password}
				onChange={handleChange}
				className="w-full border p-2 rounded pr-10" // thêm padding phải để icon không che text
				required
			  />
			  <button
				type="button"
				className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
				onClick={() => setShowPassword(!showPassword)}
			  >
				{showPassword ? "🙈" : "👁️"} {/* icon con mắt */}
			  </button>
			</div>
		</div>
		
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 		
			</label>
			<input
			  type="text"
			  name="phone"
			  placeholder="Số điện thoại"
			  value={formData.phone}
			  onChange={handleChange}
			  className="w-full border p-2 rounded"
			/>
		</div>
		
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 		
			</label>
			<input
			  type="date"
			  name="dob"
			  value={formData.dob}
			  onChange={handleChange}
			  className="w-full border p-2 rounded"
			/>
		</div>
		
		<div className="mb-4 flex items-center">
			<label className="w-5 font-semibold text-red-500">
				* 		
			</label>
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

        <button
          type="submit"
          className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500"
        >
          Đăng ký ngay
        </button>
		<p className="text-sm text-center text-gray-500">
		  Bằng cách nhấn Đăng Ký Ngay, bạn đồng ý với&nbsp;
		  <a href="/terms" className="text-blue-500 underline">
			Điều Khoản Dịch Vụ
		  </a>
		  &nbsp;và&nbsp;
		  <a href="/privacy" className="text-blue-500 underline">
			Chính Sách Bảo Mật
		  </a>
		</p>

      </form>
    </div>
  );
}
