'use client';

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { MapPin } from "lucide-react";

export const ExperienceCard = (exp: ExperienceProps) => {
    
    return ( 
        <div
            className="flex w-full h-full rounded-2xl overflow-hidden shadow-md bg-white"
        >
            <div
                className={`flex items-center justify-center w-8 sm:w-12 bg-linier-to-br bg-green-600`}
            >
                {exp.icon && typeof exp.icon === 'string' && (
                    <Image
                        src={exp.icon}
                        alt={exp.company}
                        width={24}
                        height={24}
                        className="object-contain opacity-90"
                    />

                )}
            </div>

            {/* Right content section */}
            <div className="w-full flex flex-col p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-center">
                    <h3 className={'font-extrabold text-base sm:text-lg uppercase text-orange-500'}>
                        <ReactMarkdown>{exp.company}</ReactMarkdown>
                    </h3>
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                        {exp.year}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="text-gray-600 font-semibold mb-4">
                        <ReactMarkdown>{exp.role}</ReactMarkdown>
                    </h4>
                    <span className="text-gray-400 text-sm">
                        <ReactMarkdown>{exp.description}</ReactMarkdown>
                    </span>
                    <div className="flex gap-1 text-gray-500 mt-2">
                        <MapPin size={16} className="rotate-10"/>
                        <span className="text-xs  italic">
                            <ReactMarkdown>{exp.location}</ReactMarkdown>
                        </span>
                    </div>


                </div>

            </div>
        </div>
        
    )
}