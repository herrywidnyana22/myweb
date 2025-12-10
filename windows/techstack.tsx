'use client'

import Image from 'next/image'
import useWindowStore from "@/store/window";

import { WindowControls } from "@/components/windowControls";
import { WindowWrapper } from "@/hoc/windowWrapper";
import { Check, Flag } from "lucide-react";

const TechstackWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.techstack?.data as LocationValue | undefined

    if(!data) return null

    const { name, projectName, icon, techStack } = data
    const dataLength = techStack.length

    return (
        <div className="rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-gray-400">
                <div className="w-24">
                    <WindowControls target={'techstack'} />
                </div>

                <div className="flex items-center gap-1">
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
                    <h2 className="text-center">{name}</h2>
                </div>
                <div className="w-24" />
            </div>

            {/* BODY */}
            <div className="p-5 space-y-4 bg-white">
                <p className="text-gray-600">
                    <span className="text-black font-semibold">{projectName}</span> tech stack
                </p>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-[220px_1fr] text-gray-700 font-semibold pt-3 text-sm">
                    <p className='ml-6'>Category</p>
                    <p className='ml-2'>Technologies</p>
                </div>

                <hr className="border-dashed border-gray-400 my-2" />

                {/* TABLE CONTENT */}
                <div className="space-y-2">
                    {techStack.map((tech: any, i: number) => (
                    <div
                        key={i}
                        className="grid grid-cols-[220px_1fr] items-start gap-2"
                    >
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <Check size={16} />
                            {tech.category}
                        </div>

                        <p className="text-gray-800 text-sm">
                            {tech.items.join(', ')}
                        </p>
                    </div>
                    ))}
                </div>

                <hr className="border-dashed border-gray-400 my-3" />

                {/* FOOTER STATUS */}
                <div className="space-y-2 text-sm mt-4">
                    <p className="flex items-center gap-2 text-green-600">
                        <Check size={16} />
                        {`${dataLength} of ${dataLength} stack loaded successfully (100%)`}
                    </p>

                    <p className="flex items-center gap-2 text-black">
                        <Flag size={14} fill="black" />
                        Render time: 6ms
                    </p>
                </div>
            </div>
        </div>
    );

}

export const TechStack = WindowWrapper(TechstackWindow, "techstack");