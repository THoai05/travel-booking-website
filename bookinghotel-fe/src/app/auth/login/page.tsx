"use client";
import React, { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loadingMessage, setLoadingMessage] = useState(""); // thông báo
  



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
	  setError("");
	  setLoading(true);
	  setLoadingMessage("Đang đăng nhập...");

// ✅ Kiểm tra dữ liệu đầu vào
  if (!formData.emailOrUsername.trim() || !formData.password.trim()) {
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

        //alert(data.message);
	  
		if (rememberMe) {
		  localStorage.setItem("loginData", JSON.stringify(data.user));
		} else {
		  localStorage.removeItem("loginData");
		}
	  
		// Kiểm tra role
		if (data.user.role === "admin") {
		  router.push("/admin");
		} else {
		  router.push("/client");
		}
		
		
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
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
	<div className="bg-black/60 border border-white/10 text-white p-6 sm:p-8 md:p-10 rounded-[5px] shadow-xl w-full max-w-md md:max-w-lg ">

      <h2 className="text-xl sm:text-2xl font-light text-center mb-6 tracking-wider">
        LOGIN HERE
      </h2>

      {error && (
        <div className="bg-red-600 text-sm sm:text-base p-2 mb-3 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username input */}
		<div className="relative group">
		  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
		  <input
			type="text"
			name="emailOrUsername"
			placeholder="EMAIL OR USERNAME"
			value={formData.emailOrUsername}
			onChange={handleChange}
			className="w-full pl-10 px-3 py-2 sm:py-2.5 bg-transparent border border-blue-600 rounded text-sm sm:text-base placeholder-gray-400
					   transition-all duration-300
					   focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
					   hover:border-blue-400 hover:scale-[1.02]"
			required
		  />
		</div>

		{/* Password input */}
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


        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-500" onChange={(e) => setRememberMe(e.target.checked)}/> Remember me
          </label>
          <a href="/auth/forgot-password" className="text-blue-400 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 py-2 rounded hover:bg-blue-700 transition-all font-semibold mt-3 text-sm sm:text-base"
        >
          {loading ? "Đang đăng nhập..." : "LOGIN"}
        </button>
      </form>

      <div className="text-center text-xs sm:text-sm mt-6">
        To Register New Account →{" "}
        <a href="/auth/register" className="text-blue-400 hover:underline">
          Click Here
        </a>
      </div>
	  
		{loading && (
		  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-black/70 text-white w-50 h-32 flex flex-col items-center justify-center rounded-lg shadow-lg">
			  {/* Hình quay quay */}
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

export default Login;
