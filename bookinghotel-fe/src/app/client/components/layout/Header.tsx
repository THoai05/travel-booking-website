"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "../../../../constants/index";
import { useEffect, useState } from "react";
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";

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
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

  // --- Fetch profile
  const fetchProfile = async () => {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    try {
      const parsed = JSON.parse(tokenData);
      const token = parsed.token;
      if (!token) {
        setProfile(null);
        setLoading(false);
        return null;
      }

      const res = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy profile");
      const data = await res.json();
      setProfile(data);
      setLoading(false);

      // 🔹 Nếu là admin, tự động chuyển sang /admin
      if (data.role === "admin") {
        router.push("/admin");
      }

      return data;
    } catch (err) {
      console.error("❌ Lỗi load profile:", err);
      setProfile(null);
      setLoading(false);
      return null;
    }
  };

  // --- useEffect mount
  useEffect(() => {
    if (!localStorage.getItem("methodShowLoginregister")) {
      localStorage.setItem("methodShowLoginregister", JSON.stringify("none"));
    }
    const timer = setTimeout(() => fetchProfile(), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- Track localStorage changes
  // --- Track token & methodShowLoginregister changes
  useEffect(() => {
    const handleStorageOrTokenCheck = () => {
      // --- Modal control
      const method = JSON.parse(localStorage.getItem("methodShowLoginregister") || '"none"');
      if (method === "showLogin") openLogin();
      else if (method === "showRegister") openRegister();
      else closeModal();

      // --- Check token
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        setProfile(null); // token bị xóa → đăng xuất
      } else {
        try {
          const parsed = JSON.parse(tokenData);
          if (parsed?.token) {
            fetchProfile(); // token hợp lệ → fetch lại profile
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      }
    };

    // --- 1. Nghe sự kiện storage (tab khác)
    window.addEventListener("storage", handleStorageOrTokenCheck);

    // --- 2. Interval kiểm tra token mỗi 1 giây (cùng tab)
    const interval = setInterval(handleStorageOrTokenCheck, 1000);

    // --- 3. Chạy ngay khi mount
    handleStorageOrTokenCheck();

    return () => {
      window.removeEventListener("storage", handleStorageOrTokenCheck);
      clearInterval(interval);
    };
  }, []);


  const handleClickProfile = () => {
    router.push("/client/auth/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("none"));
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-shadow hover:shadow">
        <div className="flex items-center justify-between px-12 py-3">
          {/* Logo */}
          <div className="flex-1 max-w-[500px]">
            <Link href="/" className="inline-block">
              <div className="w-[160px] md:w-[100px]">
                <Image src="/logo.png" alt="logo" width={300} height={150} className="w-100 h-auto object-contain" />
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
                    ${isActive ? "after:w-full text-[#0072FF]" : "after:w-0 hover:after:w-full"}`}
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
            {!loading && !profile && (
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

            {/* Nếu có profile */}
            {!loading && profile && profile.role !== "admin" && (
              <div className="flex gap-2 items-center">
                <div
                  className="flex gap-2 cursor-pointer items-center"
                  onClick={handleClickProfile}
                >
                  <div className="avatar">
                    <Image
                      src={profile?.avatar || "/avatar.png"}
                      alt={profile?.username || "avatar"}
                      width={40}
                      height={33}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-gray-700">
                      {profile?.fullName || "Người dùng"}
                    </p>
                    <Image src="/vip.png" alt="membership level" width={60} height={12} />
                  </div>
                </div>
              </div>
            )}

            <div className="menu-icon cursor-pointer">
              <Image src="/menu.png" alt="menu icon" width={32} height={32} />
            </div>
          </div>
        </div>
      </nav>

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