"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import XLSX from 'sheetjs-style';
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

        let hotel = statsMap[key].hotels.find((h) => h.hotelName === item.hotelName);
        if (!hotel) {
          hotel = { hotelName: item.hotelName, occupied: 0, available: 0 };
          statsMap[key].hotels.push(hotel);
        }
        if (isOccupied) hotel.occupied += 1;
        else hotel.available += 1;
      });

      setRoomStats(Object.values(statsMap));
    } catch (error) {
      console.error("Error fetching room stats:", error);
      setRoomStats([]);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!roomStats.length) return;

    // Prepare data for XLSX
    const dataRows: any[][] = roomStats.flatMap(r => 
      r.hotels.map(h => [
        r.roomTypeName,
        r.occupied + h.occupied - h.occupied, // total per room type is handled globally
        r.available + h.available - h.available,
        h.hotelName,
        h.occupied,
        h.available
      ])
    );

    const worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["Room Availability Report"],
      [`Generated at: ${new Date().toLocaleString()}`]
    ], { origin: 0 });

    ["A1","A2"].forEach(key => {
      worksheet[key].s = {
        font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "1F4E78" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    });

    const headerRow = ["Room Type", "Total Occupied", "Total Available", "Hotel", "Occupied", "Available"];
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 3 });

    headerRow.forEach((_, idx) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 3, c: idx })];
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Calibri", sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 4 });

    worksheet['!cols'] = [
      { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 10 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Room Availability");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `RoomAvailability_${new Date().toISOString()}.xlsx`);
  };

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
              <table className="min-w-full border border-gray-200">
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
                        <td className="border p-2">{r.roomTypeName}</td>
                        <td className="border p-2 font-semibold">{r.occupied}</td>
                        <td className="border p-2 font-semibold">{r.available}</td>
                        <td className="border p-2">{h.hotelName}</td>
                        <td className="border p-2">{h.occupied}</td>
                        <td className="border p-2">{h.available}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
