"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import * as XLSX from "sheetjs-style";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface UserData {
  id: number;
  username: string;
  provider: "local" | "google" | "github";
  createdAt: string;
  updatedAt: string;
}

export function TablesSectionUser() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.users); // <-- sửa ở đây
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

    // --- Title ---
    XLSX.utils.sheet_add_aoa(ws, [["User Report"]], { origin: "A1" });
    ws["A1"].s = {
      font: { bold: true, sz: 14, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // --- Generated at ---
    XLSX.utils.sheet_add_aoa(ws, [[`Generated at: ${new Date().toLocaleString()}`]], { origin: "A2" });
    ws["A2"].s = {
      font: { italic: true, sz: 11, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 4 } });

    // --- Header ---
    const header = ["User ID", "Username", "Provider", "Created At", "Updated At"];
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A3" });
    for (let c = 0; c < header.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    }

    // --- Data ---
    users.forEach((u, i) => {
      const row = [u.id, u.username, u.provider, formatDateUTC(u.createdAt), formatDateUTC(u.updatedAt)];
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${i + 4}` });

      for (let c = 0; c < row.length; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r: i + 3, c });
        ws[cellAddr].s = {
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    ws["!cols"] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
    ];

    // --- Workbook ---
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Stats");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `UserReport_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div className="mb-8">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>User Dashboard</CardTitle>
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Export Excel
          </button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : !users.length ? (
            <div>No user data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">User ID</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Provider</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-2">{u.id}</td>
                      <td className="border p-2">{u.username}</td>
                      <td className="border p-2">{u.provider}</td>
                      <td className="border p-2">{formatDateUTC(u.createdAt)}</td>
                      <td className="border p-2">{formatDateUTC(u.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
