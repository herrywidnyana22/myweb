'use client'

import Image from "next/image";
import Link from "next/link";

import { WindowWrapper } from "@/hoc/windowWrapper";
import { WindowControls } from "@/components/windowControls";
import { dockApps, socials } from "@/lib/constants";
import useWindowStore from "@/store/window";
import { Tooltip } from "@/components/tooltip";

const ContactWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.contact?.data as LocationValue | undefined

    if(!data) return null

    const {icon, name, tooltipText} = data

    return ( 
        <div className="rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden bg-white">
        
        {/* ===== TOP BAR ===== */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400">
                <div className="w-24">
                    <WindowControls target={'contact'} />
                </div>

                <div className="flex items-center gap-2">
                    {icon && (
                        <div className="size-4 overflow-hidden rounded-md">
                            <Image
                                src={icon}
                                alt={`${name} icon`}
                                width={32}
                                height={32}
                                className="object-cover size-4"
                            />
                        </div>
                    )}
                    <h2 className="font-semibold text-gray-600">{name}</h2>
                </div>

                <div className="w-24" />
            </div>

        {/* ===== CONTENT ===== */}
            <div className="flex flex-col justify-start p-6 space-y-5">

            {/* Avatar */}
                <Image
                    src={'/images/profile.webp'}
                    alt="Herry"
                    width={128}
                    height={128}
                    className="size-24 rounded-full object-cover"
                />

                {/* Title */}
                <h3 className="text-lg font-semibold text-black">
                    Let&apos;s Connect
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                    Got an idea? A bug to squash? or just want to talk tech? I&apos;m in.
                </p>

                {/* ===== SOCIAL BUTTONS ===== */}
                <ul className="flex items-center gap-3">
                    {socials.map((social) => (
                        <Tooltip 
                            key={social.id} 
                            label={tooltipText}
                            bgColor={social.bg}
                            textColor="text-white"
                        >
                            <li 
                                style={{ backgroundColor: social.bg }}
                                className="rounded-lg p-3 w-60 hover:-translate-y-0.5 hover:scale-105 origin-center transition-all duration-300"
                            >

                                    <Link
                                        href={social.link ?? '#'}
                                        target="_blank"
                                        className="flex flex-col gap-4 font-semibold"
                                    >
                                        <Image 
                                            src={social.icon}
                                            alt={social.text}
                                            width={128}
                                            height={128}
                                            className="size-7 object-contain"
                                        />
                                        <p className="font-semibold text-sm ">{social.text}</p>
                                    </Link>
                            </li>
                            </Tooltip>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export const Contact = WindowWrapper(ContactWindow, "contact")
