'use client';

import Image from 'next/image';
import { Eye, Github } from 'lucide-react';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { ProgressCircle } from '../charts/circleProgress';
import { Icon } from '../icon';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ProjectItem = (project: Project) => {
  const { getText, getUIText } = useLocalizedText();

  return (
    <div className='flex h-full w-full flex-col gap-2 rounded-xl bg-white p-3 text-slate-800 transition-all duration-300 sm:rounded-2xl sm:p-5 lg:p-6'>
      {/* ICON + TITLE */}
      <div className='flex items-center gap-2 sm:gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12'>
          <Image
            src={project.icon as string}
            alt='icon'
            width={40}
            height={40}
            className='size-8 object-contain sm:size-10'
          />
        </div>
        <h3 className='text-primary text-sm leading-snug font-extrabold uppercase sm:text-base sm:leading-tight lg:text-lg'>
          {parseHighlight(getText(project.name) || '')}
        </h3>
      </div>

      {/* CONTENT */}
      <div className='w-full'>
        {/* Progress Circle */}
        <div className='absolute top-2 right-6 sm:float-right sm:ml-3'>
          <ProgressCircle
            value={project.progressValue}
            label={getUIText('progress')}
          />
        </div>

        {/* Description */}
        <div className='text-xs leading-relaxed font-light text-gray-600 sm:text-sm'>
          {parseHighlight(getText(project.description) || '')}
        </div>

        <div className='flex items-center justify-between'>
          {/* Tech stack icons */}
          <div className='mt-4 flex flex-wrap gap-1.5 sm:gap-2'>
            {project.techStack &&
              project.techStack.map((tech: TechStack, i: number) => (
                <Icon
                  key={i}
                  tooltipLabel={tech.label}
                  src={tech.techIcon}
                  size={14}
                  className='rounded-full border border-white/20 bg-gray-900/10 p-0.5 sm:bg-gray-900/20 sm:p-1'
                />
              ))}
          </div>
          {/* Buttons */}
          <div className='mt-4 flex flex-wrap justify-end gap-2 sm:mt-5'>
            {project.repoURL && typeof project.repoURL === 'string' && (
              <Icon
                tooltipLabel={getUIText('viewCode')}
                textLabel={getUIText('source')}
                href={project.repoURL}
                IconComponent={Github}
                size={14}
                className='rounded-full bg-black px-2.5 py-1.5 transition hover:bg-gray-800'
              />
            )}

            {project.demoURL && typeof project.demoURL === 'string' && (
              <Icon
                tooltipLabel={getUIText('viewDemo')}
                textLabel={getUIText('preview')}
                href={project.demoURL}
                IconComponent={Eye}
                size={14}
                className='bg-primary hover:bg-primary-hover rounded-full px-2.5 py-1.5 transition'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
