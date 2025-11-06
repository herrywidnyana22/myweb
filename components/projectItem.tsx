import Image from "next/image";
import { Eye, Github } from "lucide-react";
import { ProgressCircle } from "./progressCircle";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Icon } from "./icon";
import { Tooltip } from "./tooltip";

export const ProjectItem = (project: ProjectProps) => {
  return (
        <div className="w-full h-full flex flex-col gap-2 p-6 rounded-2xl text-slate-200 bg-white">
          {/* ICON */}
          <div className="flex items-center">
            <div 
              className="rounded-full size-14 flex items-center justify-center"
            >
              <Image
                src={project.icon}
                alt="icon"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            </div>
            <h3 className={'font-extrabold text-base sm:text-lg uppercase text-orange-500'}>
                <ReactMarkdown>{project.title}</ReactMarkdown>
            </h3>
          </div>
          
          <div
            className=""
          >
            {/* Progress */}
            <div className="float-right ml-3 mb-2">
              <ProgressCircle value={project.progressValue} label="Progress" />
            </div>

            {/* Text */}
            <div className="text-sm font-light text-gray-600 leading-relaxed mt-2">
               <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>

            {/* Tech stack icons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.iconCategory.map((tech, i) => (
                <Tooltip key={i} label={tech.label}>
                  <Icon
                    src={tech.src}
                    size={25}
                    className="rounded-full bg-gray-900/20 p-1 border border-white/20"
                  />
                </Tooltip>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3 justify-end">
              {
                 project.githubLink && typeof project.githubLink === 'string' &&(
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-2xl text-sm hover:bg-gray-800 transition"
                  >
                    <Github size={16} />
                    Source
                  </Link>

                 )
              }
              {
                project.demoLink && typeof project.demoLink === 'string' &&(
                <Link
                  href={project.demoLink}
                  target="_blank"
                  className="flex items-center gap-2 bg-orange-500/90 px-3 py-1.5 rounded-2xl text-sm hover:bg-orange-600 transition"
                >
                  <Eye size={16} />
                  View Demo
                </Link>
                )
              }
            </div>

            
          </div>
        </div>
  );
};