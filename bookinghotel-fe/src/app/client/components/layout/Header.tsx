"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../../../../constants/index";
import Button from "../common/Button";

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 
    shadow-sm transition-shadow hover:shadow">
      <div className="flex items-center justify-between px-12 py-3">
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

        {/* Navigation links */}
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
          <div className="flex items-center gap-2">
            {/* Language select với icon */}
            <div className="flex items-center gap-1 px-1 py-0.5 text-sm">
              <Image src="/global.png" alt="Global" width={16} height={16} />
              <select className="bg-transparent outline-none text-sm p-0">
                <option value="en">EN</option>
                <option value="vi">VI</option>
              </select>
            </div>

            {/* Currency select */}
            <div className="px-1 py-0.5 text-sm">
              <select className="bg-transparent outline-none text-sm p-0">
                <option value="usd">USD</option>
                <option value="vnd">VND</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="avatar">
              <Image 
              src="/avatar.png"
                alt="logo"
                width={40}
                height={33}
                className=""
              />
            </div>
            <div className="">
              <p className="text-[14px]">Nhóm K</p>
              <Image 
              src="/vip.png"
                alt="logo"
                width={60}
                height={12}
                className=""
              />
            </div>
          </div>
          <div className="menu-icon">
            <Image src="/menu.png" alt="menu icon" width={32} height={32} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;