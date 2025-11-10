import { useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";


export const Tooltip = ({ children, label }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top - 8, // offset 8px ke atas
      left: rect.left + rect.width / 2,
    });
    setVisible(true);
  };

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, -100%)",
            }}
            className={clsx(
              "bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-99999",
              "transition-all duration-200"
            )}
          >
            {label}
          </div>,
          document.body
        )}
    </>
  );
};
