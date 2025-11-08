'use client';

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { MapPin } from "lucide-react";

export const ExperienceCard = (exp: ExperienceProps) => {
  return (
    <div
      className="
        flex w-full h-full rounded-xl sm:rounded-2xl 
        overflow-hidden shadow-md bg-white
        transition-all duration-300
      "
    >
      {/* Left Icon Area */}
      <div
        className="
          flex items-center justify-center 
          w-8 sm:w-12 md:w-14 
          bg-linear-to-br from-green-600 to-success
          shrink-0
        "
      >
        {exp.icon && typeof exp.icon === "string" && (
          <Image
            src={exp.icon}
            alt={exp.company}
            width={20}
            height={20}
            className="object-contain opacity-90 sm:w-6 sm:h-6"
          />
        )}
      </div>

      {/*Right Content Section */}
      <div
        className="
          w-full flex flex-col 
          p-3 sm:p-5 md:p-6 
          gap-1 sm:gap-2
        "
      >
        {/* Header: Company + Year */}
        <div className="flex justify-between items-center">
          <h3
            className="
              font-extrabold 
              text-sm sm:text-base md:text-lg 
              uppercase text-primary
              leading-tight
            "
          >
            <ReactMarkdown>{exp.company}</ReactMarkdown>
          </h3>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
            {exp.year}
          </span>
        </div>

        {/* Job Title + Description */}
        <div className="flex flex-col gap-1 sm:gap-1.5 mt-1">
          <h4 className="text-gray-600 font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
            <ReactMarkdown>{exp.role}</ReactMarkdown>
          </h4>

          <span className="text-gray-500 text-xs sm:text-sm leading-snug">
            <ReactMarkdown>{exp.description}</ReactMarkdown>
          </span>

          {/* Location */}
          <div className="flex gap-1 sm:gap-1.5 text-gray-500 mt-2 items-center">
            <MapPin size={12} className="rotate-10 sm:size-4" />
            <span className="text-[10px] sm:text-xs italic truncate">
              <ReactMarkdown>{exp.location}</ReactMarkdown>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
