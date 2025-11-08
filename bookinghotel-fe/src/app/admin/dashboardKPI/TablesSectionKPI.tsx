"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import XLSX from 'sheetjs-style';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIItem {
  date: string;
  totalBookings: number;
  cancelledBookings: number;
  revenue: number;
  status: Record<string, number>;
}

export function TablesSectionKPI() {
  const [kpiData, setKpiData] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    fetchKPI(type);
  }, [type]);

  const fetchKPI = async (selectedType: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/export-data/${selectedType}`);
      const data = res.data?.data;
      const labels: string[] = res.data?.labels ?? [];

      if (!data || !labels.length) {
        setKpiData([]);
        return;
      }

      const formattedData: KPIItem[] = labels.map((date, index) => ({
        date,
        totalBookings: data.totalBookings?.[index] ?? 0,
        cancelledBookings: data.cancelledBookings?.[index] ?? 0,
        revenue: data.revenue?.[index] ?? 0,
        status: {
          pending: data.statusCount?.pending?.[index] ?? 0,
          confirmed: data.statusCount?.confirmed?.[index] ?? 0,
          cancelled: data.statusCount?.cancelled?.[index] ?? 0,
          completed: data.statusCount?.completed?.[index] ?? 0,
          expired: data.statusCount?.expired?.[index] ?? 0,
        },
      }));

      setKpiData(formattedData);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      setKpiData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!kpiData.length) return;

    // 1. Chuyển dữ liệu thành array of arrays
    const dataRows = kpiData.map(item => [
      item.date,
      item.totalBookings,
      item.cancelledBookings,
      item.revenue,
      item.status.pending,
      item.status.confirmed,
      item.status.cancelled,
      item.status.completed,
      item.status.expired,
    ]);

    // 2. Tạo worksheet rỗng
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // 3. Thêm 3 dòng tiêu đề đẹp
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["KPI Dashboard Report"],
      [`Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`],
      [`Generated at: ${new Date().toLocaleString()}`]
    ], { origin: 0 });

    // Style tiêu đề
    ["A1", "A2", "A3"].forEach(key => {
      worksheet[key].s = {
        font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "1F4E78" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    });

    // 4. Thêm header bảng ở dòng 6
    const headerRow = ["Date", "Total Bookings", "Cancelled Bookings", "Revenue", "Pending", "Confirmed", "Cancelled", "Completed", "Expired"];
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 5 });

    // Style header
    const headerColor = "4F81BD";
    headerRow.forEach((_, idx) => {
      const cell = worksheet[XLSX.utils.encode_cell({ c: idx, r: 5 })]; // row=6 (0-based)
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Calibri", sz: 12 },
        fill: { fgColor: { rgb: headerColor } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    // 5. Thêm dữ liệu từ dòng 7
    XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 6 });

    // 6. Style dữ liệu + border
    const statusColors: Record<string, string> = { E: "FFF2CC", F: "D9EAD3", G: "F4CCCC", H: "CFE2F3", I: "E0E0E0" };
    const lastRow = 6 + dataRows.length;

    for (let r = 6; r < lastRow; r++) {
      for (let c = 0; c < 9; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        // default alignment + border
        cell.s = cell.s || {};
        cell.s.alignment = { horizontal: c === 0 ? "center" : "right", vertical: "center" };
        cell.s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };
        cell.s.font = { name: "Calibri", sz: 11 };

        // Revenue
        if (c === 3 && typeof cell.v === "number" && cell.v > 0) {
          cell.s.fill = { fgColor: { rgb: "E6FFE6" } };
          cell.s.font.bold = true;
        }

        // Status columns
        const colLetter = XLSX.utils.encode_col(c);
        if (statusColors[colLetter] && typeof cell.v === "number" && cell.v > 0) {
          cell.s.fill = { fgColor: { rgb: statusColors[colLetter] } };
          cell.s.font.bold = true;
          cell.s.alignment.horizontal = "center";
        }
      }
    }

    // 7. Column widths
    worksheet['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    ];

    // 8. Freeze header + auto filter
    worksheet['!freeze'] = { xSplit: 0, ySplit: 6 }; // freeze 6 dòng đầu
    worksheet['!autofilter'] = { ref: `A6:I${lastRow}` };

    // 9. Xuất file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KPI Dashboard");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `KPI_${type}.xlsx`);
  };

  return (
    <div className="mb-8">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>KPI Dashboard</CardTitle>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              {["week", "month", "year"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as "week" | "month" | "year")}
                  className={`px-4 py-2 rounded font-medium transition ${type === t
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Export Excel
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : !kpiData.length ? (
            <div>No KPI data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Total Bookings</th>
                    <th className="border p-2 text-left">Cancelled</th>
                    <th className="border p-2 text-left">Revenue</th>
                    <th className="border p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-2">{item.date}</td>
                      <td className="border p-2">{item.totalBookings}</td>
                      <td className="border p-2">{item.cancelledBookings}</td>
                      <td className="border p-2 font-semibold text-green-700">
                        {item.revenue.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="border p-2 flex gap-1 flex-wrap">
                        {Object.entries(item.status).map(
                          ([status, value]) =>
                            value > 0 && (
                              <span
                                key={status}
                                className={`px-2 py-1 rounded text-xs ${status === "pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : status === "confirmed"
                                    ? "bg-green-200 text-green-800"
                                    : status === "cancelled"
                                      ? "bg-red-200 text-red-800"
                                      : status === "completed"
                                        ? "bg-blue-200 text-blue-800"
                                        : "bg-gray-200 text-gray-800"
                                  }`}
                              >
                                {status}: {value}
                              </span>
                            )
                        )}
                      </td>
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
