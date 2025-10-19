"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";

interface User {
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

interface UpdateUserForm {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<UpdateUserForm>({});



  // =================== LẤY THÔNG TIN NGƯỜI DÙNG ===================
  useEffect(() => {
    const fetchProfileAndUser = async () => {
      try {
        // 🔹 lấy profile từ API auth
        const tokenData = localStorage.getItem("token");
        if (!tokenData) throw new Error("Không tìm thấy token trong localStorage");

        const parsed = JSON.parse(tokenData);
        const token = parsed.token; // chỉ lấy phần token
        console.log("JWT token:", token);

        // 🔹 Gọi API lấy profile
        const profileRes = await fetch("/api/auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


        const profileData = await profileRes.json();

        const userId = Number(profileData.id);
        // 🔹 lấy thông tin user từ backend
        console.log("profileData:", userId);

        const res = await api.get(`/users/${userId}`);
        const data = res.data; // axios trả về res.data
        setUser(data.user || data); // backend trả về { user: {...} } hoặc {...}
        setForm({
          fullName: data.user?.fullName || data.fullName,
          email: data.user?.email || data.email,
          phone: data.user?.phone || data.phone,
          dob: data.user?.dob || data.dob,
          gender: data.user?.gender || data.gender,
        });
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi khi tải thông tin user");
      }
    };

    fetchProfileAndUser();
  }, []);


  // =================== XỬ LÝ INPUT ===================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =================== CẬP NHẬT THÔNG TIN ===================
  const handleSubmit = async () => {
    try {
      const res = await api.patch(`/users/${userId}`, form); // axios.patch
      const data = res.data;
      alert(data.message || "Cập nhật thành công");
      setUser((prev) => (prev ? { ...prev, ...form } : prev));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  // =================== UPLOAD AVATAR ===================
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post(`/users/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      alert("Upload avatar thành công");
      setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : prev));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Upload avatar thất bại");
    }
  };

  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        <h2 className="text-xl font-bold mt-2">{user.fullName}</h2>
        <div className="w-full mt-4 space-y-2">
          <InfoItem label="Quyền" value={user.role} />
          <InfoItem label="Điểm trung thành" value={user.loyalty_points?.toLocaleString() ?? 0} />
          <InfoItem label="Cấp độ thành viên" value={user.membership_level ?? "-"} />
          <InfoItem label="created_at" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"} />
          <InfoItem label="updated_at" value={user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "-"} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
        <FormField label="Tên truy cập" name="username" value={user.username} disabled />
        <FormField label="Họ và tên" name="fullName" value={form.fullName || ""} onChange={handleChange} />
        <FormField label="Email" name="email" value={form.email || ""} onChange={handleChange} />
        <FormField label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} />
        <FormField label="Ngày sinh" type="date" name="dob" value={form.dob?.split("T")[0] || ""} onChange={handleChange} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Giới tính</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cập nhật
          </button>
          <button
            onClick={() =>
              setForm({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
              })
            }
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Hủy thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-2 border rounded bg-gray-50">
      <span className="font-medium">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="border rounded w-full p-2"
      />
    </div>
  );
}
