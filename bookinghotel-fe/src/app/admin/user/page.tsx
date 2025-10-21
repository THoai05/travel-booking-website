"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getUsers } from "@/service/users/userService";

// 🔹 Interface định nghĩa kiểu dữ liệu User
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  avatar: string | null;
}

export default function UserPage() {
  // 🔹 State lưu danh sách user đầy đủ từ API
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // 🔹 State hiển thị trạng thái loading
  const [loading, setLoading] = useState(true);
  // 🔹 Phân trang
  const [page, setPage] = useState(1);
  const limit = 5; // số user trên 1 trang
  // 🔹 Sort
  const [sortBy, setSortBy] = useState<keyof User | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // 🔹 Tìm kiếm
  const [search, setSearch] = useState("");

  // 🔹 Hàm fetch dữ liệu user từ API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(); // gọi API từ userService
      setAllUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 useEffect load dữ liệu lần đầu và refresh mỗi 30 giây
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // auto-refresh 30s
    return () => clearInterval(interval); // clear interval khi unmount
  }, [fetchUsers]);

  // 🔹 Tìm kiếm user theo username, fullName, email
  const filteredUsers = useMemo(() => {
    if (!search) return allUsers;
    const lower = search.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(lower) ||
        u.fullName.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
  }, [allUsers, search]);

  // 🔹 Sắp xếp dữ liệu
  const sortedUsers = useMemo(() => {
    if (!sortBy) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  // 🔹 Chia trang: lấy user hiển thị trên trang hiện tại
  const displayedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return sortedUsers.slice(start, start + limit);
  }, [sortedUsers, page]);

  // 🔹 Tổng số trang
  const totalPages = Math.ceil(sortedUsers.length / limit);

  // 🔹 Hàm handle sort khi click vào header table
  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      // nếu click lại cột đang sort, đổi chiều
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // nếu click cột khác, set cột đó và sort asc
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // 🔹 Loading indicator
  if (loading) return <div>Đang tải danh sách người dùng...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Danh sách User</h1>

        {/* 🔹 Input tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm theo username, fullname hoặc email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // khi tìm kiếm, quay về trang 1
          }}
          className="mb-4 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 🔹 Table cho desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {[
                  "id",
                  "avatar",
                  "username",
                  "fullName",
                  "email",
                  "phone",
                  "role",
                ].map((col) => (
                  <th
                    key={col}
                    className={`p-2 cursor-pointer text-gray-700 ${
                      col === "email" || col === "phone"
                        ? "hidden md:table-cell"
                        : ""
                    }`}
                    onClick={() =>
                      col !== "avatar" && handleSort(col as keyof User)
                    }
                  >
                    {col}{" "}
                    {sortBy === col ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-2 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">
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
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2 hidden md:table-cell">{user.email}</td>
                    <td className="p-2 hidden md:table-cell">{user.phone}</td>
                    <td className="p-2">{user.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {displayedUsers.length === 0 ? (
            <div className="text-center text-gray-500">Không có dữ liệu</div>
          ) : (
            displayedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
              >
                {/* Avatar */}
                <div>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                      ?
                    </div>
                  )}
                </div>
                {/* User info */}
                <div className="flex-1">
                  <div className="font-bold text-lg">{user.username}</div>
                  <div className="text-gray-600">{user.fullName}</div>
                  <div className="text-gray-600">{user.email}</div>
                  <div className="text-gray-600">{user.phone}</div>
                  <div className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {user.role}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔹 Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
          <button
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
