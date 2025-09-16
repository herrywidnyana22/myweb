import data from "@/app/data/projects.json"; // put the JSON above in /data/projects.json
import Image from "next/image";
import { Eye, Github } from "lucide-react";
import { ProgressCircle } from "./progressCircle";
import Link from "next/link";
import { Tooltip } from "./tooltip";

export const Projects = () => {
  return (
    <div className="grid gap-y-12 gap-x-6 md:grid-cols-2 mt-5">
      {data.map((project: ProjectProps, i: number) => (
        <div key={i} className="relative">
          {/* ICON */}
          <div className="absolute -top-8 left-[10%] flex items-center">

            <div 
              className="rounded-full bg-gray-900/80 size-14 flex items-center justify-center p-3 backdrop-blur-2xl border border-white/20 shadow-2xl z-20">
              
              <Image
                src={project.icon}
                alt="icon"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            </div>
            <span className="px-4 py-1 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-2xl bg-gray-900/80  text-sm">{project.title}</span>
          </div>
          
          <div
            className="bg-white/20 p-6 rounded-2xl text-slate-200"
          >
            {/* Progress */}
            <div className="float-right ml-3 mb-2">
              <ProgressCircle value={project.progressValue} label="Progress" />
            </div>

            {/* Text */}
            <p className="text-sm font-light leading-relaxed mt-2">
              {project.description}
            </p>

            {/* Tech stack icons */}
            <div className="mt-2 flex flex-wrap gap-2">
              {project.iconCategory.map((tech, i) => (
                <Tooltip label={tech.label} key={i}>
                  <Image
                    src={tech.src}
                    alt="tech-icon"
                    width={25}
                    height={25}
                    className="rounded-full bg-gray-900/90 p-1 border border-white/20"
                  />
                </Tooltip>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3 justify-end">
              <Link
                href={project.githubLink}
                target="_blank"
                className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-2xl text-sm hover:bg-gray-800 transition"
              >
                <Github size={16} />
                Source
              </Link>
              {
                project.demoLink && (
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
      ))}
    </div>
  );
};
