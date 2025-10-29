"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/axios/axios";

interface Room {
  id: number;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  status: "available" | "booked" | "maintenance";
}

interface HotelGroup {
  hotelName: string;
  rooms: Room[];
}

export default function RoomMonitorPage() {
  //{ apiType, param }: { apiType: "all" | "hotel" | "user", param?: string | number }

  const [apiType, setApiType] = useState<"all" | "hotel" | "user">("all");
  const [param, setParam] = useState<string | number>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"roomNumber" | "roomType" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;

  const currentPageRef = useRef(currentPage); // giữ trạng thái trang khi auto refresh

  useEffect(() => { currentPageRef.current = currentPage }, [currentPage]);


  useEffect(() => {
    const fetchRooms = async () => {

      try {
        const response = await api.get("auth/profile");
        let storedId = null;

        if (response.status !== 304) {
          const profileData = response.data;
          storedId = profileData.id;
          setApiType("user");
          setParam(storedId);
        }
      } catch (error) {
        
      }

      try {

        let url = "/rooms/roomAvailabilityMonitor"; // mặc định all

        if (apiType === "hotel" && param) {
          url = `/rooms/roomAvailabilityMonitor/byHotel?search=${param}`; // query param
        }

        if (apiType === "user" && param) {
          url = `/rooms/roomAvailabilityMonitor/byUser/${param}`; // path param
        }

        const res = await api.get(url);
        setRooms(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách phòng:", error);

      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, [apiType, param]);

  // --- Lọc, search, sort ---
  const filteredRooms = rooms
    .filter(r => !statusFilter || r.status === statusFilter)
    .filter(r =>
      r.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "roomNumber") return sortOrder === "asc"
        ? a.roomNumber.localeCompare(b.roomNumber)
        : b.roomNumber.localeCompare(a.roomNumber);
      if (sortKey === "roomType") return sortOrder === "asc"
        ? a.roomType.localeCompare(b.roomType)
        : b.roomType.localeCompare(a.roomType);
      return 0;
    });

  // --- Gom nhóm theo khách sạn ---
  const grouped: HotelGroup[] = Object.values(
    filteredRooms.reduce((acc: { [key: string]: HotelGroup }, room) => {
      if (!acc[room.hotelName]) acc[room.hotelName] = { hotelName: room.hotelName, rooms: [] };
      acc[room.hotelName].rooms.push(room);
      return acc;
    }, {})
  );

  // --- Pagination theo hotel groups ---
  const totalPages = Math.ceil(grouped.length / groupsPerPage);
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = grouped.slice(indexOfFirstGroup, indexOfLastGroup);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "booked": return "bg-yellow-100 text-yellow-700";
      case "maintenance": return "bg-red-100 text-red-700";
      default: return "";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏨 Room Availability Monitor</h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by hotel or room..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={sortKey || ""}
          onChange={e => setSortKey(e.target.value as any || null)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Sort By</option>
          <option value="roomNumber">Room Number</option>
          <option value="roomType">Room Type</option>
        </select>
        {sortKey && (
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border p-2 rounded bg-gray-200"
          >
            Order: {sortOrder.toUpperCase()}
          </button>
        )}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2 mb-4">
        {["available", "booked", "maintenance"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-4 py-2 rounded ${statusFilter === status ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Hotel Groups */}
      {currentGroups.length === 0 ? (
        <p>No rooms found.</p>
      ) : currentGroups.map(group => (
        <div key={group.hotelName} className="mb-6 border rounded-xl p-4 shadow bg-white">
          <h2 className="font-bold text-lg mb-2">{group.hotelName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.rooms.map(room => (
              <div key={room.id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <p>Room {room.roomNumber}</p>
                  <p>Type: {room.roomType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50">Previous</button>
          <span className="px-3 py-1">Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
