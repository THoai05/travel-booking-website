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

    const worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [["Room Availability Report"]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(worksheet, [[`Generated at: ${new Date().toLocaleString()}`]], { origin: "A2" });

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Room Type", "Total Occupied", "Total Available", "Hotel", "Occupied", "Available"]],
      { origin: "A3" }
    );

    // --- Style căn giữa + tiêu đề ---
    ["A1", "A2"].forEach((c) => {
      worksheet[c].s = {
        font: { bold: true, sz: 14, color: { rgb: "1F4E78" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    });
    const headerCells = ["A3", "B3", "C3", "D3", "E3", "F3"];
    headerCells.forEach((c) => {
      worksheet[c].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Calibri", sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    // --- Ghi dữ liệu ---
    let rowIndex = 4;
    let totalOccupied = 0;
    let totalAvailable = 0;

    roomStats.forEach((r) => {
      const startRow = rowIndex;
      totalOccupied += r.occupied;
      totalAvailable += r.available;

      r.hotels.forEach((h) => {
        const row = [r.roomTypeName, r.occupied, r.available, h.hotelName, h.occupied, h.available];
        XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: `A${rowIndex}` });

        // tô màu dữ liệu
        for (let c = 3; c <= 5; c++) {
          const cellAddr = XLSX.utils.encode_cell({ r: rowIndex - 1, c });
          const val = row[c];
          worksheet[cellAddr].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: val > 0 ? "C6EFCE" : "F2F2F2" } },
          };
        }
        rowIndex++;
      });

      if (r.hotels.length > 1) {
        worksheet["!merges"] = worksheet["!merges"] || [];
        worksheet["!merges"].push(
          { s: { r: startRow - 1, c: 0 }, e: { r: rowIndex - 2, c: 0 } },
          { s: { r: startRow - 1, c: 1 }, e: { r: rowIndex - 2, c: 1 } },
          { s: { r: startRow - 1, c: 2 }, e: { r: rowIndex - 2, c: 2 } }
        );
      }
    });

    // --- Dòng tổng ---
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["GRAND TOTAL", totalOccupied, totalAvailable, "", "", ""]],
      { origin: `A${rowIndex}` }
    );
    const totalRowCells = ["A", "B", "C"].map((c) => `${c}${rowIndex}`);
    totalRowCells.forEach((c) => {
      worksheet[c].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "FFD966" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Room Availability");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `RoomAvailability_${new Date().toISOString()}.xlsx`);
  };

  const getCellColor = (val: number) =>
    val > 0 ? "bg-green-100 text-green-700 font-medium" : "bg-gray-100 text-gray-500";

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
                  {roomStats.map((r, idx) =>
                    r.hotels.map((h, i) => (
                      <tr key={`${idx}-${i}`} className="hover:bg-gray-50 transition-colors">
                        {i === 0 && (
                          <>
                            <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">
                              {r.roomTypeName}
                            </td>
                            <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">
                              {r.occupied}
                            </td>
                            <td rowSpan={r.hotels.length} className="border p-2 font-semibold align-middle">
                              {r.available}
                            </td>
                          </>
                        )}
                        <td className="border p-2">{h.hotelName}</td>
                        <td className={`border p-2 ${getCellColor(h.occupied)}`}>{h.occupied}</td>
                        <td className={`border p-2 ${getCellColor(h.available)}`}>{h.available}</td>
                      </tr>
                    ))
                  )}
                  {/* Dòng tổng */}
                  <tr className="bg-yellow-100 font-semibold">
                    <td className="border p-2 text-center" colSpan={1}>GRAND TOTAL</td>
                    <td className="border p-2 text-center">
                      {roomStats.reduce((t, r) => t + r.occupied, 0)}
                    </td>
                    <td className="border p-2 text-center">
                      {roomStats.reduce((t, r) => t + r.available, 0)}
                    </td>
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
