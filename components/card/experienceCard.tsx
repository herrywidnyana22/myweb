'use client';

import Image from "next/image";
import { MapPin } from "lucide-react";
import { parseHighlight } from "@/lib/utils/parseHighlight";

export const ExperienceCard = (exp: ExperienceProps) => {
  return (
    <div
      className="
        flex w-full h-full rounded-xl sm:rounded-3xl 
        overflow-hidden shadow-md bg-white
        transition-all duration-300
      "
    >
      {/* Left Area */}
      <div
        className="
          flex items-center justify-center 
          w-3
          bg-linear-to-br from-primary to-primary-hover
          shrink-0
        "
      />

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
          <div className="flex items-center justify-center gap-3">
            {exp.icon && typeof exp.icon === "string" && (
              <Image
                src={exp.icon}
                alt={exp.company}
                width={24}
                height={24}
                className="object-contain opacity-90 sm:w-6 sm:h-6"
              />
            )}
            <div className="flex flex-col justify-center"> 
              <h3
                className="
                  font-extrabold 
                  text-sm sm:text-base md:text-lg 
                  uppercase text-primary
                  leading-tight
                "
              >
                {parseHighlight(exp.company || '')}
              </h3>
              <p className="text-gray-500 font-semibold text-xs sm:text-sm">
                {parseHighlight(exp.role || '')}
              </p>
            </div>

          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
            {exp.year}
          </span>
        </div>

        {/* Job Title + Description */}
        <div className="flex flex-col gap-1 sm:gap-1.5 mt-1">
          

          <span className="text-gray-500 text-xs sm:text-sm leading-snug">
            {parseHighlight(exp.description || '')}
          </span>

          {/* Location */}
          <div className="flex gap-1 sm:gap-1.5 text-gray-500 mt-2 items-center">
            <MapPin size={12} className="rotate-10 sm:size-4" />
            <span className="text-[10px] sm:text-xs italic truncate">
              {parseHighlight(exp.location || '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
