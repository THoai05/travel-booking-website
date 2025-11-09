"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import * as XLSX from "sheetjs-style";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export enum RoomTypeName {
  DELUXE_DOUBLE = "deluxe double",
  DELUXE_FAMILY = "deluxe family",
  GRAND_FAMILY = "grand family",
  DELUXE_TRIPLE = "deluxe triple",
  STANDARD = "standard",
  DOUBLE_ROOM = "double room",
  TRIPPLE_ROOM = "triple room",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  EXPIRED = "expired",
}

interface RoomData {
  bookingId: number;
  bookingStatus: BookingStatus;
  userId: number;
  roomTypeId: number;
  roomTypeName: RoomTypeName;
  hotelId: number;
  hotelName: string;
}

interface HotelDetail {
  hotelName: string;
  occupied: number;
  available: number;
}

interface RoomTypeStats {
  roomTypeName: RoomTypeName;
  occupied: number;
  available: number;
  hotels: HotelDetail[];
}

export function TablesSectionRoomAvailability() {
  const [roomStats, setRoomStats] = useState<RoomTypeStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomStats();
  }, []);

  const fetchRoomStats = async () => {
    try {
      setLoading(true);
      const res = await api.get<RoomData[]>("/rooms/roomAvailabilityMonitor");
      const data = res.data;

      const statsMap: Record<string, RoomTypeStats> = {};

      data.forEach((item) => {
        const key = item.roomTypeName;

        if (!statsMap[key]) {
          statsMap[key] = {
            roomTypeName: key as RoomTypeName,
            occupied: 0,
            available: 0,
            hotels: [],
          };
        }

        const isOccupied =
          item.bookingStatus === BookingStatus.PENDING ||
          item.bookingStatus === BookingStatus.CONFIRMED;

        if (isOccupied) statsMap[key].occupied += 1;
        else statsMap[key].available += 1;

        let hotel = statsMap[key].hotels.find(
          (h) => h.hotelName === item.hotelName
        );
        if (!hotel) {
          hotel = { hotelName: item.hotelName, occupied: 0, available: 0 };
          statsMap[key].hotels.push(hotel);
        }
        if (isOccupied) hotel.occupied += 1;
        else hotel.available += 1;
      });

      // sắp xếp
      const sorted = Object.values(statsMap)
        .sort((a, b) => a.roomTypeName.localeCompare(b.roomTypeName))
        .map((r) => ({
          ...r,
          hotels: r.hotels.sort((a, b) => a.hotelName.localeCompare(b.hotelName)),
        }));

      setRoomStats(sorted);
    } catch (error) {
      console.error("Error fetching room stats:", error);
      setRoomStats([]);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!roomStats.length) return;

    // === Sheet 1: Room Availability ===
    const ws = XLSX.utils.aoa_to_sheet([]);

    // --- Tiêu đề chính ---
    XLSX.utils.sheet_add_aoa(ws, [["Room Availability Report"]], { origin: "A1" });
    ws["A1"].s = {
      font: { bold: true, sz: 14, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws["!merges"] = ws["!merges"] || [];
    ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });

    // --- Thời gian ---
    XLSX.utils.sheet_add_aoa(ws, [[`Generated at: ${new Date().toLocaleString()}`]], { origin: "A2" });
    ws["A2"].s = {
      font: { italic: true, sz: 11, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } });

    // --- Header ---
    const header = ["Room Type", "Total Occupied", "Total Available", "Hotel", "Occupied", "Available"];
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A3" });
    for (let c = 0; c < 6; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    }

    // --- Dữ liệu ---
    let rowIndex = 4; // dữ liệu bắt đầu từ row 4
    let totalOccupied = 0;
    let totalAvailable = 0;

    roomStats.forEach((r) => {
      const startRow = rowIndex;
      totalOccupied += r.occupied;
      totalAvailable += r.available;

      r.hotels.forEach((h) => {
        const row = [r.roomTypeName, r.occupied, r.available, h.hotelName, h.occupied, h.available];
        XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${rowIndex}` });

        // Tô màu dữ liệu > 0
        for (let c = 3; c <= 5; c++) {
          const cellAddr = XLSX.utils.encode_cell({ r: rowIndex - 1, c });
          const val = row[c];
          ws[cellAddr].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: val > 0 ? "C6EFCE" : "F2F2F2" } },
          };
        }
        rowIndex++;
      });

      // Merge Room Type + Total Occupied + Total Available
      if (r.hotels.length > 1) {
        ws["!merges"].push(
          { s: { r: startRow - 1, c: 0 }, e: { r: rowIndex - 2, c: 0 } },
          { s: { r: startRow - 1, c: 1 }, e: { r: rowIndex - 2, c: 1 } },
          { s: { r: startRow - 1, c: 2 }, e: { r: rowIndex - 2, c: 2 } }
        );
      }
    });

    // --- Dòng tổng ---
    XLSX.utils.sheet_add_aoa(ws, [["GRAND TOTAL", totalOccupied, totalAvailable, "", "", ""]], { origin: `A${rowIndex}` });
    ["A", "B", "C"].forEach((c) => {
      const cell = `${c}${rowIndex}`;
      ws[cell].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "FFD966" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    });

    ws["!cols"] = [
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
    ];

    // === Sheet 2: Mini Chart ===
    const wsChart = XLSX.utils.aoa_to_sheet([]);

    // --- Tiêu đề chính ---
    XLSX.utils.sheet_add_aoa(wsChart, [["Room Availability Chart"]], { origin: "A1" });
    wsChart["A1"].s = {
      font: { bold: true, sz: 14, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    // Merge từ A1 đến F1
    wsChart["!merges"] = wsChart["!merges"] || [];
    wsChart["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });

    // --- Thời gian tạo báo cáo ---
    XLSX.utils.sheet_add_aoa(wsChart, [[`Generated at: ${new Date().toLocaleString()}`]], { origin: "A2" });
    wsChart["A2"].s = {
      font: { italic: true, sz: 11, color: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    // Merge từ A2 đến F2
    wsChart["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } });

    // --- Header ---
    const chartHeader = ["Room Type", "Occupied", "Available", "Occupied %", "Available %", "Visual Chart"];
    XLSX.utils.sheet_add_aoa(wsChart, [chartHeader], { origin: "A3" });
    for (let c = 0; c < 6; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      wsChart[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    }

    // --- Dữ liệu ---
    roomStats.forEach((r, i) => {
      const total = r.occupied + r.available;
      const occPercent = total ? (r.occupied / total) * 100 : 0;
      const availPercent = total ? (r.available / total) * 100 : 0;
      const row = [r.roomTypeName, r.occupied, r.available, occPercent, availPercent, ""];

      XLSX.utils.sheet_add_aoa(wsChart, [row], { origin: `A${i + 4}` }); // dữ liệu bắt đầu từ row 4

      // --- In-cell bar chart ---
      const occBars = "█".repeat(Math.round((r.occupied / total) * 20));
      const availBars = "░".repeat(Math.round((r.available / total) * 20));
      const cellChart = `F${i + 4}`;
      XLSX.utils.sheet_add_aoa(wsChart, [[`${occBars}${availBars}`]], { origin: cellChart });
      wsChart[cellChart].s = { alignment: { horizontal: "left", vertical: "center" } };
    });

    // --- Cột rộng
    wsChart["!cols"] = [
      { wch: 18 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 35 },
    ];


    // === Workbook ===
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Room Availability");
    XLSX.utils.book_append_sheet(wb, wsChart, "Charts");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `RoomAvailability_${new Date().toISOString()}.xlsx`);
  };



  const getCellColor = (val: number) => val > 0 ? "bg-green-100 text-green-700 font-medium" : "bg-gray-100 text-gray-500";

  return (
    <div className="mb-8">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Room Availability Dashboard</CardTitle>
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
          ) : !roomStats.length ? (
            <div>No room data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Room Type</th>
                    <th className="border p-2">Total Occupied</th>
                    <th className="border p-2">Total Available</th>
                    <th className="border p-2">Hotel</th>
                    <th className="border p-2">Occupied</th>
                    <th className="border p-2">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {roomStats.map((r, idx) => r.hotels.map((h, i) => (
                    <tr key={`${idx}-${i}`} className="hover:bg-gray-50 transition-colors">
                      {i === 0 && (
                        <>
                          <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">{r.roomTypeName}</td>
                          <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">{r.occupied}</td>
                          <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">{r.available}</td>
                        </>
                      )}
                      <td className="border p-2">{h.hotelName}</td>
                      <td className={`border p-2 ${getCellColor(h.occupied)}`}>{h.occupied}</td>
                      <td className={`border p-2 ${getCellColor(h.available)}`}>{h.available}</td>
                    </tr>
                  )))}
                  <tr className="bg-yellow-100 font-semibold">
                    <td className="border p-2 text-center" colSpan={1}>GRAND TOTAL</td>
                    <td className="border p-2 text-center">{roomStats.reduce((t, r) => t + r.occupied, 0)}</td>
                    <td className="border p-2 text-center">{roomStats.reduce((t, r) => t + r.available, 0)}</td>
                    <td className="border p-2" colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
