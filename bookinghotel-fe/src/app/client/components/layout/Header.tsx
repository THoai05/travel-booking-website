"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "../../../../constants/index";
import { useEffect, useState, useRef } from "react"; // <-- THÊM MỚI: useRef
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import api from "@/axios/axios";

import NotificationsPage from "@/app/client/notifications/page";

// --- THÊM MỚI: Icons (cần cài react-icons: npm install react-icons) ---
import {
  HiUserCircle,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
} from "react-icons/hi";

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  dob?: string | null;
  gender?: string;
  loyaltyPoints?: number;
  membershipLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
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

  const { user, logout } = useAuth();

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

  // 🔹 Lấy userId
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await api.get(`notifications/user/${user?.id}/unread-count`);
        setUnreadCount(res.data.unreadCount);

      } catch {
        //toast.error("Không thể lấy thông tin người dùng!");
      }
    };
    fetchNotification();
  }, []);


  // --- Track localStorage changes
  // --- Track token & methodShowLoginregister changes


  const handleClickProfile = () => {
    router.push("/client/auth/profile");
  };

  const handleLogout = () => {
    logout();
    router.replace("/client");
  };
  console.log(user);

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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-1 py-0.5 text-sm">
                <Image src="/global.png" alt="Global" width={16} height={16} />
                <select className="bg-transparent outline-none text-sm p-0 cursor-pointer">
                  <option value="en">EN</option>
                  <option value="vi">VI</option>
                </select>
              </div>
              <div className="px-1 py-0.5 text-sm">
                <select className="bg-transparent outline-none text-sm p-0 cursor-pointer">
                  <option value="usd">USD</option>
                  <option value="vnd">VND</option>
                </select>
              </div>
            </div>

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
                <HiUserCircle className="w-6 h-6" />
                <span className="hidden sm:inline">
                  {user.name || user.username || "bạn"}
                </span>
              </div>
            )}

            {/* Nếu có profile */}


            {/* --- CHỈNH SỬA: DROPDOWN MENU (YÊU CẦU 2) --- */}

            {/* 1. Nếu CHƯA login, hiển thị icon menu (cho mobile) */}
            {!loading && !user && (
              <div className="menu-icon cursor-pointer">
                <Image
                  src="/menu.png"
                  alt="menu icon"
                  width={32}
                  height={32}
                />
              </div>
            )}

            {/* 2. Nếu ĐÃ login, biến icon menu thành trigger cho dropdown */}
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                {/* Nút trigger */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="menu-icon cursor-pointer"
                >
                  <Image
                    src="/menu.png"
                    alt="menu icon"
                    width={32}
                    height={32}
                  />
                </button>

                {/* Panel của dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">

                    <button
                      onClick={() => setShowNotifications(true)}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors relative"
                    >
                      <HiOutlineBell className="mr-3 w-5 h-5" />
                      Thông báo
                      {unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        router.push("/favourites");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiOutlineHeart className="mr-3 w-5 h-5" />
                      Yêu thích
                    </button>

                    <button
                      onClick={() => {
                        router.push("/rooms/room-monitor");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiOutlineClipboardCheck className="mr-3 w-5 h-5" />
                      Giám sát phòng
                    </button>

                    <button
                      onClick={() => {
                        router.push("/rooms/booking-history");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiOutlineCalendar className="mr-3 w-5 h-5" />
                      Lịch sử đặt phòng
                    </button>


                    <button
                      onClick={() => {
                        handleClickProfile();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-[5px] shadow-lg overflow-auto p-4">
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