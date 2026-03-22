import type { ReactNode } from "react";

type IconButtonProps = {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
};

export const IconButton = ({
  onClick,
  title,
  ariaLabel,
  className = "",
  disabled = false,
  children,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`inline-flex items-center justify-center p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${className}`}
    >
      {children}
    </button>
  );
};