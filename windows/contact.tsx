'use client'

import Image from "next/image";
import Link from "next/link";
import useWindowStore from "@/store/window";

import { WindowWrapper } from "@/hoc/windowWrapper";
import { WindowControls } from "@/components/windowControls";
import { contacts } from "@/lib/constants";
import { Tooltip } from "@/components/tooltip";

const ContactWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.contact?.data as LocationValue | undefined

    if(!data) return null

    const {icon, name} = data

    return ( 
        <div className="rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden bg-white">
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

            <div className="flex flex-col justify-start p-6 space-y-5 w-auto">

                <Image
                    src={'/images/profile.webp'}
                    alt="Herry"
                    width={128}
                    height={128}
                    className="size-24 rounded-full object-cover"
                />

                <h3 className="text-lg font-semibold text-black">
                    Let&apos;s Connect
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                    Got an idea? A bug to squash? or just want to talk tech? I&apos;m in.
                </p>

                <ul className="flex items-center gap-3">
                    {contacts.map((contact, i) => (
                        <Tooltip 
                            key={i} 
                            label={contact.tooltipText}
                            bgColor={contact.bg}
                            textColor="text-white"
                        >
                            <li 
                                style={{ backgroundColor: contact.bg }}
                                className="rounded-lg p-3 w-32 hover:-translate-y-0.5 hover:scale-105 origin-center transition-all duration-300"
                            >

                                <Link
                                    href={contact.href ?? '#'}
                                    target="_blank"
                                    className="flex flex-col gap-4 font-semibold"
                                >
                                    <Image 
                                        src={contact.icon}
                                        alt={contact.title}
                                        width={128}
                                        height={128}
                                        className="size-6 object-contain"
                                    />
                                    <p className="font-semibold text-sm capitalize">{contact.title}</p>
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
