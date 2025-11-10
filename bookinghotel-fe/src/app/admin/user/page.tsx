"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUsers, deleteUser } from "@/service/users/userService";

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

  // 🕒 Lấy danh sách và so sánh với cũ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        if (JSON.stringify(data) !== JSON.stringify(oldUsers)) {
          setUsers(data);
          setOldUsers(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [oldUsers]);

  // 🔹 Delete user
  const handleDelete = async (userId: number) => {
    try {
      if (confirm("Bạn có chắc muốn xóa user này?")) {
        const data = await deleteUser(userId);
        alert(data.message || "Xóa thành công");
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
    .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

  // 📄 Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

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


  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f5f7fa] p-4 sm:p-6 overflow-x-hidden">
      <div className="flex-1 w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">👥 Quản lý người dùng</h1>

        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            className="border border-gray-300 px-4 py-2 bg-green-0 text-black rounded-[5px] hover:bg-green-50 transition"
            onClick={() => router.push("/admin/user/add")}
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
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th
                  className="p-3 cursor-pointer hover:text-blue-500 select-none"
                  onClick={handleSort}
                >
                  ID {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th className="p-3">Avatar</th>
                <th className="p-3">Username</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
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
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      {/* Cánh trái */}
                      <svg
                        className="absolute -left-6 w-16 h-16 animate-wing-left"
                        viewBox="0 0 64 64"
                      >
                        <defs>
                          <linearGradient id={`gradientLeft-${user.id}`} x1="0" y1="0" x2="1" y2="1">
                            <stop
                              offset="0%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#facc15"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#3b82f6"
                                    : "#9ca3af"
                              }
                            />
                            <stop
                              offset="50%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#fcd34d"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#8b5cf6"
                                    : "#d1d5db"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#fbbf24"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#ec4899"
                                    : "#9ca3af"
                              }
                            />
                          </linearGradient>
                        </defs>
                        <path d="M32 32 C10 10, 0 64, 32 32" fill={`url(#gradientLeft-${user.id})`} />
                      </svg>

                      {/* Cánh phải */}
                      <svg
                        className="absolute -right-6 w-16 h-16 animate-wing-right"
                        viewBox="0 0 64 64"
                      >
                        <defs>
                          <linearGradient id={`gradientRight-${user.id}`} x1="0" y1="0" x2="1" y2="1">
                            <stop
                              offset="0%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#facc15"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#3b82f6"
                                    : "#9ca3af"
                              }
                            />
                            <stop
                              offset="50%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#fcd34d"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#8b5cf6"
                                    : "#d1d5db"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                user?.membershipLevel === "Gold"
                                  ? "#fbbf24"
                                  : user?.membershipLevel === "Platinum"
                                    ? "#ec4899"
                                    : "#9ca3af"
                              }
                            />
                          </linearGradient>
                        </defs>
                        <path d="M32 32 C54 10, 64 64, 32 32" fill={`url(#gradientRight-${user.id})`} />
                      </svg>

                      {/* Avatar với gradient border */}
                      <div
                        className={`relative flex items-center justify-center
    ${user?.membershipLevel === "Platinum"
                            ? "w-8 h-13 rounded-[80%/40%] p-[2px]" // bầu dục mỏng hơn
                            : "w-12 h-13 rounded-full p-[3px]"      // tròn
                          }
    ${user?.membershipLevel === "Gold"
                            ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                            : user?.membershipLevel === "Platinum"
                              ? "bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500"
                              : "bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400"
                          }
  `}
                      >
                        <img
                          src={user?.avatar || "https://avatars.githubusercontent.com/u/9919?s=128&v=4"}
                          alt="User Avatar"
                          className={`w-full h-full object-cover ${user?.membershipLevel === "Platinum" ? "rounded-[50%/40%]" : "rounded-full"
                            }`}
                        />

                        {/* Lông rơi */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-2 bg-white opacity-70 rounded-full animate-feather"
                              style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random() * 1.5}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                  </td>

                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3 font-medium">
                    {user.role === "admin" ? (
                      <span className="text-red-500">Admin</span>
                    ) : (
                      <span className="text-blue-500">Customer</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="px-2 py-1 bg-yellow-0 text-black rounded hover:bg-yellow-100 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem("editUserId", user.id.toString());
                        router.replace("/admin/user/edit");
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="px-2 py-1 bg-red-0 text-black rounded hover:bg-red-100 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.id);
                      }}
                    >
                      🗑️ Xóa
                    </button>
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
              whileHover={{ scale: 1.03 }}
              className="bg-gray-50 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition w-full"
              onClick={() => openModal(user)}
            >
              <motion.img
                src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full border border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <p className="text-sm text-gray-600 truncate">{user.phone}</p>
                <p
                  className={`text-sm font-medium truncate ${user.role === "admin" ? "text-red-500" : "text-blue-500"
                    }`}
                >
                  {user.role}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    localStorage.setItem("editUserId", user.id.toString());
                    router.push("/admin/user/edit");
                  }}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                >
                  🗑️ Xóa
                </button>
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
