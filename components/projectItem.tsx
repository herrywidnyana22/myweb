'use client';

import Image from "next/image";
import { Eye, Github } from "lucide-react";
import { ProgressCircle } from "./progressCircle";
import Link from "next/link";
import { Icon } from "./icon";
import { Tooltip } from "./tooltip";
import { parseHighlight } from "@/utils/parseHighlight";

export const ProjectItem = (project: ProjectProps) => {
  return (
    <div
      className="
        w-full h-full flex flex-col gap-2 
        p-3 sm:p-5 lg:p-6 
        rounded-xl sm:rounded-2xl 
        text-slate-800 bg-white
        transition-all duration-300
      "
    >
      {/* ICON + TITLE */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="rounded-full size-10 sm:size-12 flex items-center justify-center shrink-0">
          <Image
            src={project.icon}
            alt="icon"
            width={40}
            height={40}
            className="size-8 sm:size-10 object-contain"
          />
        </div>
        <h3
          className="
            font-extrabold 
            text-sm sm:text-base lg:text-lg 
            uppercase text-primary 
            leading-snug sm:leading-tight
          "
        >
          {parseHighlight(project.title || '')}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="w-full">
        {/* Progress Circle */}
        <div className="absolute right-6 top-4 sm:float-right sm:ml-3 sm:mb-2">
          <ProgressCircle value={project.progressValue} label="Progress" />
        </div>

        {/* Description */}
        <div className="text-xs sm:text-sm font-light text-gray-600 leading-relaxed mt-6 sm:mt-4">
          {parseHighlight(project.description || '')}
        </div>

        <div className="flex items-center justify-between">
          {/* Tech stack icons */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {project.iconCategory.map((tech, i) => (
              <Tooltip key={i} label={tech.label}>
                <Icon
                  src={tech.src}
                  size={20}
                  className="rounded-full bg-gray-900/10 sm:bg-gray-900/20 p-0.5 sm:p-1 border border-white/20"
                />
              </Tooltip>
            ))}
            
          </div>
          {/* Buttons */}
          <div className="mt-4 sm:mt-5 flex gap-2 justify-end flex-wrap">
            {project.githubLink && typeof project.githubLink === "string" && (
              <Tooltip label="View Source">
                <Link
                  href={project.githubLink}
                  target="_blank"
                  className="
                    flex items-center gap-1.5 
                    bg-black 
                    px-2.5 py-1.5 
                    rounded-2xl 
                    text-xs font-medium 
                    text-white hover:bg-gray-800 
                    transition-all duration-200 
                    sm:text-xs sm:px-3 sm:py-1.5 
                    lg:text-sm lg:px-3 lg:py-1.5 
                    whitespace-nowrap
                  "
                >
                  <Github size={14} className="shrink-0" />
                  <p className="xl:hidden">Source</p>
                </Link>

              </Tooltip>
            )}

            {project.demoLink && typeof project.demoLink === "string" && (
              <Tooltip label="Preview">
                <Link
                  href={project.demoLink}
                  target="_blank"
                  className="
                    flex items-center gap-1.5 
                    bg-primary/90
                    px-2.5 py-1.5 
                    rounded-2xl 
                    text-xs font-medium 
                    text-white hover:bg-primary-hover
                    transition-all duration-200 
                    sm:text-xs sm:px-3 sm:py-1.5 
                    lg:text-sm lg:px-3 lg:py-1.5 
                    whitespace-nowrap
                  "
                >
                  <Eye size={14} className="shrink-0" />
                  <p className="xl:hidden">Preview</p>
                </Link>

              </Tooltip>
            )}
          </div>
          
        </div>

        
      </div>
    </div>
  );
};
