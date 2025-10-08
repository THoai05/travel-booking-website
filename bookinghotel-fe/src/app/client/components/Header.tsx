import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "../../../constants";

const Header = () => {
    return (
        <nav className="w-full h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <div className="nav-logo">
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={74} height={29} />
                </Link>
            </div>
            <div className="nav-links">
                {NAV_LINKS.map(link => (
                    <a key={link.key} href={link.href}>{link.label}</a>
                ))}
            </div>
            <div className="nav-actions">
                <div className="lang">
                    <select name="language" id="language-select">
                        <option value="en">EN</option>
                        <option value="vi">VI</option>
                    </select>
                </div>
                <div className="currency">
                    <select name="currency" id="currency-select">
                        <option value="usd">USD</option>
                        <option value="vnd">VND</option>
                    </select>
                </div>
                <div className="sign-in">

                </div>
                <div className="register">

                </div>
            </div>
        </nav>
    )
}

export default Header;
