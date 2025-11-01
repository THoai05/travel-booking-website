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
  avatar?: string;
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

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f5f7fa] p-4 sm:p-6 overflow-x-hidden">
      <div className="flex-1 w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">👥 Quản lý người dùng</h1>
          <button
            className="px-4 py-2 bg-green-400 text-white rounded-xl hover:bg-green-600 transition"
            onClick={() => router.push("/admin/user/add")}
          >
            ➕ Thêm User
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm người dùng..."
            className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        ?
                      </div>
                    )}
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
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem("editUserId", user.id.toString());
                        router.replace("/admin/user/edit");
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
                  className={`text-sm font-medium truncate ${
                    user.role === "admin" ? "text-red-500" : "text-blue-500"
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
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-xl ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
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
              <p className="text-center text-gray-600 mb-1">@{selectedUser.username}</p>
              <p className="text-center text-gray-600">{selectedUser.email}</p>
              <p className="text-center text-gray-600 mb-2">📞 {selectedUser.phone}</p>
              <p
                className={`text-center font-medium ${
                  selectedUser.role === "admin" ? "text-red-500" : "text-blue-500"
                }`}
              >
                {selectedUser.role === "admin" ? "Administrator" : "Customer"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
