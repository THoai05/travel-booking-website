"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../../../../constants";
import Button from "../common/Button";

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full py-2 bg-white border-b border-gray-200 flex items-center justify-between px-12">
      {/* Logo */}
      <div className="flex-1">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="logo" width={100} height={29} />
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 flex justify-center gap-8 text-gray-700 font-medium xl-max:hidden">
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
        <select className="border rounded-md p-1">
          <option value="en">EN</option>
          <option value="vi">VI</option>
        </select>

        <select className="border rounded-md p-1">
          <option value="usd">USD</option>
          <option value="vnd">VND</option>
        </select>

        <Button
          type="button"
          title="Sign In"
          variant="border border-[#E4E6E8] font-medium hover:bg-blue-50 px-6 py-2 cursor-pointer"
        />

        <Button
          type="button"
          title="Sign Up"
          variant="bg-[#0E7490] text-white px-6 py-2 hover:bg-[#0c5a6b] font-medium"
        />

        <div className="menu-icon">
          <Image src="/menu.png" alt="menu icon" width={32} height={32} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
