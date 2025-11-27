"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "../../../../constants/index";
import { useEffect, useState, useRef } from "react";
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import api from "@/axios/axios";
import { motion, AnimatePresence } from "framer-motion";

import NotificationsPage from "@/app/client/notifications/page";

import {
  HiUserCircle,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineBookmark,
} from "react-icons/hi";

interface ChatMessage {
  id: number;
  sender: User | null;
  receiver: User | null;
  message: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
}
interface User {
  id: number;
  username: string;
}


const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  // --- THÊM MỚI: State cho dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref để detect click bên ngoài

  // --- Modal control
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("showLogin"));
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("showRegister"));
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("none"));
  };

  const { user, setUser, logout } = useAuth();

  // --- Fetch profile


  // --- useEffect mount
  // --- THÊM MỚI: Click outside để đóng dropdown ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    // Bind event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // 1. Lấy profile lần đầu
  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin");
    }

    if (!user) return;

    const fetchAll = async () => {
      try {
        // 1. Fetch profile
        const profileRes = await api.get("auth/profile");
        if (profileRes.status !== 401) {
          setProfile(profileRes.data);
          setUser(profileRes.data);
          if (user?.role === "admin") {
            router.replace("/admin");
          }
        }

        // 2. Fetch notifications
        if (profileRes.data?.id) {
          const notifRes = await api.get(
            `notifications/user/${profileRes.data.id}/unread-count`
          );
          setUnreadCount(notifRes.data);
        }
      } catch (err) {
        console.log("Fetch error:", err);
        setUser(null);
      }
    };

    fetchAll(); // lần đầu

    const interval = setInterval(fetchAll, 3000); // lặp 5 giây
    return () => clearInterval(interval);

  }, []);


  // --- Track localStorage changes
  // --- Track token & methodShowLoginregister changes


  const handleClickProfile = () => {
    router.push("/client/auth/profile");
  };

  const handleLogout = () => {
    logout();
    router.refresh()
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-shadow hover:shadow">
        <div className="flex items-center justify-between px-12 py-3">
          {/* Logo */}
          <div className="flex-1 max-w-[500px]">
            <Link href="/" className="inline-block">
              <div className="w-[160px] md:w-[100px]">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={300}
                  height={150}
                  className="w-100 h-auto object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 min-w-3xl flex justify-center gap-8 text-gray-700 font-medium lg-max:hidden">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`relative pb-1.5 transition-all
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:bg-gradient-to-r after:from-[#00C6FF] after:to-[#0072FF]
                    after:transition-all after:duration-300
                    ${isActive
                      ? "after:w-full text-[#0072FF]"
                      : "after:w-0 hover:after:w-full"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end gap-4 items-center">
            {/* Language & Currency */}


            {/* Nếu chưa đăng nhập */}
            {!loading && !user && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={openLogin}
                  className="w-26 h-10 border border-[#0068ff] text-[#0068ff] font-medium px-3 py-1.5 rounded-[5px] hover:bg-[#e8f1ff] transition-all duration-200 text-sm"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={openRegister}
                  className="w-26 h-10 bg-[#0068ff] text-white font-medium px-3 py-1.5 rounded-[5px] hover:bg-[#0053cc] transition-all duration-200 text-sm shadow-sm"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* --- CHỈNH SỬA: KHI ĐÃ LOGIN (YÊU CẦU 1) --- */}
            {/* Giờ chỉ hiển thị icon và tên, nút Đăng xuất đã chuyển vào dropdown */}
            {!loading && user && (
              <div className="flex items-center gap-2 font-medium text-sm text-gray-700">

                {/* Avatar */}
                {/* Avatar with wings & falling feathers */}
                <div className="relative flex items-center justify-center">
                  {/* Cánh trái */}
                  <svg
                    className="absolute -left-6 w-16 h-16 animate-wing-left"
                    viewBox="0 0 64 64"
                  >
                    <path
                      d="M32 32 C10 10, 0 64, 32 32"
                      fill="url(#gradientLeft)"
                    />
                    <defs>
                      <linearGradient id="gradientLeft" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#facc15" :
                            profile?.membershipLevel === "Platinum" ? "#3b82f6" : "#9ca3af"
                        } />
                        <stop offset="50%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#fcd34d" :
                            profile?.membershipLevel === "Platinum" ? "#8b5cf6" : "#d1d5db"
                        } />
                        <stop offset="100%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#fbbf24" :
                            profile?.membershipLevel === "Platinum" ? "#ec4899" : "#9ca3af"
                        } />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Cánh phải */}
                  <svg
                    className="absolute -right-6 w-16 h-16 animate-wing-right"
                    viewBox="0 0 64 64"
                  >
                    <path
                      d="M32 32 C54 10, 64 64, 32 32"
                      fill="url(#gradientRight)"
                    />
                    <defs>
                      <linearGradient id="gradientRight" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#facc15" :
                            profile?.membershipLevel === "Platinum" ? "#3b82f6" : "#9ca3af"
                        } />
                        <stop offset="50%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#fcd34d" :
                            profile?.membershipLevel === "Platinum" ? "#8b5cf6" : "#d1d5db"
                        } />
                        <stop offset="100%" stopColor={
                          profile?.membershipLevel === "Gold" ? "#fbbf24" :
                            profile?.membershipLevel === "Platinum" ? "#ec4899" : "#9ca3af"
                        } />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Avatar chính với gradient border */}
                  <div
                    className={`relative rounded-full p-[2px] 
      ${profile?.membershipLevel === "Gold"
                        ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                        : profile?.membershipLevel === "Platinum"
                          ? "bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500"
                          : "bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400"
                      }`}
                  >
                    <img
                      src={profile?.avatar || "https://avatars.githubusercontent.com/u/9919?s=128&v=4"}
                      alt="User Avatar"
                      className="rounded-full h-10 w-10 object-cover border-2 border-gray-900"
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



                {/* Username + Membership */}
                {profile && (
                  <div className="flex flex-col justify-center items-start">
                    {/* Username */}
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                      {profile.username || "bạn"}
                    </span>

                    {/* Membership */}
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <span className={
                        profile.membershipLevel === "Silver"
                          ? "text-gray-400 truncate max-w-[120px]"
                          : profile.membershipLevel === "Gold"
                            ? "text-yellow-400 truncate max-w-[120px]"
                            : profile.membershipLevel === "Platinum"
                              ? "text-pink-600 truncate max-w-[120px]"
                              : "text-gray-400 truncate max-w-[120px]"
                      }>
                        {profile.membershipLevel ?? "Silver"} ({profile.loyaltyPoints ?? 0})
                      </span>
                      <span
                        className={
                          profile.membershipLevel === "Silver"
                            ? "text-gray-400"
                            : profile.membershipLevel === "Gold"
                              ? "text-yellow-400"
                              : profile.membershipLevel === "Platinum"
                                ? "text-blue-600"
                                : "text-gray-400"
                        }
                      >

                        {profile.membershipLevel === "Silver"
                          ? "🥈"
                          : profile.membershipLevel === "Gold"
                            ? "🥇"
                            : profile.membershipLevel === "Platinum"
                              ? "🏆"
                              : "🥈"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- CHỈNH SỬA: DROPDOWN MENU (YÊU CẦU 2) --- */}

            {/* 1. Nếu CHƯA login, hiển thị icon menu (cho mobile) */}
            {!loading && !user && (
              null
            )}

            {/* 2. Nếu ĐÃ login, biến icon menu thành trigger cho dropdown */}
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                {/* Nút trigger (Giữ nguyên) */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="menu-icon cursor-pointer w-10 h-10 flex items-center justify-center transition-transform active:scale-95"
                >
                  <Image
                    src="/menu.png"
                    alt="menu icon"
                    width={35}
                    height={35}
                    className="object-contain"
                  />
                </button>

                {/* Panel của dropdown có hiệu ứng */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      // --- CẤU HÌNH ANIMATION ---
                      initial={{ opacity: 0, scale: 0.95, y: -10 }} // Trạng thái ban đầu: mờ, nhỏ hơn xíu, và ở trên cao 10px
                      animate={{ opacity: 1, scale: 1, y: 0 }}      // Trạng thái hiện ra: rõ, size chuẩn, về vị trí cũ
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}    // Trạng thái khi tắt: mờ dần và thu nhỏ lại
                      transition={{ duration: 0.2, ease: "easeInOut" }} // Thời gian chạy
                      style={{ transformOrigin: "top right" }}      // Quan trọng: Zoom từ góc phải trên (chỗ nút bấm) ra
                      // ---------------------------

                      className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-100 overflow-hidden"
                    >

                      <button
                        onClick={() => setShowNotifications(true)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors relative"
                      >
                        <HiOutlineBell className="mr-3 w-5 h-5" />
                        Thông báo
                        {unreadCount >= 0 && (
                          <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          router.push("/favourites");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <HiOutlineHeart className="mr-3 w-5 h-5" />
                        Yêu thích
                      </button>

                      <button
                        onClick={() => {
                          router.replace("/rooms/booking-history");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <HiOutlineCalendar className="mr-3 w-5 h-5" />
                        Lịch sử đặt phòng
                      </button>

                      <button
                        onClick={() => {
                          router.replace("/rooms/trip-history");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <HiOutlineBookmark className="mr-3 w-5 h-5" />
                        Lịch sử chuyến đi
                      </button>

                      <button
                        onClick={() => {
                          handleClickProfile();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <HiOutlineUser className="mr-3 w-5 h-5" />
                        Hồ sơ
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineLogout className="mr-3 w-5 h-5" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[80vh] rounded-[5px] shadow-lg overflow-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Thông báo</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <NotificationsPage />
          </div>
        </div>
      )}


      {/* Modal login/register */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <Login onClose={closeModal} onSwitchToRegister={openRegister} />
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <Register onClose={closeModal} onSwitchToLogin={openLogin} />
        </div>
      )}
    </>
  );
};

export default Header;