"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import XLSX from 'sheetjs-style';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentDataItem {
  date: string;
  cod: number;
  momo: number;
  vnpay: number;
}

export function TablesSectionPaymentStats() {
  const [paymentData, setPaymentData] = useState<PaymentDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    fetchPaymentStats(type);
  }, [type]);

  const fetchPaymentStats = async (selectedType: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/payment-stats?type=${selectedType}`);
      const data = res.data;

      if (!data || !data.labels?.length) {
        setPaymentData([]);
        return;
      }

      const formattedData: PaymentDataItem[] = data.labels.map((date: string, index: number) => ({
        date,
        cod: data.paymentData.cod?.[index] ?? 0,
        momo: data.paymentData.momo?.[index] ?? 0,
        vnpay: data.paymentData.vnpay?.[index] ?? 0,
      }));

      setPaymentData(formattedData);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      setPaymentData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportPaymentStatsExcel = () => {
    if (!paymentData.length) return;

    // 1. Chuyển dữ liệu thành array of arrays
    const dataRows = paymentData.map(item => [
      item.date,
      item.cod,
      item.momo,
      item.vnpay,
    ]);

    // 2. Tạo worksheet rỗng
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // 3. Thêm 3 dòng tiêu đề đẹp
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["Payment Stats Report"],
      [`Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`],
      [`Generated at: ${new Date().toLocaleString()}`],
    ], { origin: 0 });

    // Style tiêu đề
    ["A1", "A2", "A3"].forEach(key => {
      worksheet[key].s = {
        font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "1F4E78" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    });

    // 4. Thêm header bảng ở dòng 6
    const headerRow = ["Date", "COD", "Momo", "VNPay"];
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 5 });

    // Style header
    const headerColor = "4F81BD";
    headerRow.forEach((_, idx) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 5, c: idx })];
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

    // 6. Style dữ liệu + border + màu COD/Momo/VNPay
    const lastRow = 6 + dataRows.length;
    for (let r = 6; r < lastRow; r++) {
      for (let c = 0; c < 4; c++) {
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

        // Màu COD/Momo/VNPay nếu > 0
        if (typeof cell.v === "number" && cell.v > 0) {
          let color = "FFFFFF";
          switch (c) {
            case 1: color = "FFF2CC"; break; // COD - vàng nhạt
            case 2: color = "D9EAD3"; break; // Momo - xanh nhạt
            case 3: color = "CFE2F3"; break; // VNPay - xanh da trời nhạt
          }
          cell.s.fill = { fgColor: { rgb: color } };
          cell.s.font.bold = true;
        }
      }
    }

    // 7. Column widths
    worksheet['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    // 8. Freeze header + auto filter
    worksheet['!freeze'] = { xSplit: 0, ySplit: 6 }; // freeze 6 dòng đầu
    worksheet['!autofilter'] = { ref: `A6:D${lastRow}` };

    // 9. Xuất file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Stats");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `PaymentStats_${type}.xlsx`);
  };



  return (
    <div className="mb-8">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Payment Stats</CardTitle>
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
              onClick={exportPaymentStatsExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Export Excel
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : !paymentData.length ? (
            <div>No payment stats available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">COD</th>
                    <th className="border p-2 text-left">Momo</th>
                    <th className="border p-2 text-left">VNPay</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-2">{item.date}</td>
                      <td
                        className={`border p-2 font-semibold ${item.cod > 0 ? "bg-blue-100 text-blue-800" : ""
                          }`}
                      >
                        {item.cod.toLocaleString("vi-VN")} ₫
                      </td>
                      <td
                        className={`border p-2 font-semibold ${item.momo > 0 ? "bg-purple-100 text-purple-800" : ""
                          }`}
                      >
                        {item.momo.toLocaleString("vi-VN")} ₫
                      </td>
                      <td
                        className={`border p-2 font-semibold ${item.vnpay > 0 ? "bg-green-100 text-green-800" : ""
                          }`}
                      >
                        {item.vnpay.toLocaleString("vi-VN")} ₫
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
