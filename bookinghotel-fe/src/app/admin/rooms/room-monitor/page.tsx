"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/axios/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardPage from "./dashboard/page"; // import trực tiếp component
import {
  ChartColumn,  // ← thêm
  ChartArea,     // ← hoặc thêm icon này
  Monitor,
  Activity,
  ArrowUp,
  ArrowDown,
  Users,
  UserCheck,
  UserX,
  Bed,
  Home,
  Coffee,
  Search,
  ArrowUpDown,
} from "lucide-react";

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

// ================== ENUM BOOKING STATUS ==================
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

// ================== INTERFACE ==================
interface RoomTypeItem {
  roomTypeId: number;
  roomTypeName: string;
  hotelId: number;
  hotelName: string;
  bookingId?: number;
  bookingStatus?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestsCount?: number;
  userId?: number;
}

interface HotelGroup {
  hotelName: string;
  rooms: RoomTypeItem[];
}

export default function RoomMonitorPage() {
  const [apiType, setApiType] = useState<"all" | "user" | "monitor">("all");
  const [param, setParam] = useState<string | number>();
  const [showAll, setShowAll] = useState<"all" | "none">("all");
  const [userId, setUserId] = useState<number | null>(null);
  const { user, setUser } = useAuth();

  const [rooms, setRooms] = useState<RoomTypeItem[]>([]);
  const [search, setSearch] = useState("");

  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [roomStatusFilter, setRoomStatusFilter] = useState<"occupied" | "empty" | null>(null);

  const [sortKey, setSortKey] = useState<"hotelName" | "roomTypeName" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;

  const [hoveredRoomTypeDetail, setHoveredRoomTypeDetail] = useState<any>(null);
  const [hoveredHotelDetail, setHoveredHotelDetail] = useState<any>(null);
  const [hoveredBookingDetail, setHoveredBookingDetail] = useState<any>(null);
  const [hoveredUserDetail, setHoveredUserDetail] = useState<any>(null);

  const [monitoredRooms, setMonitoredRooms] = useState<number[]>([]);
  const roomTypeDetailCache = useRef<Map<number, any>>(new Map());
  const hotelDetailCache = useRef<Map<number, any>>(new Map());

  const [showDashboard, setShowDashboard] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await api.get("auth/profile");
        if (res.data.id) {
          setUserId(res.data.id);
          if (showAll === "none") {
            setApiType("user");
            setParam(res.data.id);
          }
          return;
        }
      } catch {
        setUser(null);
      }
      setApiType("all");
      setParam(undefined);
      setShowAll("all");
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchMonitoredRooms = async () => {
      try {
        const res = await api.get("/rooms/get-room-monitor");
        setMonitoredRooms(res.data.roomTypeIds.map((id: string) => parseInt(id)));
      } catch {
        console.warn("Không thể tải danh sách phòng theo dõi");
      }
    };
    fetchMonitoredRooms();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let url = "/rooms/roomAvailabilityMonitor";
        if (apiType === "user" && param)
          url = `/rooms/roomAvailabilityMonitor/byUser/${param}`;

        const res = await api.get(url);
        let data = res.data;

        if (apiType === "monitor") {
          data = data.filter((r: RoomTypeItem) => monitoredRooms.includes(r.roomTypeId));
        }

        setRooms(data);
      } catch (err) {
        setApiType("all");
        setShowAll("all");
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, [apiType, param, monitoredRooms]);

  const toggleMonitor = async (roomTypeId: number) => {
    try {
      if (monitoredRooms.includes(roomTypeId)) {
        await api.post("/rooms/remove-room-monitor", { roomTypeId });
        setMonitoredRooms(monitoredRooms.filter((id) => id !== roomTypeId));
        toast.success(`🗑️ Đã bỏ theo dõi phòng #${roomTypeId}`);
      } else {
        await api.post("/rooms/save-room-monitor", { roomTypeId });
        setMonitoredRooms([...monitoredRooms, roomTypeId]);
        toast.success(`👁️ Theo dõi phòng #${roomTypeId}`);
      }
    } catch (err) {
      toast.error("Không thể cập nhật theo dõi phòng!");
      console.error(err);
    }
  };

  const removeVietnameseAccents = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  // ====== Lọc và tìm kiếm ======
  const filteredRooms = rooms
    .filter(r =>
      (!roomTypeFilter || r.roomTypeName === roomTypeFilter || r.roomTypeId.toString() === roomTypeFilter)
    )
    .filter(r => {
      const hotel = removeVietnameseAccents(r.hotelName.toLowerCase());
      const type = removeVietnameseAccents(r.roomTypeName.toLowerCase());
      const searchTerm = removeVietnameseAccents(search.toLowerCase());
      const roomIdMatch = !isNaN(Number(search)) && r.roomTypeId === Number(search);
      return hotel.includes(searchTerm) || type.includes(searchTerm) || roomIdMatch;
    })
    .filter(r => {
      if (!roomStatusFilter) return true;
      const status = r.bookingStatus as BookingStatus;
      if (roomStatusFilter === "occupied") return status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;
      if (roomStatusFilter === "empty") return status === BookingStatus.CANCELLED || status === BookingStatus.COMPLETED || status === BookingStatus.EXPIRED;
      return true;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      return sortOrder === "asc"
        ? a[sortKey].localeCompare(b[sortKey])
        : b[sortKey].localeCompare(a[sortKey]);
    });




  const grouped: HotelGroup[] = Object.values(
    filteredRooms.reduce((acc: { [key: string]: HotelGroup }, room) => {
      if (!acc[room.hotelName])
        acc[room.hotelName] = { hotelName: room.hotelName, rooms: [] };
      acc[room.hotelName].rooms.push(room);
      return acc;
    }, {})
  );

  const totalPages = Math.ceil(grouped.length / groupsPerPage);
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = grouped.slice(indexOfFirstGroup, indexOfLastGroup);

  const handleRoomTypeHover = async (roomTypeId: number) => {
    if (roomTypeDetailCache.current.has(roomTypeId)) {
      setHoveredRoomTypeDetail(roomTypeDetailCache.current.get(roomTypeId));
      return;
    }
    try {
      const res = await api.get(`/rooms/roomTypeDetail/${roomTypeId}`);
      roomTypeDetailCache.current.set(roomTypeId, res.data);
      setHoveredRoomTypeDetail(res.data);
    } catch {
      console.error("Không lấy được chi tiết room type");
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
    } catch {
      console.error("Không lấy được chi tiết khách sạn");
    }
  };

  const handleBookingHover = async (bookingId?: number) => {
    if (!bookingId) return;
    try {
      const res = await api.get(`/rooms/bookingDetail/${bookingId}`);
      setHoveredBookingDetail(res.data);
    } catch { }
  };

  const handleUserHover = async (userId?: number) => {
    if (!userId) return;
    try {
      const res = await api.get(`/users/${userId}`);
      setHoveredUserDetail(res.data.user);
    } catch { }
  };



  const formatDateExact = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr.replace(" ", "T"));
    return d.toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  };


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

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      : "-";

  const getPaginationNumbers = () => {
    const nums: (number | string)[] = [];
    const max = 5;
    if (totalPages <= max) for (let i = 1; i <= totalPages; i++) nums.push(i);
    else {
      nums.push(1);
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 1, totalPages - 1);
      if (start > 2) nums.push("...");
      for (let i = start; i <= end; i++) nums.push(i);
      if (end < totalPages - 1) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  };

  const formatVND = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  return (
    <div className="p-6 relative">
      <div className="relative">
        <h1 className="text-2xl font-bold mb-4">🏨 Room Availability Monitor</h1>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Input Search với icon */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by hotel, room type, or roomTypeId..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full pl-8"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Select Sort với icon */}
        <div className="relative w-full md:w-1/4">
          <select
            value={sortKey || ""}
            onChange={(e) => setSortKey((e.target.value as any) || null)}
            className="border p-2 rounded w-full appearance-none pr-6"
          >
            <option value="">📋 Sort By </option>
            <option value="hotelName">🏨 Hotel Name</option>
            <option value="roomTypeName">🛏 Room Type</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {sortKey && (
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border p-2 rounded bg-gray-200 flex items-center gap-2"
          >
            Order: {sortOrder.toUpperCase()}
            {sortOrder === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </button>
        )}


      </div>

      {/* Chế độ xem: all, thống kê, danh sách theo dõi*/}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            setShowAll("all");
            setApiType("all");
            setParam(undefined);
          }}
          className={`border p-2 rounded flex items-center gap-2 ${apiType === "all" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          <ChartColumn className="w-4 h-4" />
          Xem tất cả
        </button>

        <button
          onClick={() => {
            if (!userId) {
              toast("Vui lòng đăng nhập để xem danh sách theo dõi!", { icon: "⚠️" });
              return;
            }
            setApiType("monitor");
          }}
          className={`border p-2 rounded flex items-center gap-2 ${apiType === "monitor" ? "bg-blue-500 text-white" : "bg-green-200 hover:bg-green-300"
            }`}
        >
          <Monitor className="w-4 h-4" />
          Danh sách theo dõi
        </button>


        <div>
          <button
            onClick={() => setShowDashboard(true)}
            className="border p-2 rounded bg-green-200 hover:bg-green-300 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Thống kê
          </button>

          {showDashboard && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
              <div className="bg-white w-full max-w-7xl max-h-[90vh] rounded-lg shadow-lg overflow-auto p-4 relative">
                {/* Header với nút đóng */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Dashboard Room Monitor</h2>
                  <button
                    onClick={() => setShowDashboard(false)}
                    className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Nội dung dashboard */}
                <DashboardPage />
              </div>
            </div>
          )}
        </div>

      </div>
      {/* Bộ lọc RoomType */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setRoomTypeFilter(null)}
          className={`px-4 py-2 rounded flex items-center gap-2 ${roomTypeFilter === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <Users className="w-4 h-4" />
          All
        </button>

        {Object.values(RoomTypeName).map((type) => (
          <button
            key={type}
            onClick={() => setRoomTypeFilter(roomTypeFilter === type ? null : type)}
            className={`px-4 py-2 rounded flex items-center gap-2 ${roomTypeFilter === type ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {/* ví dụ chọn icon Bed cho các phòng */}
            <Bed className="w-4 h-4" />
            {type}
          </button>
        ))}
      </div>

      {/* Bộ lọc trạng thái phòng */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setRoomStatusFilter(null)}
          className={`px-4 py-2 rounded flex items-center gap-2 ${roomStatusFilter === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <Users className="w-4 h-4" />
          Tất cả
        </button>

        <button
          onClick={() => setRoomStatusFilter("occupied")}
          className={`px-4 py-2 rounded flex items-center gap-2 ${roomStatusFilter === "occupied" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <UserCheck className="w-4 h-4" />
          Có người ở
        </button>

        <button
          onClick={() => setRoomStatusFilter("empty")}
          className={`px-4 py-2 rounded flex items-center gap-2 ${roomStatusFilter === "empty" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          <UserX className="w-4 h-4" />
          Phòng trống
        </button>
      </div>

      <h1 className="text-2xl font-bold text-[#0068ff] mb-2 text-left">
        {apiType === "monitor"
          ? "Danh sách phòng đang theo dõi"
          : showAll === "all"
            ? "Hiển thị tất cả loại phòng"
            : "Lịch sử đặt phòng của tôi"}
      </h1>

      {currentGroups.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        currentGroups.map((group) => (
          <div key={group.hotelName} className="mb-6 border rounded-xl p-4 shadow bg-white">
            <div
              className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-600"
              onMouseEnter={() => handleHotelHover(group.rooms[0].hotelId)}
              onMouseLeave={() => setHoveredHotelDetail(null)}
            >
              {group.hotelName}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.rooms.map((room, idx) => {
                const key = room.bookingId ? `${room.roomTypeId}-${room.bookingId}` : `${room.roomTypeId}-empty-${idx}`;
                const isMonitored = monitoredRooms.includes(room.roomTypeId);

                return (
                  <div
                    key={key}
                    className="border rounded p-2 flex justify-between items-center cursor-pointer hover:scale-105 hover:shadow-lg hover:bg-blue-50 transition duration-200"
                    onMouseEnter={() => {
                      handleRoomTypeHover(room.roomTypeId);
                      if (["pending", "confirmed"].includes(room.bookingStatus || "")) {
                        handleBookingHover(group.rooms[0].bookingId);
                        handleUserHover(room.userId);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredRoomTypeDetail(null);
                      setHoveredUserDetail(null);
                      setHoveredBookingDetail(null);
                    }}
                  >

                    <div>
                      <p>📌 Room Type ID: {room.roomTypeId}</p>
                      <p>🏨 Room Type Name: {room.roomTypeName}</p>
                      {["pending", "confirmed"].includes(room.bookingStatus || "") ? <p>🧑 User ID: {room.userId}</p> : ""}

                      <p>
                        🧾 Status:{" "}
                        <span
                          className={`font-semibold px-2 py-1 rounded-full text-sm ${["pending", "confirmed"].includes(room.bookingStatus || "")
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {["pending", "confirmed"].includes(room.bookingStatus || "") ? "Có người ở" : "Phòng trống"}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMonitor(room.roomTypeId);
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium ${isMonitored ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                      {isMonitored ? "Bỏ theo dõi" : "Theo dõi"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {getPaginationNumbers().map((num, i) => (
          <button
            key={i}
            disabled={num === "..."}
            onClick={() => typeof num === "number" && setCurrentPage(num)}
            className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Hover RoomType */}
      {hoveredRoomTypeDetail && (
        <div className="fixed top-20 left-10 p-4 bg-white border rounded shadow-lg w-72 z-50">
          <h3 className="font-bold text-lg mb-2">📌 Room Type ID: {hoveredRoomTypeDetail.id}</h3>
          <p>🏨 Room Type Name: {hoveredRoomTypeDetail.name}</p>
          <p>📝 Description: {hoveredRoomTypeDetail.description}</p>
          <p>👥 Max Guests: {hoveredRoomTypeDetail.max_guests}</p>
          <p>📦 Total Inventory: {hoveredRoomTypeDetail.total_inventory}</p>
          <p>📐 Area: {hoveredRoomTypeDetail.area}</p>
          <p>🛏 Bed Type: {hoveredRoomTypeDetail.bed_type}</p>
        </div>
      )}

      {/* Hover Hotel */}
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

      {hoveredUserDetail && (
        <div className="fixed bottom-4 left-10 p-4 bg-white border rounded-2xl shadow-lg w-72 z-50">
          {/* Ảnh + tên */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Cánh trái */}
              <svg
                className="absolute -left-6 w-16 h-16 animate-wing-left"
                viewBox="0 0 64 64"
              >
                <defs>
                  <linearGradient id={`gradientLeft-${hoveredUserDetail.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#facc15"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#3b82f6"
                            : "#9ca3af"
                      }
                    />
                    <stop
                      offset="50%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#fcd34d"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#8b5cf6"
                            : "#d1d5db"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#fbbf24"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#ec4899"
                            : "#9ca3af"
                      }
                    />
                  </linearGradient>
                </defs>
                <path d="M32 32 C10 10, 0 64, 32 32" fill={`url(#gradientLeft-${hoveredUserDetail.id})`} />
              </svg>

              {/* Cánh phải */}
              <svg
                className="absolute -right-6 w-16 h-16 animate-wing-right"
                viewBox="0 0 64 64"
              >
                <defs>
                  <linearGradient id={`gradientRight-${hoveredUserDetail.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#facc15"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#3b82f6"
                            : "#9ca3af"
                      }
                    />
                    <stop
                      offset="50%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#fcd34d"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#8b5cf6"
                            : "#d1d5db"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        hoveredUserDetail?.membershipLevel === "Gold"
                          ? "#fbbf24"
                          : hoveredUserDetail?.membershipLevel === "Platinum"
                            ? "#ec4899"
                            : "#9ca3af"
                      }
                    />
                  </linearGradient>
                </defs>
                <path d="M32 32 C54 10, 64 64, 32 32" fill={`url(#gradientRight-${hoveredUserDetail.id})`} />
              </svg>

              {/* Avatar với gradient border */}
              <div
                className={`relative flex items-center justify-center
    ${hoveredUserDetail?.membershipLevel === "Platinum"
                    ? "w-8 h-13 rounded-[80%/40%] p-[2px]" // bầu dục mỏng hơn
                    : "w-12 h-13 rounded-full p-[3px]"     // tròn
                  }
    ${hoveredUserDetail?.membershipLevel === "Gold"
                    ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                    : hoveredUserDetail?.membershipLevel === "Platinum"
                      ? "bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500"
                      : "bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400"
                  }
  `}
              >

                <img
                  src={hoveredUserDetail?.avatar || "https://avatars.githubusercontent.com/u/9919?s=128&v=4"}
                  alt="User Avatar"
                  className={`w-full h-full object-cover ${hoveredUserDetail?.membershipLevel === "Platinum" ? "rounded-[50%/40%]" : "rounded-full"
                    }`}
                />

                {/* Lông rơi */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-2 bg-white opacity-70 rounded-full animate-feather"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 1.5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-1">
                🧑 <span>User ID: {hoveredUserDetail.id}</span>
              </h3>
              <p className="text-sm text-gray-600">{hoveredUserDetail.fullName}</p>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-1 text-sm text-gray-700">
            <p>👤 Username: {hoveredUserDetail.username}</p>
            <p>📧 Email: {hoveredUserDetail.email}</p>
            <p>📱 Phone: {hoveredUserDetail.phone}</p>
            <p>🎭 Role: {hoveredUserDetail.role}</p>
            <p>🎂 Dob: {formatDateUTC(hoveredUserDetail.dob)}</p>
            <p>⚧ Gender: {hoveredUserDetail.gender}</p>


            <p
              className={`font-bold text-lg flex items-center gap-2 ${hoveredUserDetail?.membershipLevel === "Silver"
                ? "text-gray-400"
                : hoveredUserDetail?.membershipLevel === "Gold"
                  ? "text-yellow-400"
                  : hoveredUserDetail?.membershipLevel === "Platinum"
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              style={{ textDecoration: "none" }}
            >
              {hoveredUserDetail?.membershipLevel === "Silver"
                ? "🥈"
                : hoveredUserDetail?.membershipLevel === "Gold"
                  ? "🥇"
                  : hoveredUserDetail?.membershipLevel === "Platinum"
                    ? "🏆"
                    : "🥈"}{" "}
              {hoveredUserDetail?.membershipLevel ?? "Silver"} ({hoveredUserDetail?.loyaltyPoints ?? 0} điểm)
            </p>


          </div>
        </div>
      )}

    </div>
  );
}
