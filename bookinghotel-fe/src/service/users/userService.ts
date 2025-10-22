import api from "@/axios/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  role: string;
  loyalty_points?: number;
  membership_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserForm {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
}

// =================== GET USER BY ID ===================
export const useUser = (userId: number) => {
  return useQuery<User, any>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}`);
      // nếu backend trả về { user: {...} } hoặc chỉ {...}
      return res.data.user ?? res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

// =================== UPDATE USER ===================
export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: UpdateUserForm) => {
      const res = await api.patch(`/users/${userId}`, form);
      return res.data;
    },
    onSuccess: (data) => {
      // update cache user
      queryClient.setQueryData(["user", userId], (old: any) => ({
        ...old,
        ...data.user, // data.user được backend trả về từ updateProfile
      }));
    },
  });
};

// =================== UPLOAD AVATAR ===================
export const useUploadAvatar = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post(`/users/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", userId], (old: any) => ({
        ...old,
        avatar: data.avatarUrl,
      }));
    },
  });
};

// =================== GET ALL USERS ===================
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.users; // ✅ chỉ trả về mảng users
};


// =================== DELETE USER ===================
// Hàm xóa user thuần
export const deleteUser = async (userId: number) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};