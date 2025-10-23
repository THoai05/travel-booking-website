"use client";

import { useState, useEffect } from "react";
import api from "@/axios/axios";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";

type Step = "choose-method" | "enter-email" | "verify-otp";

export default function ForgotPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose-method");
  const [method, setMethod] = useState<"email-link" | "email-otp" | "">("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(300); // 5 phút = 300s
  const [loading, setLoading] = useState(false);
  const [tokenOTP, setTokenOTP] = useState(false);

  // EmailJS config
  const EMAILJS_SERVICE_ID = "service_6ytahtk";
  const EMAILJS_LINK_TEMPLATE_ID = "template_ym1yo7j";
  const EMAILJS_OTP_TEMPLATE_ID = "template_9a5slhf";
  const EMAILJS_PUBLIC_KEY = "fu_9wJvvS8-nwltpn";

  // ================= Step 1: chọn phương thức =================
  const handleChooseMethod = () => {
    if (!method) return alert("Vui lòng chọn 1 phương án");
    setStep("enter-email");
  };

  // ================= Step 2: gửi OTP / link =================
  const handleSendOtpOrLink = async () => {
    if (!email) return alert("Vui lòng nhập email");
    try {
      setLoading(true);

      if (method === "email-link") {
        const res = await api.post("/reset-password/send-link", { email });
        const token = res.data.token;
        const resetLink = `${window.location.origin}/auth/forgot-password/reset-password?token=${token}`;

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_LINK_TEMPLATE_ID,
          { to_email: email, reset_link: resetLink },
          EMAILJS_PUBLIC_KEY
        );

        alert("Email chứa link đặt lại mật khẩu đã được gửi!");
        router.push(resetLink); // redirect sang page reset-password
      } else if (method === "email-otp") {
        const res = await api.post("/reset-password/send-otp", { email });
        const token = res.data.token;
        setTokenOTP(token);

        setOtp(res.data.code); // lưu OTP để hiển thị countdown
        setOtpCountdown(300); // reset countdown 5 phút
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_OTP_TEMPLATE_ID,
          { to_email: email, otp_code: res.data.code },
          EMAILJS_PUBLIC_KEY
        );
        alert("Email chứa OTP đã được gửi!");
        setStep("verify-otp");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi khi gửi email");
    } finally {
      setLoading(false);
    }
  };

  // ================= Countdown OTP =================
  useEffect(() => {
    if (step === "verify-otp" && otpCountdown > 0) {
      const timer = setInterval(() => setOtpCountdown((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (otpCountdown === 0) {
      setOtp("");
      alert("OTP đã hết hạn, vui lòng gửi lại.");
      setStep("enter-email");
    }
  }, [otpCountdown, step]);

  // ================= Step 3: verify OTP =================
  const handleVerifyOtp = async (inputOtp: string) => {
    if (!inputOtp) return alert("Vui lòng nhập OTP");
    try {
      setLoading(true);
      const res = await api.post("/reset-password/verify-otp", { email, code: inputOtp });
      alert("OTP hợp lệ! Bạn sẽ được chuyển đến đặt lại mật khẩu.");

      

      router.push(`/auth/forgot-password/reset-password?token=${tokenOTP}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "OTP không hợp lệ hoặc hết hạn");
    } finally {
      setLoading(false);
    }
  };

  // ================= Render wizard =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {step === "choose-method" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Chọn phương thức</h2>
            <div
              onClick={() => setMethod("email-link")}
              className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-link" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            >
              📧 Gửi link Gmail
            </div>
            <div
              onClick={() => setMethod("email-otp")}
              className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-otp" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            >
              🔑 Gửi mã OTP Gmail
            </div>
            <button
              onClick={handleChooseMethod}
              className="w-full bg-red-500 text-white py-2 rounded-lg mt-4"
            >
              Tiếp tục
            </button>
          </>
        )}

        {step === "enter-email" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Nhập email của bạn</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />
            <button
              onClick={handleSendOtpOrLink}
              disabled={loading || !email}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </>
        )}

        {step === "verify-otp" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Nhập OTP</h2>
            <p>OTP đã được gửi tới email {email}</p>
            <p className="mb-2">Thời gian còn lại: {Math.floor(otpCountdown / 60)}:{String(otpCountdown % 60).padStart(2, "0")}</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />
            <button
              onClick={() => handleVerifyOtp(otp)}
              disabled={loading || !otp}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              {loading ? "Đang xác minh..." : "Xác minh OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
