import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  rounded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = true,
  rounded = true,
  ...props
}) => (
  <div
    className={clsx(
      "bg-surface border border-border",
      shadow && "shadow-card",
      rounded && "rounded-2xl",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
