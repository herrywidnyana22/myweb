'use client';

import Image from "next/image";
import { Eye, Github } from "lucide-react";
import { parseHighlight } from "@/lib/utils/parseHighlight";
import { ProgressCircle } from "../charts/circleProgress";
import { Icon } from "../icon";
import { useLocalizedText } from "@/hooks/useLocalizedText";

export const ProjectItem = (project: Project) => {
  const { getText, getUIText } = useLocalizedText();

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
            src={project.icon as string}
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
          {parseHighlight(getText(project.name) || '')}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="w-full">
        {/* Progress Circle */}
        <div className="absolute right-6 top-2 sm:float-right sm:ml-3">
          <ProgressCircle value={project.progressValue} label="Progress" />
        </div>

        {/* Description */}
        <div className="text-xs sm:text-sm font-light text-gray-600 leading-relaxed">
          {parseHighlight(getText(project.description) || '')}
        </div>

        <div className="flex items-center justify-between">
        {/* Tech stack icons */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {project.techStack && project.techStack.map((tech: TechStack, i: number) => (
                <Icon
                  key={i}
                  tooltipLabel={tech.label}
                  src={tech.techIcon}
                  size={14}
                  className="rounded-full bg-gray-900/10 sm:bg-gray-900/20 p-0.5 sm:p-1 border border-white/20"
                />
            ))}
            
          </div>
          {/* Buttons */}
          <div className="mt-4 sm:mt-5 flex gap-2 justify-end flex-wrap">
            {project.repoURL && typeof project.repoURL === "string" && (
              <Icon
                tooltipLabel={getUIText('viewCode')}
                textLabel={getUIText('source')}
                href={project.repoURL}
                IconComponent={Github}
                size={14}
                className="
                  px-2.5 py-1.5
                  bg-black
                  rounded-full 
                  hover:bg-gray-800 transition
                "
              />
              )}

            {project.demoURL && typeof project.demoURL === "string" && (
              <Icon
                tooltipLabel={getUIText('viewDemo')}
                textLabel={getUIText('preview')}
                href={project.demoURL}
                IconComponent={Eye}
                size={14}
                className="
                  px-2.5 py-1.5
                  bg-primary
                  rounded-full 
                  hover:bg-primary-hover transition
                "
              />
            )}
          </div>
          
        </div>

        
      </div>
    </div>
  );
};
