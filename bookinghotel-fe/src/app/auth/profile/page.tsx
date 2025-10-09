"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  role: string;
  loyalty_points: number;
  membership_level: string;
  created_at: string;
  updated_at: string;
}

interface UpdateUserForm {
  full_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<UpdateUserForm>({});

  const userId = 2;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        // chỉ copy những field hợp lệ ra form
        setForm({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
        });
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // chỉ gửi 5 field hợp lệ
    });
    const data = await res.json();
    if (res.ok) {
      alert("Cập nhật thành công");
      // cập nhật lại dữ liệu hiển thị
      setUser((prev) => prev ? { ...prev, ...form } : prev);
    } else {
      alert(data.message || "Có lỗi xảy ra");
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
        <h2 className="text-xl font-bold">{user.full_name}</h2>
        <div className="w-full mt-4 space-y-2">
          <InfoItem label="Quyền" value={user.role} />
          <InfoItem label="Điểm trung thành" value={user.loyalty_points.toLocaleString()} />
          <InfoItem label="Cấp độ thành viên" value={user.membership_level} />
          <InfoItem label="created_at" value={new Date(user.created_at).toLocaleDateString()} />
          <InfoItem label="updated_at" value={new Date(user.updated_at).toLocaleDateString()} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
        <FormField label="Tên truy cập" name="username" value={user.username} disabled />
        <FormField label="Họ và tên" name="full_name" value={form.full_name || ""} onChange={handleChange} />
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
            onClick={() => setForm({
              full_name: user.full_name,
              email: user.email,
              phone: user.phone,
              dob: user.dob,
              gender: user.gender,
            })}
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
