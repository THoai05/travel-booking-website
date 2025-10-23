import api from "@/axios/axios";

export interface ResetPasswordPayload {
  token: string; // token link hoặc OTP
  newPassword: string;
}

// =================== Gửi link ===================
export const sendResetLink = async (email: string) => {
  try {
    const res = await api.post("/reset-password/request", {
      method: "email_link",
      value: email,
    });
    return res.data; // { message, token }
  } catch (err: any) {
    throw err.response?.data || { message: "Gửi link thất bại" };
  }
};

// =================== Gửi OTP ===================
export const sendOTP = async (email: string) => {
  try {
    const res = await api.post("/reset-password/request", {
      method: "email_code",
      value: email,
    });
    return res.data; // { message }
  } catch (err: any) {
    throw err.response?.data || { message: "Gửi OTP thất bại" };
  }
};

// =================== Xác thực OTP ===================
export const verifyOTP = async (email: string, code: string) => {
  try {
    const res = await api.post("/reset-password/verify", {
      method: "email_code",
      value: email,
      code,
    });
    return res.data; // { ok, token }
  } catch (err: any) {
    throw err.response?.data || { message: "OTP không hợp lệ hoặc hết hạn" };
  }
};

// =================== Reset mật khẩu ===================
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const res = await api.post(`/reset-password/reset/${token}`, { password: newPassword });
    return res.data; // { message }
  } catch (err: any) {
    throw err.response?.data || { message: "Đặt lại mật khẩu thất bại" };
  }
};
