"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { useRouter } from "next/navigation";

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
  loyaltyPoints?: number;
  membershipLevel?: string;
  createdAt?: string;
  updatedAt?: string;
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
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // =================== Sử dụng toLocaleDateString với UTC ===================
  const formatDateUTC = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { timeZone: "UTC" });
  };

  // =================== LẤY THÔNG TIN NGƯỜI DÙNG VỚI POLLING ===================
  useEffect(() => {
    let interval: NodeJS.Timer;

    const fetchProfileAndUser = async () => {
      try {
        const tokenData = localStorage.getItem("token");
        if (!tokenData) {
          router.push("/client"); // hoặc "/"
        }

        const parsed = JSON.parse(tokenData);
        const token = parsed.token;

        const profileRes = await fetch("/api/auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await profileRes.json();
        const userId = Number(profileData.id);
        setUserId(userId);

        const res = await api.get(`/users/${userId}`);
        const data = res.data.user || res.data;

        // Nếu dữ liệu mới khác dữ liệu cũ, cập nhật user và form
        if (JSON.stringify(data) !== JSON.stringify(user)) {
          setUser(data);
          setForm({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            dob: data.dob,
            gender: data.gender,
          });
        }
      } catch (err: any) {
        //console.error(err);
      }
    };

    fetchProfileAndUser(); // lần đầu load
    interval = setInterval(fetchProfileAndUser, 3000); // polling mỗi 3s

    return () => clearInterval(interval);
  }, [user]);

  // =================== XỬ LÝ INPUT ===================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =================== CẬP NHẬT THÔNG TIN ===================
  const handleSubmit = async () => {
    const { fullName, email, phone, dob } = form;
    setError("");

    try {
      setLoading(true);
      setLoadingMessage("Đang kiểm tra thông tin...");

      if (!fullName) {
        setError("Vui lòng nhập họ và tên.");
        setLoading(false);
        return;
      }
      if (fullName.length > 100) {
        setError("Họ và tên không được quá 100 ký tự.");
        setLoading(false);
        return;
      }
      const fullNameRegex = /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/;
      if (!fullNameRegex.test(fullName)) {
        setError("Họ và tên không có số, ký tự đặc biệt.");
        setLoading(false);
        return;
      }

      if (!email) {
        setError("Vui lòng nhập email.");
        setLoading(false);
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!(?:[0-9]+\.)+[a-zA-Z]{2,})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setError("Sai định dạng email.");
        setLoading(false);
        return;
      }
      if (email.length > 100) {
        setError("Email không dài quá 100 ký tự.");
        setLoading(false);
        return;
      }

      if (phone) {
        const phoneRegex = /^(0|\+84)\d{9,10}$/;
        if (!phoneRegex.test(phone) || phone.length > 20) {
          setError("Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có từ 10–11 chữ số.");
          setLoading(false);
          return;
        }
      }

      // 6. Kiểm tra Ngày sinh (dob)
      if (dob) {
        const today = new Date();
        const birthDate = new Date(dob);

        today.setHours(0, 0, 0, 0); // Bỏ qua giờ để so sánh ngày
        birthDate.setHours(0, 0, 0, 0);

        // Nếu ngày sinh trong tương lai
        if (birthDate > today) {
          setError("Ngày sinh không được lớn hơn ngày hiện tại.");
          setLoading(false);
          return;
        }

        // Tính tuổi
        const age =
          today.getFullYear() -
          birthDate.getFullYear() -
          (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        if (age < 16) {
          setError("Bạn phải đủ 16 tuổi trở lên.");
          setLoading(false);
          return;
        }
      }


      setLoadingMessage("Đang cập nhật thông tin...");
      const res = await api.patch(`/users/${userId}`, form);
      const data = res.data;

      alert(data.message || "Cập nhật thành công");
      setUser((prev) => (prev ? { ...prev, ...form } : prev));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // =================== UPLOAD AVATAR ===================
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      setLoadingMessage("Đang tải ảnh lên...");
      const res = await api.post(`/users/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      alert("Upload avatar thành công");
      setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : prev));
    } catch (err: any) {
      let message = "Upload avatar thất bại";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (err.response.data.message) {
          message = err.response.data.message;
        }
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/client"); // hoặc "/"
  };

  //if (!localStorage.getItem("token")) return <p>Không tìm thấy token...</p>;
  if (!user) return <p>Đang tải...</p>;
  

  return (
    <div className="relative flex flex-col md:grid md:grid-cols-2 gap-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* --- CỘT TRÁI --- */}
      <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-200 shadow-md">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow mb-3"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="text-sm text-gray-700 mb-3"
        />
        <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
          {user.fullName || "Họ và tên"}
        </h2>

        <div className="w-full max-w-xs md:max-w-sm space-y-2 text-left text-gray-800 bg-white/50 p-3 rounded-lg shadow-inner">
          <InfoItem label="Quyền" value={user.role} />
          <InfoItem label="Điểm trung thành" value={user.loyaltyPoints?.toLocaleString() ?? 0} />
          <InfoItem label="Cấp độ thành viên" value={user.membershipLevel ?? "0"} />
          <InfoItem label="created_at" value={formatDateUTC(user.createdAt)} />
          <InfoItem label="updated_at" value={formatDateUTC(user.updatedAt)} />
        </div>
      </div>

      {/* --- CỘT PHẢI --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-gray-800">
          Thông tin cá nhân
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <FormField
          label="Tên truy cập"
          name="username"
          value={user.username}
          disabled
          className="font-semibold text-gray-800 bg-gray-100"
        />

        <FormField label="Họ và tên" name="fullName" value={form.fullName || ""} onChange={handleChange} />
        <FormField label="Email" name="email" value={form.email || ""} onChange={handleChange} />
        <FormField label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} />
        <FormField label="Ngày sinh" type="date" name="dob" value={form.dob?.split("T")[0] || ""} onChange={handleChange} />

        {/* Giới tính */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Giới tính</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Hủy thay đổi
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-gray-800 font-medium"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-l-blue-500 border-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-700">{loadingMessage}</span>
          </div>
        </div>
      )}
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
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  type?: string;
  className?: string;
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
        className={`border rounded w-full p-2 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
      />
    </div>
  );
}
