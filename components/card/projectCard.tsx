'use client';

import Image from 'next/image';
import { Eye, Github } from 'lucide-react';
import { Icon } from '../icon';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { BarProgressChart } from '../charts/barProgress';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const ProjectCard = (card: Project) => {
  const { getText } = useLocalizedText();

  return (
    <div className='flex w-full flex-col gap-1.5 p-2 transition-all duration-300 sm:gap-2 sm:p-3'>
      {/* Header: Icon + Title */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {card.icon && (
          <Image
            src={card.icon}
            alt={getText(card.name) || 'Project Icon'}
            width={30}
            height={30}
            className='object-contain sm:h-10 sm:w-10'
          />
        )}
        <h3 className='text-primary text-sm leading-tight font-semibold sm:text-base md:text-lg'>
          {parseHighlight(getText(card.name) || '')}
        </h3>
      </div>

      {/* Description */}
      <div className='mt-1 text-xs leading-snug text-gray-600 sm:text-sm sm:leading-normal'>
        {parseHighlight(getText(card.description) || '')}
      </div>

      {/* Progress Bar */}
      {typeof card.progressValue === 'number' && (
        <BarProgressChart
          label={`Progress: ${card.progressValue}%`}
          value={card.progressValue}
        />
      )}

      {/* Footer: Tech icons + Action buttons */}
      <div className='mt-2 flex items-center justify-between gap-4 sm:mt-3'>
        {/* Tech Stack */}
        {card.techStack && card.techStack.length > 0 && (
          <div className='flex flex-wrap gap-1 sm:gap-1.5'>
            {card.techStack.map((icon: TechStack, idx: number) => (
              <Icon
                key={idx}
                tooltipLabel={icon.label}
                src={icon.techIcon}
                size={18}
                className='rounded-full border border-white/10 bg-gray-900/10 p-0.5 sm:bg-gray-900/20 sm:p-1'
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-1 sm:gap-1.5'>
          {card.repoURL && typeof card.repoURL === 'string' && (
            <Icon
              tooltipLabel='Source code'
              href={card.repoURL}
              IconComponent={Github}
              size={18}
              className='rounded-full bg-black p-1 transition hover:bg-gray-800 sm:p-1.5'
            />
          )}
          {card.demoURL && typeof card.demoURL === 'string' && (
            <Icon
              tooltipLabel='View demo'
              href={card.demoURL}
              IconComponent={Eye}
              size={18}
              className='bg-primary hover:bg-primary-light rounded-full p-1 transition sm:p-1.5'
            />
          )}
        </div>
      </div>
    </div>
  );
};
