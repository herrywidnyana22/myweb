import clsx from 'clsx';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export const Tooltip = ({
  children,
  label,
  bgColor,
  textColor,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top - 12,
      left: rect.left + rect.width / 2,
    });
    setVisible(true);
  };

  const isHexBg = bgColor?.startsWith('#');
  const isHexText = textColor?.startsWith('#');

  return (
    <>
      <div
        className='relative inline-block'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: 'translate(-50%, -100%)',
            }}
            className='pointer-events-none z-99999'
          >
            <div
              className={clsx(
                'relative max-w-45 rounded-md px-3 py-1 text-center text-xs wrap-break-word whitespace-normal shadow-2xl',
                // tailwind bg / text kalau **bukan** hex
                !isHexBg && (bgColor ?? 'bg-primary-light'),
                !isHexText && (textColor ?? 'text-accent')
              )}
              style={{
                // kalau hex → pakai inline style
                backgroundColor: isHexBg ? bgColor : undefined,
                color: isHexText ? textColor : undefined,
              }}
            >
              {label}

              {/* 🔻 ARROW */}
              <span
                className={clsx(
                  'absolute top-full left-1/2 -translate-x-1/2',
                  'size-0 border-l-[6px] border-l-transparent',
                  'border-r-[6px] border-r-transparent',
                  'border-t-[6px]',
                  // kalau **bukan** hex → pakai warna default tailwind
                  !isHexBg && 'border-t-primary-light'
                )}
                style={
                  isHexBg
                    ? {
                        // kalau hex → override warna arrow
                        borderTopColor: bgColor,
                      }
                    : undefined
                }
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
