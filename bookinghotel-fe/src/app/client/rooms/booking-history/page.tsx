"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/axios/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface Room {
  bookingId: number;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalPrice: number | string;

  hotelId: number;
  hotelName: string;

  roomTypeId?: number;
  roomTypeName?: string;
}

interface HotelGroup {
  hotelName: string;
  rooms: Room[];
  bookingId?: number;
  bookingStatus?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestsCount?: number;
  totalPrice?: number;
}

enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

// ================== ENUM ROOM TYPE ==================
export enum RoomTypeName {
  DELUXE_DOUBLE = "deluxe double",
  DELUXE_FAMILY = "deluxe family",
  GRAND_FAMILY = "grand family",
  DELUXE_TRIPLE = "deluxe triple",
  STANDARD = "standard",
  DOUBLE_ROOM = "double room",
  TRIPPLE_ROOM = "triple room",
}

export default function RoomMonitorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<"createdAt" | "updatedAt" | "checkInDate" | "checkOutDate" | "hotelName" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;

  // Hover
  const [hoveredHotelDetail, setHoveredHotelDetail] = useState<any>(null);
  const [hoveredBookingDetail, setHoveredBookingDetail] = useState<any>(null);
  const [hoveredRoomTypeDetail, setHoveredRoomTypeDetail] = useState<any>(null);


  const roomDetailCache = useRef<Map<number, any>>(new Map());
  const hotelDetailCache = useRef<Map<number, any>>(new Map());


  const roomTypeDetailCache = useRef<Map<number, any>>(new Map());

  const { user, setUser } = useAuth();
  const [savedTrips, setSavedTrips] = useState<Set<number>>(new Set());

  // Fetch user
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await api.get("auth/profile");
        if (res.data?.id) setUserId(res.data.id);
        else {
          toast.error("Không tìm thấy thông tin người dùng!");
          setUser(null);
        }
      } catch {
        toast.error("Vui lòng đăng nhập lại! Không thể lấy thông tin người dùng!");
        setUser(null);
      }
    };
    fetchUserId();

    const fetchSavedTrips = async () => {
      try {
        const res = await api.get("/rooms/trip-history");
        const ids: number[] = Array.isArray(res.data.bookingIds)
          ? res.data.bookingIds.map((id: any) => Number(id)).filter((id: number) => !isNaN(id))
          : [];
        setSavedTrips(new Set(ids));
      } catch (err) {
        console.error("Không thể tải danh sách chuyến đi đã lưu", err);
        setSavedTrips(new Set());
      }
    };
    fetchSavedTrips();
  }, []);

  // Fetch rooms
  useEffect(() => {
    if (!userId) return;
    const fetchRooms = async () => {
      try {
        const res = await api.get(`/rooms/getBooking/byUser/${userId}`);
        setRooms(res.data);
      } catch {
        toast.error("❌ Lỗi khi tải danh sách phòng!");
      }
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const removeVietnameseAccents = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");

  // Filter + search
  const filteredRooms = rooms
    .filter(r => !statusFilter || r.bookingStatus === statusFilter)
    .filter(r => !roomTypeFilter || r.roomTypeName?.toLowerCase() === roomTypeFilter.toLowerCase())
    .filter(r => {
      const hotelName = removeVietnameseAccents(r.hotelName.toLowerCase());
      const searchTerm = removeVietnameseAccents(search.toLowerCase());
      return hotelName.includes(searchTerm);
    });


  // Group rooms
  let grouped: HotelGroup[] = Object.values(
    filteredRooms.reduce((acc: { [key: string]: HotelGroup }, room) => {
      const key = room.bookingId;
      if (!acc[key]) {
        acc[key] = {
          hotelName: room.hotelName,
          rooms: [],
          bookingId: room.bookingId,
          bookingStatus: room.bookingStatus,
          checkInDate: room.checkInDate,
          checkOutDate: room.checkOutDate,
          guestsCount: room.guestsCount,
          totalPrice: room.totalPrice,
        };
      }
      acc[key].rooms.push(room);
      return acc;
    }, {})
  );

  // Sort groups
  grouped.sort((a, b) => {
    if (!sortKey) return 0;
    const order = sortOrder === "asc" ? 1 : -1;
    switch (sortKey) {
      case "hotelName":
        return order * a.hotelName.localeCompare(b.hotelName);
      case "checkInDate":
        return order * ((new Date(a.checkInDate ?? 0)).getTime() - (new Date(b.checkInDate ?? 0)).getTime());
      case "checkOutDate":
        return order * ((new Date(a.checkOutDate ?? 0)).getTime() - (new Date(b.checkOutDate ?? 0)).getTime());
      default:
        return 0;
    }
  });


  // =================== sử dụng toLocaleDateString với UTC =================== 
  const formatDateUTC = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      timeZone: "UTC",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  // Pagination
  const totalPages = Math.ceil(grouped.length / groupsPerPage);
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = grouped.slice(indexOfFirstGroup, indexOfLastGroup);

  const formatDateExact = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr.replace(" ", "T"));
    return d.toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  const formatVND = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const getPaginationNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPageButtons = 5;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 1, totalPages - 1);
      if (start > 2) pageNumbers.push("...");
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (end < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  // RoomType hover
  const handleRoomTypeHover = async (roomTypeId?: number) => {
    if (!roomTypeId) return;
    if (roomTypeDetailCache.current.has(roomTypeId)) {
      setHoveredRoomTypeDetail(roomTypeDetailCache.current.get(roomTypeId));
      return;
    }
    try {
      const res = await api.get(`/rooms/roomTypeDetail/${roomTypeId}`);
      roomTypeDetailCache.current.set(roomTypeId, res.data);
      setHoveredRoomTypeDetail(res.data);
    } catch (err) {
      console.error("Không lấy được chi tiết Room Type", err);
    }
  };

  // Hover handlers
  const handleHotelHover = async (hotelId: number) => {
    if (hotelDetailCache.current.has(hotelId)) return setHoveredHotelDetail(hotelDetailCache.current.get(hotelId));
    try {
      const res = await api.get(`/rooms/hotelDetail/${hotelId}`);
      hotelDetailCache.current.set(hotelId, res.data);
      setHoveredHotelDetail(res.data);
    } catch { }
  };

  const handleBookingHover = async (bookingId?: number) => {
    if (!bookingId) return;
    try {
      const res = await api.get(`/rooms/bookingDetail/${bookingId}`);
      setHoveredBookingDetail(res.data);
    } catch { }
  };

  // Save / Remove trip
  const handleSaveTrip = async (bookingId?: number) => {
    if (!bookingId) return;
    try {
      await api.post("rooms/save-trip", { bookingId });
      toast.success("✅ Đã lưu hành trình!");
      setSavedTrips(prev => new Set(prev).add(bookingId));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Không thể lưu hành trình!");
    }
  };

  const handleRemoveTrip = async (bookingId?: number) => {
    if (!bookingId) return;
    try {
      await api.post("/rooms/remove-trip", { bookingId });
      setSavedTrips(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
      toast.success("❌ Đã xóa hành trình!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể xóa hành trình!");
    }
  };

  return (
    <div className="p-6 relative" onClick={() => toast.dismiss()}>
      <div className="pt-12 relative">
        <h1 className="text-2xl font-bold mb-1">🏨 Lịch sử đặt phòng của tôi</h1>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên khách sạn..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={sortKey || ""}
          onChange={e => setSortKey(e.target.value as any || null)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">📝 Sắp xếp theo</option>
          <option value="checkInDate">📅 Ngày nhận phòng</option>
          <option value="checkOutDate">📅 Ngày trả phòng</option>
          <option value="hotelName">🏨 Tên khách sạn</option>
        </select>
        {sortKey && (
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border p-2 rounded bg-gray-200"
          >
            {sortOrder === "asc" ? "⬆️" : "⬇️"} Thứ tự: {sortOrder.toUpperCase()}
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-4 py-2 rounded ${statusFilter === null ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          🏷️ All
        </button>
        {Object.values(BookingStatus).map(status => {
          let icon = "❓"; // default icon
          switch (status) {
            case "pending":
              icon = "⏳";
              break;
            case "confirmed":
              icon = "✅";
              break;
            case "cancelled":
              icon = "❌";
              break;
            case "completed":
              icon = "🎉";
              break;
            case "expired":
              icon = "⌛";
              break;
          }
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              className={`px-4 py-2 rounded ${statusFilter === status ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Filter Room Type */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setRoomTypeFilter(null)}
          className={`px-4 py-2 rounded ${roomTypeFilter === null ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          🏨 All Room Types
        </button>
        {Object.values(RoomTypeName).map(type => {
          let icon = "🛏️"; // default icon
          if (type.includes("deluxe")) icon = "💎";
          else if (type.includes("family") || type.includes("grand")) icon = "👨‍👩‍👧‍👦";
          else if (type.includes("double")) icon = "👥";
          else if (type.includes("triple") || type.includes("tripple")) icon = "👨‍👩‍👦";
          else if (type.includes("standard")) icon = "🛌";

          return (
            <button
              key={type}
              onClick={() => setRoomTypeFilter(roomTypeFilter === type ? null : type)}
              className={`px-4 py-2 rounded capitalize ${roomTypeFilter === type ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {icon} {type}
            </button>
          );
        })}
      </div>

      {/* Room groups */}
      {currentGroups.length === 0 ? (
        <p>Không có phòng nào được đặt.</p>
      ) : currentGroups.map(group => (
        <div key={group.bookingId} className="mb-6 border rounded-xl p-4 shadow bg-white">
          <div className="font-bold text-lg mb-2 flex items-center justify-between"
            onMouseEnter={() => handleHotelHover(group.rooms[0].hotelId)}
            onMouseLeave={() => setHoveredHotelDetail(null)}
          >
            <p>⏰ {group.hotelName}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveTrip(group.bookingId)}
                className={`px-2 py-1 rounded text-sm ${savedTrips.has(group.bookingId!)
                  ? "text-green-500 hover:text-green-600"
                  : "text-yellow-500 hover:text-yellow-600"
                  }`}
                title="Đánh dấu hành trình"
              >
                {savedTrips.has(group.bookingId!) ? "✅ Đã lưu hành trình" : "🤍 Lưu hành trình"}
              </button>
              {savedTrips.has(group.bookingId!) && (
                <button
                  onClick={() => handleRemoveTrip(group.bookingId)}
                  className="px-2 py-1 rounded text-sm text-red-500 hover:text-red-600"
                  title="Xóa hành trình"
                >
                  ❌ Xóa hành trình
                </button>
              )}
            </div>
          </div>

          <div className="border rounded p-2 flex flex-wrap justify-between items-start gap-y-2 gap-x-4 mb-2"
            onMouseEnter={() => handleBookingHover(group.rooms[0].bookingId)}
            onMouseLeave={() => setHoveredBookingDetail(null)}
          >
            <p className="flex items-start gap-2 min-w-[150px]">✅ Trạng thái: {group.bookingStatus}</p>
            <p className="flex items-start gap-2 min-w-[150px]">🗓️ Nhận phòng: {formatDateExact(group.checkInDate)}</p>
            <p className="flex items-start gap-2 min-w-[150px]">🗓️ Trả phòng: {formatDateExact(group.checkOutDate)}</p>
            <p className="flex items-start gap-2 min-w-[150px]">👥 Khách tối đa: {group.guestsCount}</p>
            <p className="flex items-start gap-2 min-w-[150px]">💰 {formatVND(group.totalPrice || 0)}</p>
          </div>

          <div
            className={`grid gap-6 ${group.rooms.length === 1
              ? "grid-cols-1" // chiếm 1 cột full width
              : "grid-cols-1 md:grid-cols-2" // 2 phần tử thì 2 cột trên md
              }`}
          >
            {group.rooms.map((room) => (
              <div
                key={room.roomTypeId || room.bookingId}
                className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start gap-4
                 bg-white shadow hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
                onMouseEnter={() => handleRoomTypeHover(room.roomTypeId)}
                onMouseLeave={() => setHoveredRoomTypeDetail(null)}
              >
                <div className="flex flex-col gap-2">
                  <p>📌 Room Type ID: {room.roomTypeId}</p>
                  <p>🏨 Room Type Name: {room.roomTypeName}</p>
                </div>
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
          className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {getPaginationNumbers().map((num, idx) => (
          <button
            key={idx}
            onClick={() => typeof num === "number" && setCurrentPage(num)}
            disabled={num === "..."}
            className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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

      {/* RoomType Hover */}
      {hoveredRoomTypeDetail && (
        <div className="fixed top-20 left-10 p-4 bg-white border rounded shadow-lg w-72 z-50">
          <h3 className="font-bold text-lg mb-2">🏨 Room Type: {hoveredRoomTypeDetail.name}</h3>
          <p>📝 Description: {hoveredRoomTypeDetail.description}</p>
          <p>👥 Max Guests: {hoveredRoomTypeDetail.max_guests}</p>
          <p>📦 Total Inventory: {hoveredRoomTypeDetail.total_inventory}</p>
          <p>📐 Area: {hoveredRoomTypeDetail.area}</p>
          <p>🛏 Bed Type: {hoveredRoomTypeDetail.bed_type}</p>
        </div>
      )}


      {/* Popups */}
      {hoveredHotelDetail && (
        <div className="fixed top-20 left-10 p-4 bg-white border rounded shadow-lg w-64 z-50">
          <h3 className="font-bold flex items-start gap-2">📌 <span className="leading-tight">Hotel: {hoveredHotelDetail.name}</span></h3>
          <p className="flex items-start gap-2">🏠 <span className="leading-tight">Address: {hoveredHotelDetail.address}</span></p>
          <p className="flex items-start gap-2">📞 <span className="leading-tight">Phone: {hoveredHotelDetail.phone}</span></p>
          <p className="flex items-start gap-2">ℹ️ <span className="leading-tight">Description: {hoveredHotelDetail.description}</span></p>
          <p className="flex items-start gap-2">💰 <span className="leading-tight">Avg Price: {formatVND(hoveredHotelDetail.avgPrice)}</span></p>
        </div>
      )}

      {hoveredBookingDetail && (
        <div className="fixed top-20 right-10 p-4 bg-white border rounded shadow-lg w-64 z-50">
          <h3 className="font-bold flex items-start gap-2">🧑 <span className="leading-tight">Guest: {hoveredBookingDetail.guestFullName}</span></h3>
          <p className="flex items-start gap-2">📝 <span className="leading-tight">Contact: {hoveredBookingDetail.contactFullName}</span></p>
          <p className="flex items-start gap-2">📧 <span className="leading-tight">Email: {hoveredBookingDetail.contactEmail}</span></p>
          <p className="flex items-start gap-2">📞 <span className="leading-tight">Phone: {hoveredBookingDetail.contactPhone}</span></p>
          <p className="flex items-start gap-2">👥 <span className="leading-tight">Guests Count: {hoveredBookingDetail.guestsCount || "-"}</span></p>
          <p className="flex items-start gap-2">🗓️ <span className="leading-tight">Check-in: {formatDateExact(hoveredBookingDetail.checkInDate)}</span></p>
          <p className="flex items-start gap-2">🗓️ <span className="leading-tight">Check-out: {formatDateExact(hoveredBookingDetail.checkOutDate)}</span></p>
          <p className="flex items-start gap-2">✅ <span className="leading-tight">Status: {hoveredBookingDetail.status}</span></p>
          <p className="flex items-start gap-2">💰 <span className="leading-tight">Price: {formatVND(hoveredBookingDetail.totalPrice)}</span></p>
          <p className="flex items-start gap-2">📋 <span className="leading-tight">Special Requests: {hoveredBookingDetail.specialRequests || "-"}</span></p>
          <p className="flex items-start gap-2">❌ <span className="leading-tight">Cancellation Reason: {hoveredBookingDetail.cancellationReason || "-"}</span></p>
          <p className="flex items-start gap-2">⏱️ <span className="leading-tight">Created At: {formatDateUTC(hoveredBookingDetail.createdAt) || "-"}</span></p>
          <p className="flex items-start gap-2">⏱️ <span className="leading-tight">Updated At: {formatDateUTC(hoveredBookingDetail.updatedAt) || "-"}</span></p>
        </div>
      )}

    </div>


  );
}
