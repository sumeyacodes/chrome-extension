import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`font-bold py-2 px-4 rounded ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
