import { ReactNode, useState } from "react";

type TooltipProps = {
  children: ReactNode;
  label: string;
};

export const Tooltip = ({ children, label }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Icon atau elemen yang di-wrap */}
      {children}

      {/* Tooltip Box */}
      <div
        className={`
          absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
          bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50
          transition-all duration-200
          ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-1"}
        `}
      >
        {label}
      </div>
    </div>
  );
};
