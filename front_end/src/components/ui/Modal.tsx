import React from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  className,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div
        className={clsx(
          "bg-surface rounded-2xl shadow-card p-8 max-w-lg w-full relative",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white text-xl font-bold focus:outline-none"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
