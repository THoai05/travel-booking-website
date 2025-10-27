"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChooseMethod() {
  const router = useRouter();
  const [method, setMethod] = useState<"email-link" | "email-otp" | "">("");

  const handleNext = () => {
    if (!method) return alert("Vui lòng chọn 1 phương án");
    router.push(`/auth/forgot-password/enter-email?method=${method}`);
  };

  const handleClickContact = (e: React.MouseEvent) => {
    e.preventDefault(); // tránh reload trang
    localStorage.setItem("methodShowLoginregister", JSON.stringify("none"));
    router.push("/contact"); // chuyển trang
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">
          Chọn một phương pháp để xác nhận đổi mật khẩu
        </h2>
        <p className="mb-6 text-gray-600">
          Đây là các phương án mà bạn có thể chọn
        </p>

        {/* --- Lựa chọn phương án --- */}
        <div className="space-y-4">
          {[
            {
              key: "email-link",
              title: "📧 Gửi link Gmail",
              desc: "Chúng tôi sẽ gửi link đến email của bạn",
            },
            {
              key: "email-otp",
              title: "🔑 Gửi mã OTP Gmail",
              desc: "Chúng tôi sẽ gửi mã xác nhận gồm 6 số đến email của bạn",
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => setMethod(item.key as "email-link" | "email-otp")}
              className={`group relative p-4 border rounded-[5px] cursor-pointer transition-all duration-300
                ${method === item.key
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-lg hover:bg-blue-50/60"
                }`}
            >
              {/* Hiệu ứng nền mờ gradient khi hover */}
              <div className="absolute inset-0 rounded-[5px] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-blue-100 via-blue-50 to-white blur-md"></div>

              <div className="relative">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Box hỗ trợ --- */}
        <div className="mt-6 p-4 border border-gray-200 rounded-[5px] bg-gray-50 flex items-start gap-3 hover:shadow-md transition-all duration-300">
          <span className="text-2xl">👨‍💻</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 mb-1">Bạn cần cách khác?</p>
            <p className="text-gray-600 text-sm">
              Nhằm bảo vệ tài khoản của bạn, bạn có thể{" "}
              <span
                onClick={handleClickContact}
                className="text-blue-600 font-medium hover:underline hover:text-blue-700 cursor-pointer transition-colors"
              >
                liên hệ với chúng tôi
              </span>
            </p>
          </div>
        </div>

        {/* --- Nút tiếp tục --- */}
        <button
          onClick={handleNext}
          className="w-full mt-6 py-3 rounded-[5px] bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 active:scale-[0.97]"
        >
          Tiếp tục 🚀
        </button>

        {/* 🔹 Footer & Nút quay lại chọn phương án */}
        <div className="mt-4 border-t pt-2">
          <p className="text-center text-gray-500 text-sm">
            Quay lại màn hình đăng nhập ?{" "}
            <button
              onClick={() => router.back()}
              className="text-blue-500 font-medium hover:underline"
            >
              Thoát
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
