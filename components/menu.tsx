'use client'

import clsx from "clsx";
import Image from "next/image";

export const Menu = ({ 
    items, 
    title, 
    activeLocation,
    onClick,
    className 
}: MenuProps) => {

  return (
    <div>
        {title && <h3 className="text-xs font-medium text-gray-400 mb-1">{title}</h3>}
        <ul className={clsx(className ?? className)}>
            {items.map((item) => (
                <li
                    key={item.id}
                    onClick={() => onClick?.(item)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
                        item.id === activeLocation?.id ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-200"
                    )}
                >
                    <Image
                        src={item.icon}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="size-4"
                    />

                    <p className="text-xs md:text-sm font-medium truncate">{item.name}</p>
                </li>
            ))}
        </ul>
    </div>
  );
};