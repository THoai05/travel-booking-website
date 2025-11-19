"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import * as XLSX from "sheetjs-style";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface UserData {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  provider: "local" | "google" | "github";
  avatar: string | null;
  lastLogin: string;
  userCreatedAt: string;
  userUpdatedAt: string;
  totalBookings: string;
  pending: string;
  confirmed: string;
  cancelled: string;
  completed: string;
  expired: string;
  paidAmount: string;
  unpaidAmount: string;
  totalPaid: string;
  totalUnpaid: string;
}

export function TablesSectionUser2() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof UserData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/get-all-booking");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
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

  const exportExcel = () => {
    if (!users.length) return;

    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [["User Report"]], { origin: "A1" });
    ws["A1"].s = { font: { bold: true, sz: 14, color: { rgb: "1F4E78" } }, alignment: { horizontal: "center", vertical: "center" } };
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } }];

    XLSX.utils.sheet_add_aoa(ws, [[`Generated at: ${new Date().toLocaleString()}`]], { origin: "A2" });
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 15 } });

    // Style ô A2: căn giữa + chữ nghiêng
    ws["A2"].s = {
      font: { italic: true, color: { rgb: "1F4E78" }, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" }
    };


    const header = [
      "User ID", "Username", "Full Name", "Email", "Provider",
      "Created At", "Updated At", "Last Login",
      "Total Bookings", "Pending", "Confirmed", "Cancelled", "Completed", "Expired",
      "Paid Amount", "Unpaid Amount"
    ];
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A3" });

    // Style header
    for (let c = 0; c < header.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    }

    // Add data rows
    users.forEach((u, i) => {
      const row = [
        u.userId, u.username, u.fullName, u.email, u.provider,
        formatDateUTC(u.userCreatedAt), formatDateUTC(u.userUpdatedAt), formatDateUTC(u.lastLogin),
        Number(u.totalBookings), Number(u.pending), Number(u.confirmed), Number(u.cancelled), Number(u.completed), Number(u.expired),
        Number(u.paidAmount), Number(u.unpaidAmount)
      ];
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${i + 4}` });

      for (let c = 0; c < row.length; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r: i + 3, c });

        // Style mặc định: căn giữa + viền
        ws[cellAddr].s = {
          alignment: { horizontal: "center", vertical: "center" },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
          fill: { fgColor: { rgb: i % 2 === 0 ? "FFFFFF" : "F3F3F3" } } // zebra row
        };

        // Paid / Unpaid >0
        if (c === 14 && row[c] > 0) {
          ws[cellAddr].s.fill = { fgColor: { rgb: "C6EFCE" } }; // Paid xanh nhạt
        }
        if (c === 15 && row[c] > 0) {
          ws[cellAddr].s.fill = { fgColor: { rgb: "FFC7CE" } }; // Unpaid đỏ nhạt
        }

        // Format VND cho Paid / Unpaid
        if (c === 14 || c === 15) {
          ws[cellAddr].z = "#,##0₫";
        }
      }
    });

    ws["!cols"] = Array(header.length).fill({ wch: 15 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Stats");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `UserReport_${new Date().toISOString()}.xlsx`);
  };



  // Filter + sort + paginate
  const filteredUsers = users
    .filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: keyof UserData) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  return (
    <div className="mb-8 ">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>User Dashboard</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search username/email"
              className="px-2 py-1 border rounded"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Export Excel
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div>Loading...</div> : !users.length ? <div>No user data available.</div> : (
            <div className="overflow-x-auto w-[70vw] mx-auto">
              <table className="min-w-max border border-gray-200 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort("userId")}>User ID</th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort("username")}>Username</th>
                    <th className="border p-2 cursor-pointer">Full Name</th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort("email")}>Email</th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort("provider")}>Provider</th>
                    <th className="border p-2 cursor-pointer">Created At</th>
                    <th className="border p-2 cursor-pointer">Updated At</th>
                    <th className="border p-2 cursor-pointer">Last Login</th>
                    <th className="border p-2 cursor-pointer">Total</th>
                    <th className="border p-2 cursor-pointer">Pending</th>
                    <th className="border p-2 cursor-pointer">Confirmed</th>
                    <th className="border p-2 cursor-pointer">Cancelled</th>
                    <th className="border p-2 cursor-pointer">Completed</th>
                    <th className="border p-2 cursor-pointer">Expired</th>
                    <th className="border p-2 cursor-pointer">Paid Amount</th>
                    <th className="border p-2 cursor-pointer">Unpaid Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(u => (
                    <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-2">{u.userId}</td>
                      <td className="border p-2">{u.username}</td>
                      <td className="border p-2">{u.fullName}</td>
                      <td className="border p-2">{u.email}</td>
                      <td className="border p-2">{u.provider}</td>
                      <td className="border p-2">{formatDateUTC(u.userCreatedAt)}</td>
                      <td className="border p-2">{formatDateUTC(u.userUpdatedAt)}</td>
                      <td className="border p-2">{formatDateUTC(u.lastLogin)}</td>
                      <td className={`border p-2 ${Number(u.totalBookings) > 0 ? "bg-blue-100" : ""}`}>
                        {u.totalBookings}
                      </td>
                      <td className={`border p-2 ${Number(u.pending) > 0 ? "bg-yellow-100" : ""}`}>
                        {u.pending}
                      </td>
                      <td className={`border p-2 ${Number(u.confirmed) > 0 ? "bg-green-100" : ""}`}>
                        {u.confirmed}
                      </td>
                      <td className={`border p-2 ${Number(u.cancelled) > 0 ? "bg-red-100" : ""}`}>
                        {u.cancelled}
                      </td>
                      <td className={`border p-2 ${Number(u.completed) > 0 ? "bg-purple-100" : ""}`}>
                        {u.completed}
                      </td>
                      <td className={`border p-2 ${Number(u.expired) > 0 ? "bg-gray-200" : ""}`}>
                        {u.expired}
                      </td>
                      <td className={`border p-2 ${Number(u.paidAmount) > 0 ? "bg-green-200" : ""}`}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(u.paidAmount))}
                      </td>
                      <td className={`border p-2 ${Number(u.unpaidAmount) > 0 ? "bg-red-200" : ""}`}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(u.unpaidAmount))}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between mt-2">
                <button
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
