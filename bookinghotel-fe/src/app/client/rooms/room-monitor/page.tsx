"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/axios/axios";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

interface Room {
  id: number;
  hotelName: string;
  hotel_id: number;
  roomNumber: string;
  roomType: string;
  status: "available" | "booked" | "maintenance";
}

interface HotelGroup {
  hotelName: string;
  rooms: Room[];
}

export default function RoomMonitorPage() {
  const [apiType, setApiType] = useState<"all" | "hotel" | "user">("all");
  const [param, setParam] = useState<string | number>();
  const [showAll, setShowAll] = useState<"all" | "none">("all");
  const [userId, setUserId] = useState<number | null>(null);

  const { user, setUser } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"roomNumber" | "roomType" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;
  const currentPageRef = useRef(currentPage);
  useEffect(() => { currentPageRef.current = currentPage }, [currentPage]);

  // --- Hover state for popup ---
  const [hoveredRoomDetail, setHoveredRoomDetail] = useState<any>(null);
  const [hoveredHotelDetail, setHoveredHotelDetail] = useState<any>(null);

  // --- Cache details to avoid refetching ---
  const roomDetailCache = useRef<Map<number, any>>(new Map());
  const hotelDetailCache = useRef<Map<number, any>>(new Map());

  // --- Fetch userId on mount, prioritize user rooms ---
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get("auth/profile");
        if (response.status !== 304 && response.data.id) {
          const id = response.data.id;
          setUserId(id);
          if (showAll === "none") {
            setApiType("user");
            setParam(id);
          }
          return; // stop, don't fetch all
        }
      } catch (error) {
        console.warn("Không lấy được userId, chuyển sang xem tất cả");
        setUser(null);
      }
      // fallback all
      setApiType("all");
      setParam(undefined);
      setShowAll("all");
      setUserId(null);
      setUser(null);
    };
    fetchUserId();
  }, []);

  // --- Fetch rooms with auto-refresh ---
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let url = "/rooms/roomAvailabilityMonitor"; // default all
        if (apiType === "hotel" && param) url = `/rooms/roomAvailabilityMonitor/byHotel?search=${param}`;
        if (apiType === "user" && param) url = `/rooms/roomAvailabilityMonitor/byUser/${param}`;
        const res = await api.get(url);
        setRooms(res.data);
      } catch (error) {

        let url = "/rooms/roomAvailabilityMonitor"; // default all
        const res = await api.get(url);
        setRooms(res.data);

        // fallback all
        setApiType("all");
        setParam(undefined);
        setShowAll("all");
        setUserId(null);

        toast("❌ Lỗi khi tải danh sách phòng!", { icon: "⚠️" });
        //console.error("❌ Lỗi khi tải danh sách phòng:", error);
        setUser(null);
      }
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000); // auto-refresh
    return () => clearInterval(interval);
  }, [apiType, param]);

  const removeVietnameseAccents = (str: string) =>
    str.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D");
  // --- Filter, search, sort ---
  const filteredRooms = rooms
    .filter(r => !statusFilter || r.status === statusFilter)
    .filter(r => {
      const hotelName = removeVietnameseAccents(r.hotelName.toLowerCase());
      const roomNumber = removeVietnameseAccents(r.roomNumber.toLowerCase());
      const searchTerm = removeVietnameseAccents(search.toLowerCase());
      return hotelName.includes(searchTerm) || roomNumber.includes(searchTerm);
    })
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

  // --- Group by hotel ---
  const grouped: HotelGroup[] = Object.values(
    filteredRooms.reduce((acc: { [key: string]: HotelGroup }, room) => {
      if (!acc[room.hotelName]) acc[room.hotelName] = { hotelName: room.hotelName, rooms: [] };
      acc[room.hotelName].rooms.push(room);
      return acc;
    }, {})
  );

  // --- Pagination ---
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

  // --- Hover handlers ---
  const handleRoomHover = async (roomId: number) => {
    if (roomDetailCache.current.has(roomId)) {
      setHoveredRoomDetail(roomDetailCache.current.get(roomId));
      return;
    }
    try {
      const res = await api.get(`/rooms/roomDetail/${roomId}`);
      roomDetailCache.current.set(roomId, res.data);
      setHoveredRoomDetail(res.data);
    } catch (err) {
      console.error("Không lấy được chi tiết phòng", err);
    }
  };

  const handleHotelHover = async (hotelId: number) => {
    if (hotelDetailCache.current.has(hotelId)) {
      setHoveredHotelDetail(hotelDetailCache.current.get(hotelId));
      return;
    }
    try {
      const res = await api.get(`/rooms/hotelDetail/${hotelId}`);
      hotelDetailCache.current.set(hotelId, res.data);
      setHoveredHotelDetail(res.data);
    } catch (err) {
      console.error("Không lấy được chi tiết khách sạn", err);
    }
  };

  //Intl.NumberFormat VND
  const formatVND = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // --- Pagination logic ---
  const getPaginationNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPageButtons = 5; // số nút hiển thị giữa

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      // luôn hiển thị 1 và totalPages
      pageNumbers.push(1);

      let startPage = Math.max(currentPage - 1, 2);
      let endPage = Math.min(currentPage + 1, totalPages - 1);

      if (startPage > 2) pageNumbers.push("...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("...");

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };


  // =================== sử dụng toLocaleDateString với UTC ===================
  const formatDateUTC = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };



  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">🏨 Room Availability Monitor</h1>

      {/* Search, Sort & Toggle Show All */}
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
        <button
          onClick={() => {
            if (showAll === "none") {
              setShowAll("all");
              setApiType("all");
              setParam(undefined);
            } else if (userId) {
              setShowAll("none");
              setApiType("user");
              setParam(userId);
            } else {
              toast("Vui lòng đăng nhập để xem danh sách phòng của bạn!", { icon: "⚠️" });
            }
          }}
          className="border p-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          {showAll === "all" ? "Xem danh sách của tôi" : "Xem tất cả"}
        </button>
      </div>


      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-4 py-2 rounded 
      ${statusFilter === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            }`}
        >
          All
        </button>
        {["available", "booked", "maintenance"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-4 py-2 rounded 
        ${statusFilter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-[#0068ff] mb-2 text-left">
        {showAll === "all" ? "Hiển thị tất cả phòng" : "Lịch sử đặt phòng của tôi"}
      </h1>

      {/* Room Groups */}
      {currentGroups.length === 0 ? (
        <p>No rooms found.</p>
      ) : currentGroups.map(group => (
        <div key={group.hotelName} className="mb-6 border rounded-xl p-4 shadow bg-white"
        >
          <div
            className="font-bold text-lg mb-1 md:mb-2 cursor-pointer 
             hover:text-blue-600 transition duration-200 ease-in-out"
            onMouseEnter={() => handleHotelHover(group.rooms[0].hotel_id)}
            onMouseLeave={() => setHoveredHotelDetail(null)}
          >
            {group.hotelName}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.rooms.map(room => (
              <div
                key={room.id}
                className="border rounded p-2 flex justify-between items-center cursor-pointer hover:scale-105
                         hover:shadow-lg hover:bg-blue-50  transition duration-200 ease-in-out"
                onMouseEnter={() => handleRoomHover(room.id)}
                onMouseLeave={() => setHoveredRoomDetail(null)}
              >

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
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 md:px-3 md:py-1 border rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        {getPaginationNumbers().map((num, idx) => (
          <button
            key={idx}
            onClick={() => typeof num === "number" && setCurrentPage(num)}
            disabled={num === "..."}
            className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {hoveredRoomDetail && (
        <div className="fixed top-20 right-10 p-4 bg-white border rounded shadow-lg w-64 z-50">
          <h3 className="font-bold flex items-start gap-2">
            🛏 <span className="leading-tight">Room Number: {hoveredRoomDetail.roomNumber}</span>
          </h3>
          <p className="flex items-start gap-2">
            🏷 <span className="leading-tight">Type: {hoveredRoomDetail.roomType}</span>
          </p>
          <p className="flex items-start gap-2">
            ✅ <span className="leading-tight">Status: {hoveredRoomDetail.status}</span>
          </p>
          <p className="flex items-start gap-2">
            💰 <span className="leading-tight">Price: {formatVND(hoveredRoomDetail.pricePerNight)}</span>
          </p>
          <p className="flex items-start gap-2">
            📝 <span className="leading-tight">Description: {hoveredRoomDetail.description}</span>
          </p>
          <p className="flex items-start gap-2">
            🏢 <span className="leading-tight">Floor: {hoveredRoomDetail.floorNumber}</span>
          </p>
          <p className="flex items-start gap-2">
            👥 <span className="leading-tight">Max Guests: {hoveredRoomDetail.maxGuests}</span>
          </p>
          <p className="flex items-start gap-2">
            ⏱ <span className="leading-tight">Created: {formatDateUTC(hoveredRoomDetail.createdAt)}</span>
          </p>
        </div>
      )}


      {hoveredHotelDetail && (
        <div className="fixed top-20 left-10 p-4 bg-white border rounded shadow-lg w-64 z-50">
          <h3 className="font-bold flex items-start gap-2">
            📌 <span className="leading-tight">Hotel: {hoveredHotelDetail.name}</span>
          </h3>
          <p className="flex items-start gap-2">
            🏠 <span className="leading-tight">Address: {hoveredHotelDetail.address}</span>
          </p>
          <p className="flex items-start gap-2">
            📞 <span className="leading-tight">Phone: {hoveredHotelDetail.phone}</span>
          </p>
          <p className="flex items-start gap-2">
            ℹ️ <span className="leading-tight">Description: {hoveredHotelDetail.description}</span>
          </p>
          <p className="flex items-start gap-2">
            💰 <span className="leading-tight">Avg Price: {formatVND(hoveredHotelDetail.avgPrice)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
