"use client";

import { useState, useEffect } from "react";
import api from "@/axios/axios";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";

type Step = "choose-method" | "enter-email" | "verify-otp" | "link-sent";

export default function ForgotPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose-method");
  const [method, setMethod] = useState<"email-link" | "email-otp" | "">("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(300); // 5 phút
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [tokenOTP, setTokenOTP] = useState(false);

  const EMAILJS_SERVICE_ID = "service_6ytahtk";
  const EMAILJS_LINK_TEMPLATE_ID = "template_ym1yo7j";
  const EMAILJS_OTP_TEMPLATE_ID = "template_9a5slhf";
  const EMAILJS_PUBLIC_KEY = "fu_9wJvvS8-nwltpn";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!(?:[0-9]+\.)+[a-zA-Z]{2,})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // ================= Step 1: chọn phương thức =================
  const handleChooseMethod = () => {
    if (!method) return alert("Vui lòng chọn 1 phương án");
    setStep("enter-email");
  };

  // ================= Step 2: gửi OTP / link =================
  const handleSendOtpOrLink = async () => {
    if (!email) return alert("Vui lòng nhập email");
    if (!emailRegex.test(email)) return alert("Email không hợp lệ");

    try {
      setLoading(true);
      setLoadingMessage("Đang gửi...");

      if (method === "email-link") {
        setLoadingMessage("Đang gửi link đến email...");

        const res = await api.post("/reset-password/send-link", { email });
        const token = res.data.token;
        const resetLink = `${window.location.origin}/auth/forgot-password/reset-password?token=${token}`;

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_LINK_TEMPLATE_ID,
          { to_email: email, reset_link: resetLink },
          EMAILJS_PUBLIC_KEY
        );

        setStep("link-sent");

      } else if (method === "email-otp") {
        setLoadingMessage("Đang gửi OTP đến email...");
        const res = await api.post("/reset-password/send-otp", { email });
        const token = res.data.token;
        setTokenOTP(token);

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
      // AxiosError có response
      if (err.response) {
        if (err.response.status === 404) {
          alert("Email này chưa được đăng ký trong hệ thống!");
        } else {
          alert(err.response.data?.message || "Có lỗi khi gửi email, vui lòng thử lại.");
        }
      } else {
        // Lỗi khác, ví dụ network
        alert("Không thể kết nối server, vui lòng thử lại.");
      }
      //console.error(err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };


  // ================= Countdown OTP =================
  useEffect(() => {
    if (step === "verify-otp" && otpCountdown > 0) {
      const timer = setInterval(() => setOtpCountdown((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (otpCountdown === 0 && step === "verify-otp") {
      setOtp("");
      alert("OTP đã hết hạn, vui lòng gửi lại.");
      setStep("enter-email");
    }
  }, [otpCountdown, step]);

  // ================= Step 3: verify OTP =================
  const handleVerifyOtp = async (inputOtp: string) => {
    if (!inputOtp) return alert("Vui lòng nhập OTP");
    if (!/^\d{6}$/.test(inputOtp)) return alert("OTP phải gồm 6 số");

    try {
      setLoading(true);
      setLoadingMessage("Đang xác minh OTP...");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-10 h-10 border-4 border-t-[#0068ff] border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-700">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {step === "choose-method" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Chọn một phương pháp để xác nhận đổi mật khẩu
            </h2>
            <p className="mb-6 text-gray-600">
              Đây là các phương án mà bạn có thể chọn
            </p>
            <div
              onClick={() => setMethod("email-link")}
              className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-link" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            >
              📧 Gửi link Gmail
              <p className="text-sm text-gray-500">
                Chúng tôi sẽ gửi link đến email của bạn
              </p>
            </div>
            <div
              onClick={() => setMethod("email-otp")}
              className={`p-4 mb-3 border rounded-lg cursor-pointer ${method === "email-otp" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            >
              🔑 Gửi mã OTP Gmail
              <p className="text-sm text-gray-500">
                Chúng tôi sẽ gửi mã xác nhận gồm 6 số đến email của bạn
              </p>
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
            <p className="mb-2">
              Thời gian còn lại: {Math.floor(otpCountdown / 60)}:
              {String(otpCountdown % 60).padStart(2, "0")}
            </p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
              maxLength={6}
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

        {step === "link-sent" && (
          <div className="space-y-3 text-center">
            <p className="text-green-600 font-medium">
              ✅ Link đổi mật khẩu đã được gửi vào email của bạn. <br />
              Vui lòng kiểm tra hộp thư!
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 text-white py-2 rounded-lg"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
