import Image from "next/image";
import { useState } from "react";


export const FlagIcon = ({ code, size = 20, flagCode }: FlagIconProps) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className="flex items-center justify-center bg-gray-200 text-gray-900 py-1 px-1.5 rounded-sm cursor-pointer transition"
                style={{ width: size, height: size, fontSize: size * 0.5 }}
            >
                {flagCode}
            </div>
        );
    }

  return (
    <div className="hover:bg-gray-200 text-gray-900 p-1 rounded-sm cursor-pointer transition">
        <Image
            src={`https://flagcdn.com/w${size}/${code}.png`}
            alt={code}
            width={size}
            height={size}
            className="rounded-sm object-cover h-3 w-4.5"
            onError={() => setError(true)}
        />
    </div>
  );
}
