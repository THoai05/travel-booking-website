"use client";

import Image from "next/image";
import {
  Mail,
  Clock,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const socials = [
    { icon: Instagram, color: "from-pink-500 via-red-400 to-yellow-400" },
    { icon: Facebook, color: "from-blue-600 to-blue-400" },
    { icon: Twitter, color: "from-sky-400 to-blue-500" },
    { icon: Youtube, color: "from-red-600 to-rose-500" },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-12 text-gray-700">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 mb-12">
          {/* --- COLUMN 1: Company Info --- */}
          <div>
            <div className="flex items-center gap-2 mb-4 -mt-2 -ml-[8px]">
              <Image
                src="/logo.png"
                alt="Bluevera"
                width={120}
                height={80}
                className="w-[120px] h-auto"
              />
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} /> 4517 Washington Ave. Manchester, Kentucky 39495
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} /> Giờ làm việc: 8:00 – 17:00 (Thứ 2 – Thứ 7)
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} /> support@bluevera.com
              </li>
            </ul>
          </div>

          {/* --- COLUMN 2: Services --- */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="flex gap-8 space-y-2 text-sm">
              <div className="flex flex-col gap-4">
                <li>Hướng dẫn viên du lịch</li>
                <li>Đặt tour</li>
                <li>Đặt phòng khách sạn</li>
              </div>
              <div className="flex flex-col gap-4">
                <li>Đặt vé máy bay</li>
                <li>Thuê xe du lịch</li>
                <li>Dịch vụ vận chuyển</li>
              </div>
            </ul>
          </div>

          {/* --- COLUMN 3: Subscribe --- */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-4">Đăng ký nhận tin</h3>
            <div className="flex items-center bg-white border rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button
                className="bg-black text-sm text-white px-4 py-3 rounded-full
              hover:bg-gray-800 transition"
              >
                Đăng ký ngay
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Không spam, không quảng cáo. Bạn có thể hủy bất cứ lúc nào.
            </p>
          </div>
        </div>

        {/* --- MIDDLE SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 pt-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-3">Theo dõi chúng tôi</h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, color }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 
                    cursor-pointer relative overflow-hidden group transition-all duration-300`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                  <Icon
                    size={18}
                    className="text-gray-700 relative z-10 group-hover:text-white transition-colors duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-start md:text-center lg:text-start">
            <div className="flex gap-2">
              <Image src="/hotline.png" alt="hotline" width={20} height={18} />
              <p className="flex font-semibold">Cần hỗ trợ? Gọi ngay</p>
            </div>

            <p className="text-lg font-bold text-yellow-500 mt-3">
              1-800-222-8888
            </p>
          </div>

          <div className="flex flex-col items-start w-full">
            <h4 className="font-semibold mb-2">Payments</h4>
            <div className="flex gap-4 mt-2">
              <Image src="/paypal.png" alt="PayPal" width={60} height={30} />
              <Image src="/mastercard.png" alt="Mastercard" width={30} height={30} />
              <Image src="/stripe.png" alt="Stripe" width={40} height={30} />
              <Image src="/skrill.png" alt="Skrill" width={45} height={30} />
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6">
          <p>© 2025 Bluevera Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <span>Terms</span>
            <span>Privacy Policy</span>
            <span>Legal Notice</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
