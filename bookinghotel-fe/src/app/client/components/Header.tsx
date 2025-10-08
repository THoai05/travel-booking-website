"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../../../constants";

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Logo */}
      <div className="nav-logo">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={74} height={29} />
        </Link>
      </div>

      {/* Navigation links */}
      <div className="nav-links flex gap-6">
        {NAV_LINKS.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.key}
              href={link.href}
              className={`regular-16 flexCenter cursor-pointer pb-1.5 transition-all relative 
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                after:bg-gradient-to-r after:from-[#00C6FF] after:to-[#0072FF]
                after:transition-all after:duration-300
                ${
                  isActive
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
      <div className="nav-actions flex gap-4 items-center">
        <select className="border rounded-md p-1">
          <option value="en">EN</option>
          <option value="vi">VI</option>
        </select>

        <select className="border rounded-md p-1">
          <option value="usd">USD</option>
          <option value="vnd">VND</option>
        </select>
      </div>
    </nav>
  );
};

export default Header;
