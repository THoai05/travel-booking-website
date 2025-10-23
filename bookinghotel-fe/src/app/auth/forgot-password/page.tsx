"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = useState<string>("");

  const handleContinue = () => {
    if (!method) return alert("Vui lòng chọn 1 phương án");

    if (method === "email-otp") router.push("/auth/forgot-password/verify-email");
    else if (method === "email-link") router.push("/auth/forgot-password/verify-email-link");
    else alert("Chức năng này đang phát triển!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Chọn một phương pháp để xác nhận đổi mật khẩu
      </h2>
      <p className="mb-6 text-gray-600">
        Đây là các phương án mà bạn có thể chọn
      </p>


      <div
        onClick={() => setMethod("email-link")}
        className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-link"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
          }`}
      >
        📧 Gửi link Gmail
        <p className="text-sm text-gray-500">
          Chúng tôi sẽ gửi link đến email của bạn
        </p>
      </div>

      <div
        onClick={() => setMethod("email-otp")}
        className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-otp"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
          }`}
      >
        🔑 Gửi mã xác nhận Gmail
        <p className="text-sm text-gray-500">
          Chúng tôi sẽ gửi mã xác nhận gồm 6 số đến email của bạn
        </p>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-red-500 text-white py-2 rounded-lg mt-4"
      >
        Tiếp tục
      </button>
    </div>
  );
}
