'use client'

import Image from "next/image";
import dayjs from "dayjs";
import useWindowStore from "@/store/window";

import { navLinks, navUtilsIcons } from "@/lib/constants";

export const TopBar = () => {
    const {openWindow} = useWindowStore()

    return ( 
        <nav className="flex justify-between items-center bg-white/50 backdrop-blur-3xl p-2 px-5 select-none">
            <div className="flex items-center max-sm:w-full max-sm:justify-center gap-3">
                <Image
                    src={'/icons/logo.webp'}
                    alt="logo"
                    height={24}
                    width={24}
                />
                <p className="font-bold cursor-pointer hover:underline transition-all text-gray-800">Herry Widnyana</p>

                {/* <ul className="flex items-center gap-5 max-sm:hidden">
                    {navLinks.map(({id, name, type}) => (
                        <li 
                            key={id}
                            onClick={() => openWindow(type)}
                        >
                            <p className="text-sm cursor-pointer hover:underline transition-all text-black">{name}</p>
                        </li>
                    ))}
                </ul> */}
            </div>
            <div className="flex items-center max-sm:w-full max-sm:justify-center gap-5">
                <ul className="flex items-center gap-5 max-sm:hidden">
                    {navUtilsIcons.map(({id, imgSrc}) => (
                        <li key={id}>
                            <Image
                                src={imgSrc}
                                alt={`icon-${id}`}
                                height={14}
                                width={14}
                            />
                        </li>
                    ))}
                </ul>
                <time className="text-sm font-medium text-black">{dayjs().format('ddd D MMM h:mm A')}</time>
            </div>
        </nav>
    );
}