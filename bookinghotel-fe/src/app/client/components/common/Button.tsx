import Image from "next/image";

type ButtonProps = {
    type: 'button' | 'submit' ;
    title: string;
    icon?: string;
    variant: string;
}

const Button = ({ type, title, icon, variant }: ButtonProps) => {
  return (
    <button
    className={`flexCenter gap-1.5 rounded-full border cursor-pointer ${variant}`}
    type={type}
    >
        {icon && <Image src={icon} alt="icon" width={24} height={24} className="mr-2" />}
        <span className="bold-16 whitespace-nowrap">{title}</span>
    </button>
  )
}

export default Button