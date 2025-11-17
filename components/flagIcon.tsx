import Image from "next/image";
import { useState } from "react";
import { Tooltip } from "../tooltip";
import { useApp } from "@/context/AppContextProps";
import { languageToFlagCode } from "@/utils";

export const FlagIcon = ({ code, size = 20 }: FlagIconProps) => {
    const [error, setError] = useState(false);
    const {ui} = useApp()
    const flag = languageToFlagCode(code);  

    if (error) {
        return (
            <div
                className="flex items-center justify-center bg-gray-200 text-gray-900 py-1 px-1.5 rounded-sm cursor-pointer transition"
                style={{ width: size, height: size, fontSize: size * 0.5 }}
            >
                {flag.toUpperCase()}
            </div>
        );
    }

  return (
    <div className="hover:bg-gray-200 text-gray-900 p-1 rounded-sm cursor-pointer transition">
        <Image
            src={`https://flagcdn.com/w${size}/${flag}.png`}
            alt={flag}
            width={size}
            height={size}
            className="rounded-sm"
            onError={() => setError(true)}
        />
    </div>
  );
}
