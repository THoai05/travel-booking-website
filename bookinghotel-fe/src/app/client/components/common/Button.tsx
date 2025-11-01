import Image from "next/image";
import { LucideIcon } from "lucide-react";
import React from "react";

type ButtonProps = {
  type: 'button' | 'submit';
  title: string;
  icon?: LucideIcon | string;
  variant: string;
};

const Button = ({ type, title, icon, variant }: ButtonProps) => {
  const isLucideIcon = typeof icon !== "string";

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-full border cursor-pointer ${variant}`}
      type={type}
    >
      {isLucideIcon && icon ? (
        React.createElement(icon as LucideIcon, { className: "w-5 h-5" })
      ) : (
        icon && (
          <Image src={icon as string} alt="icon" width={20} height={20} />
        )
      )}
      <span className="font-semibold whitespace-nowrap">{title}</span>
    </button>
  );
};

export default Button;
