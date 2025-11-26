"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUsers, deleteUser } from "@/service/users/userService";
import DashboardPage from "./dashboard/page"; // import trực tiếp component
import BookingHistoryPage from "./booking-history/page"; // import trực tiếp component
import ProfilePage from "./edit/page"; // import trực tiếp component
import Register from "./add/page"; // import trực tiếp component
import { toast } from "react-hot-toast";
import ResetPasswordPage from "./reset-password/page"; // import trực tiếp ResetPasswordPage component
import TripHistoryPage from "./trip-history/page"; // import trực tiếp component
import api from "@/axios/axios";

import {
  Activity, Monitor, Pencil, Trash2, History, Key, X, Maximize2
} from "lucide-react";

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  membershipLevel: string;
  avatar?: string;
  loyaltyPoints: number;
  createdAt?: string;
  updatedAt?: string;
  dob?: string;
}

export default function UserPage() {
  const router = useRouter();

  // 🧩 State
  const [users, setUsers] = useState<User[]>([]);
  const [oldUsers, setOldUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersPerPage = 5;

  const [sortColumn, setSortColumn] = useState<keyof User>("id");

  const [showDashboard, setShowDashboard] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPasswordPage, setShowResetPasswordPage] = useState(false);
  const [showTripHistoryPage, setShowTripHistoryPage] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // 🕒 Lấy danh sách và so sánh với cũ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/check-avatars");
        const data = await getUsers();
        if (JSON.stringify(data) !== JSON.stringify(oldUsers)) {
          setUsers(data);
          setOldUsers(data);

          setShowDashboard(prev => {
            if (prev) {
              setTimeout(() => toast.error("Thông tin thay đổi: Đã đóng Dashboard.", {
                icon: "⚠️",
                id: "dashboard-error" // <--- Thêm dòng này (ID phải duy nhất cho mỗi loại)
              }), 0);
              return false;
            }
            return prev;
          });

          setShowBookingHistory(prev => {
            if (prev) {
              setTimeout(() => toast.error("Danh sách thay đổi: Đã làm mới Lịch sử đặt phòng.", {
                icon: "⚠️",
                id: "booking-error" // <--- ID khác nhau
              }), 0);
              return false;
            }
            return prev;
          });

          // setShowProfilePage(prev => {
          //   if (prev) {
          //     setTimeout(() => toast.error("Thông tin thay đổi: Đã đóng trang Hồ sơ.", {
          //       icon: "⚠️",
          //       id: "profile-error"
          //     }), 0);
          //     return false;
          //   }
          //   return prev;
          // });

          setShowRegister(prev => {
            if (prev) {
              setTimeout(() => toast.error("Dữ liệu thay đổi: Đã đóng form Đăng ký.", {
                icon: "⚠️",
                id: "register-error"
              }), 0);
              return false;
            }
            return prev;
          });

          setShowResetPasswordPage(prev => {
            if (prev) {
              setTimeout(() => toast.error("Hệ thống cập nhật: Đã đóng form Đổi mật khẩu.", {
                icon: "⚠️",
                id: "reset-pass-error"
              }), 0);
              return false;
            }
            return prev;
          });

          setShowTripHistoryPage(prev => {
            if (prev) {
              setTimeout(() => toast.error("Dữ liệu mới: Đã đóng Lịch sử chuyến đi.", {
                icon: "⚠️",
                id: "trip-error"
              }), 0);
              return false;
            }
            return prev;
          });

          setShowFull(prev => {
            if (prev) {
              setTimeout(() => toast.error("Danh sách User thay đổi: Đã thoát chế độ Toàn màn hình.", {
                icon: "⚠️",
                id: "full-mode-error"
              }), 0);
              return false;
            }
            return prev;
          });

          // Hiện thông báo
          //toast.error("Dữ liệu trong danh sách đã bị thay đổi, trang đã được làm mới!");
        }
      } catch (error) {
        //console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [oldUsers]);


  // // Reset page khi lọc role
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [filterRole]);

  // // Reset page khi search
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [search]);

  // // Reset page khi sort
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [sortColumn, sortOrder]);


  // 🔹 Delete user
  const handleDelete = async (userId: number) => {
    try {
      if (confirm("Bạn có chắc muốn xóa user này?")) {
        const data = await deleteUser(userId);
        toast.success(data.message || "✅ Xóa thành công!");
        setUsers(users.filter((u) => u.id !== userId)); // refresh danh sách local
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  // 🔍 Filter + search + sort
  const filteredUsers = users
    .filter(
      (u) =>
        (filterRole === "all" || u.role === filterRole) &&
        (u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // So sánh string hay number
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as any) - (bValue as any)
          : (bValue as any) - (aValue as any);
      }
    });

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(1);   // hoặc setCurrentPage(totalPages)
    }
  }, [filteredUsers]);


  // 📄 Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      // Nếu click lại cột đang sắp xếp thì đảo thứ tự
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Nếu click cột mới thì đặt cột đó và sắp xếp tăng dần
      setSortColumn(column);
      setSortOrder("asc");
    }
  };


  const openModal = (user: User) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const getPaginationNumbers = () => {
    const nums: (number | string)[] = [];
    const max = 5; // số nút hiển thị tối đa trước khi hiển thị "..."
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 1, totalPages - 1);

      if (start > 2) nums.push("...");
      for (let i = start; i <= end; i++) nums.push(i);
      if (end < totalPages - 1) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  };

  const formatDateUTC = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      timeZone: "UTC",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  // =================== sử dụng toLocaleDateString với UTC ===================
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { timeZone: "UTC" });
  };

  // 1. Định nghĩa class cho trạng thái BÌNH THƯỜNG (False)
  const containerNormal = "flex flex-col sm:flex-row min-h-screen bg-[#f5f7fa] p-2 sm:p-6 overflow-x-hidden";
  const boxNormal = "flex-1 w-full max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 relative transition-all";

  // 2. Định nghĩa class cho trạng thái FULL MÀN HÌNH (True)
  const containerFull = "fixed inset-0 z-50 overflow-y-auto bg-[#f5f7fa] animate-in fade-in duration-200";
  const boxFull = "relative w-full max-w-7xl mx-auto bg-white min-h-screen sm:min-h-fit sm:mt-6 sm:mb-6 sm:rounded-2xl shadow-2xl p-4 sm:p-8";

  return (
    // Dùng toán tử 3 ngôi: showFull ? classFull : classNormal
    <div className={showFull ? containerFull : containerNormal}>

      <div className={showFull ? boxFull : boxNormal}>

        {/* --- NÚT ĐIỀU KHIỂN (Góc phải) --- */}
        <button
          onClick={() => setShowFull(!showFull)} // Đảo ngược trạng thái
          className={`absolute top-4 right-4 p-2 rounded-full transition shadow-sm z-10 ${showFull
            ? "bg-red-50 text-red-500 hover:bg-red-100"  // Style nút X
            : "bg-blue-50 text-blue-500 hover:bg-blue-100" // Style nút Mở rộng
            }`}
          title={showFull ? "Thu nhỏ" : "Mở rộng"}
        >
          {/* Nếu showFull = true thì hiện icon X, ngược lại hiện icon Mở rộng */}
          {showFull ? <X size={24} /> : <Maximize2 size={24} />}
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">👥 Quản lý người dùng</h1>

        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            className="border border-gray-300 px-4 py-2 bg-green-0 text-black rounded-[5px] hover:bg-green-50 transition"
            onClick={() => setShowRegister(true)}
          >
            📝 Thêm User
          </button>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm người dùng..."
            className="border border-gray-300 rounded-[5px] px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>

          <div>
            <button
              onClick={() => setShowDashboard(true)}
              className="border p-2 rounded bg-green-200 hover:bg-green-300 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Thống kê
            </button>

            {showDashboard && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-7xl max-h-[90vh] rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Thống kê</h2>
                    <button
                      onClick={() => setShowDashboard(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Nội dung dashboard */}
                  <DashboardPage />
                </div>
              </div>
            )}



            {showBookingHistory && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Lịch sử đặt phòng</h2>
                    <button
                      onClick={() => setShowBookingHistory(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Nội dung dashboard */}
                  <BookingHistoryPage setShowTripHistoryPage={setShowTripHistoryPage} />
                </div>
              </div>
            )}

            {showTripHistoryPage && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Lịch sử đặt phòng</h2>
                    <button
                      onClick={() => setShowTripHistoryPage(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Nội dung dashboard */}
                  <TripHistoryPage />
                </div>
              </div>
            )}

            {showProfilePage && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Sửa thông tin người dùng</h2>
                    <button
                      onClick={() => setShowProfilePage(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Nội dung dashboard */}
                  <ProfilePage />
                </div>
              </div>
            )}

            {showRegister && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-xl h-full max-h-xl rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Đăng ký người dùng</h2>
                    <button
                      onClick={() => setShowRegister(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Nội dung dashboard */}
                  <Register setShowRegister={setShowRegister} />
                </div>
              </div>
            )}

            {showResetPasswordPage && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white max-w-xl rounded-lg shadow-lg overflow-auto p-4 relative">
                  {/* Header với nút đóng */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Đổi mật khẩu</h2>
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem("token-reset-password");

                        if (token) {
                          try {
                            await api.post("/reset-password/delete-token", { token });
                            localStorage.removeItem("token-reset-password"); // xóa token khỏi localStorage
                            setShowResetPasswordPage(false);
                          } catch (error) {
                            console.error("Failed to delete reset token:", error);
                          }
                        } else {
                          setShowResetPasswordPage(false); // nếu không có token, chỉ tắt popup
                        }
                      }}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>

                  </div>

                  {/* Nội dung dashboard */}
                  <ResetPasswordPage setShowResetPasswordPage={setShowResetPasswordPage} />
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            <img
              src="https://avatars.githubusercontent.com/u/9919?s=128&v=4"
              alt="404 Not Found"
              className="w-32 h-32 mb-4 rounded-full"
            />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">404</h2>
            <p className="text-gray-500 text-center">
              Không tìm thấy dữ liệu phù hợp. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.
            </p>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3 cursor-pointer text-center hover:text-blue-500 select-none" onClick={() => handleSort("id")}>ID {sortColumn === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3  text-center">Avatar</th>
                    <th className="p-3 cursor-pointer text-center hover:text-blue-500 select-none" onClick={() => handleSort("username")}>Username {sortColumn === "username" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 cursor-pointer  text-center hover:text-blue-500 select-none" onClick={() => handleSort("fullName")}>Full Name {sortColumn === "fullName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 cursor-pointer  text-center hover:text-blue-500 select-none" onClick={() => handleSort("email")}>Email {sortColumn === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 cursor-pointer text-center hover:text-blue-500 select-none" onClick={() => handleSort("phone")}>Phone {sortColumn === "phone" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 cursor-pointer  text-center hover:text-blue-500 select-none" onClick={() => handleSort("role")}>Role {sortColumn === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 cursor-pointer  text-center hover:text-blue-500 select-none" onClick={() => handleSort("dob")}>Dob {sortColumn === "dob" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      className="border-b hover:bg-blue-50 transition cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => openModal(user)}
                    >
                      <td className="p-3 text-center">{user.id}</td>
                      <td className="p-3 text-center">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          {/* Cánh trái */}
                          <svg className="absolute -left-6 w-16 h-16 animate-wing-left" viewBox="0 0 64 64">
                            <defs>
                              <linearGradient id={`gradientLeft-${user.id}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={user?.membershipLevel === "Gold" ? "#facc15" : user?.membershipLevel === "Platinum" ? "#3b82f6" : "#9ca3af"} />
                                <stop offset="50%" stopColor={user?.membershipLevel === "Gold" ? "#fcd34d" : user?.membershipLevel === "Platinum" ? "#8b5cf6" : "#d1d5db"} />
                                <stop offset="100%" stopColor={user?.membershipLevel === "Gold" ? "#fbbf24" : user?.membershipLevel === "Platinum" ? "#ec4899" : "#9ca3af"} />
                              </linearGradient>
                            </defs>
                            <path d="M32 32 C10 10, 0 64, 32 32" fill={`url(#gradientLeft-${user.id})`} />
                          </svg>
                          {/* Cánh phải */}
                          <svg className="absolute -right-6 w-16 h-16 animate-wing-right" viewBox="0 0 64 64">
                            <defs>
                              <linearGradient id={`gradientRight-${user.id}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={user?.membershipLevel === "Gold" ? "#facc15" : user?.membershipLevel === "Platinum" ? "#3b82f6" : "#9ca3af"} />
                                <stop offset="50%" stopColor={user?.membershipLevel === "Gold" ? "#fcd34d" : user?.membershipLevel === "Platinum" ? "#8b5cf6" : "#d1d5db"} />
                                <stop offset="100%" stopColor={user?.membershipLevel === "Gold" ? "#fbbf24" : user?.membershipLevel === "Platinum" ? "#ec4899" : "#9ca3af"} />
                              </linearGradient>
                            </defs>
                            <path d="M32 32 C54 10, 64 64, 32 32" fill={`url(#gradientRight-${user.id})`} />
                          </svg>
                          {/* Avatar với gradient border */}
                          <div className={`relative flex items-center justify-center ${user?.membershipLevel === "Platinum" ? "w-8 h-13 rounded-[80%/40%] p-[2px]" : "w-12 h-13 rounded-full p-[3px]"} ${user?.membershipLevel === "Gold" ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" : user?.membershipLevel === "Platinum" ? "bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500" : "bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400"}`}>
                            <img src={user?.avatar || "https://avatars.githubusercontent.com/u/9919?s=128&v=4"} alt="User Avatar" className={`w-full h-full object-cover ${user?.membershipLevel === "Platinum" ? "rounded-[50%/40%]" : "rounded-full"}`} />
                            <div className="absolute inset-0 pointer-events-none">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="absolute w-1 h-2 bg-white opacity-70 rounded-full animate-feather" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${1 + Math.random() * 1.5}s` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3  text-center">{user.username}</td>
                      <td className="p-3 text-center">{user.fullName}</td>
                      <td className="p-3 text-center">{user.email}</td>
                      <td className="p-3 text-center">{user.phone}</td>
                      <td className="p-3 font-medium text-center">
                        {user.role === "admin" ? <span className="text-red-500">Admin</span> : <span className="text-blue-500">Customer</span>}
                      </td>
                      <td className="p-3 text-center">{formatDate(user.dob)}</td>
                      <td className="p-3 flex gap-2 text-center">
                        <div className="flex flex-col space-y-4">
                          {/* Nhóm nút Sửa + Xóa */}
                          <div className="flex space-x-3">
                            <button
                              className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-black rounded hover:bg-yellow-100 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                localStorage.setItem("editUserId", user.id.toString());
                                setShowProfilePage(true);
                              }}
                            >
                              <Pencil size={16} /> Sửa
                            </button>

                            {user.role !== "admin" && (
                              <>
                                <button
                                  className="flex items-center gap-1 px-3 py-1 bg-red-50 text-black rounded hover:bg-red-100 transition"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(user.id);
                                  }}
                                >
                                  <Trash2 size={16} /> Xóa
                                </button>
                              </>
                            )}

                            <button
                              className="flex items-center gap-1 px-3 py-1 bg-red-50 text-black rounded hover:bg-red-100 transition"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const res = await api.post("/reset-password/reset-password", {
                                  userId: user.id,      // bạn phải truyền userId vào
                                  expireMinutes: 5         // có thể bỏ nếu dùng default
                                });

                                const token = res.data.token;
                                localStorage.setItem("token-reset-password", token.toString());

                                setShowResetPasswordPage(true);
                              }}
                            >
                              <Key size={16} />Password
                            </button>
                          </div>

                          {/* Chỉ hiển thị nếu user KHÔNG PHẢI là admin */}
                          {user.role !== "admin" && (
                            <>
                              {/* Nút xem lịch sử đặt phòng */}
                              <button
                                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-black rounded hover:bg-blue-100 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem("editUserId", user.id.toString());
                                  setShowBookingHistory(true);
                                }}
                              >
                                <History size={16} /> Booking history
                              </button>

                              {/* Nút xem lịch sử chuyến đi */}
                              <button
                                className="flex items-center gap-1 px-3 py-1 bg-red-50 text-black rounded hover:bg-blue-100 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem("editUserId", user.id.toString());
                                  setShowTripHistoryPage(true);
                                }}
                              >
                                <History size={16} /> Trip History
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </motion.tr>
                  ))}
                </tbody>
              </table>

            </div>

            {/* Mobile Cards */}
            <div className="grid sm:hidden gap-4">
              {currentUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  // SỬA 1: flex-col để tách phần thông tin và phần nút thành 2 tầng
                  className="bg-gray-50 rounded-xl shadow-md p-4 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition w-full overflow-hidden"
                  onClick={() => openModal(user)}
                >
                  {/* PHẦN 1: THÔNG TIN + AVATAR */}
                  <div className="flex items-start gap-4 w-full">
                    <motion.img
                      src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="avatar"
                      // Giữ kích thước avatar cố định, không bị co
                      className="w-14 h-14 rounded-full border border-gray-300 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate leading-tight">{user.fullName}</h3>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <p className="text-sm text-gray-600 truncate">{user.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${user.role === "admin"
                          ? "bg-red-100 text-red-600 border-red-200"
                          : "bg-blue-100 text-blue-600 border-blue-200"
                          }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PHẦN 2: CÁC NÚT BẤM (Đưa ra khỏi hàng ngang của Avatar) */}
                  {/* Border top nhẹ để ngăn cách */}
                  <div className="pt-3 border-t border-gray-200 w-full">
                    <div className="flex flex-wrap gap-2 w-full">

                      {/* Nút Sửa */}
                      <button
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-3 py-1.5 bg-yellow-50 text-black rounded border border-yellow-200 hover:bg-yellow-100 transition text-xs font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.setItem("editUserId", user.id.toString());
                          setShowProfilePage(true);
                        }}
                      >
                        <Pencil size={14} /> Sửa
                      </button>

                      {/* Nút Xóa */}
                      {user.role !== "admin" && (
                        <button
                          className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-black rounded border border-red-200 hover:bg-red-100 transition text-xs font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id);
                          }}
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      )}

                      {/* Nút Password */}
                      <button
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-black rounded border border-gray-200 hover:bg-gray-200 transition text-xs font-medium"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await api.post("/reset-password/reset-password", {
                            userId: user.id,
                            expireMinutes: 5,
                          });
                          const token = res.data.token;
                          localStorage.setItem("token-reset-password", token.toString());
                          setShowResetPasswordPage(true);
                        }}
                      >
                        <Key size={14} /> Reset Pass
                      </button>
                      {user.role !== "admin" && (
                        <>
                          {/* Nút Booking History */}
                          <button
                            className="flex-grow flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-black rounded border border-blue-200 hover:bg-blue-100 transition text-xs font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("editUserId", user.id.toString());
                              setShowBookingHistory(true);
                            }}
                          >
                            <History size={14} /> Booking
                          </button>

                          {/* Nút Trip History */}
                          <button
                            className="flex-grow flex items-center justify-center gap-1 px-3 py-1.5 bg-purple-50 text-black rounded border border-purple-200 hover:bg-purple-100 transition text-xs font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("editUserId", user.id.toString());
                              setShowTripHistoryPage(true);
                            }}
                          >
                            <History size={14} /> Trip
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              {getPaginationNumbers().map((num, i) => (
                <button
                  key={i}
                  disabled={num === "..."}
                  onClick={() => typeof num === "number" && setCurrentPage(num)}
                  className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-80 sm:max-w-96 shadow-2xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
                onClick={closeModal}
              >
                ✖
              </button>
              <motion.img
                src={selectedUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                className="w-28 h-28 rounded-full border mx-auto mb-4 shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
              />
              <h2 className="text-center text-xl font-bold mb-2">{selectedUser.fullName}</h2>
              <p className="text-center text-gray-600 mb-1">📋 @{selectedUser.username}</p>
              <p className="text-center text-gray-600">📧 {selectedUser.email}</p>
              <p className="text-center text-gray-600 mb-2">📞 {selectedUser.phone}</p>
              <p className="text-center text-gray-600 mb-2">🗓️ Created At: {formatDateUTC(selectedUser.createdAt)}</p>
              <p className="text-center text-gray-600 mb-2">🗓️ Updated At: {formatDateUTC(selectedUser.updatedAt)}</p>
              <p
                className={`text-center font-medium ${selectedUser.role === "admin" ? "text-red-500" : "text-blue-500"
                  }`}
              >
                🎭 {selectedUser.role === "admin" ? "Administrator" : "Customer"}
              </p>
              {/* Membership */}
              <div className="text-center text-gray-600 mb-2">
                <span
                  className={
                    selectedUser.membershipLevel === "Silver"
                      ? "text-gray-400"
                      : selectedUser.membershipLevel === "Gold"
                        ? "text-yellow-400"
                        : selectedUser.membershipLevel === "Platinum"
                          ? "text-blue-600"
                          : "text-gray-400"
                  }
                >
                  {selectedUser.membershipLevel === "Silver"
                    ? "🥈"
                    : selectedUser.membershipLevel === "Gold"
                      ? "🥇"
                      : selectedUser.membershipLevel === "Platinum"
                        ? "🏆"
                        : "🥈"}
                </span>
                <span className={
                  selectedUser.membershipLevel === "Silver"
                    ? "text-gray-400"
                    : selectedUser.membershipLevel === "Gold"
                      ? "text-yellow-400"
                      : selectedUser.membershipLevel === "Platinum"
                        ? "text-blue-600"
                        : "text-gray-400"
                }>
                  {selectedUser.membershipLevel ?? "Silver"} ({selectedUser.loyaltyPoints ?? 0} điểm)
                </span>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
