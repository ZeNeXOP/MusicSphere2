import React from "react";
import clsx from "clsx";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 40,
  className,
  children,
}) => (
  <div
    className={clsx(
      "inline-flex items-center justify-center bg-gray-700 text-white font-bold rounded-full overflow-hidden",
      className
    )}
    style={{ width: size, height: size }}
  >
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      children || <span className="text-lg">?</span>
    )}
  </div>
);

export default Avatar;
