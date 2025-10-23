import api from "@/axios/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ResetPasswordPayload {
  token: string; // token link hoặc OTP
  newPassword: string;
}

// =================== Gửi link ===================
export const useSendResetLink = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/reset-password/send-link", { email });
      return res.data;
    },
  });
};

// =================== Gửi OTP ===================
export const useSendOTP = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/reset-password/send-otp", { email });
      return res.data;
    },
  });
};

// =================== Reset mật khẩu ===================
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const res = await api.post("/reset-password/reset", payload);
      return res.data;
    },
  });
};
