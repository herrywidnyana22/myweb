'use client';

import Image from 'next/image';
import { Tooltip } from '@/components/tooltip';
import { Eye, Github } from 'lucide-react';
import { Icon } from '../icon';
import { getColor } from '@/lib/utils';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { BarProgressChart } from '../charts/barProgress';

export const ProjectCard = (card: ProjectProps) => {
  return (
    <div
      className="
        flex flex-col gap-1.5 sm:gap-2 
        w-full p-2 sm:p-3
        transition-all duration-300
      "
    >
      {/* Header: Icon + Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {card.icon && (
          <Image
            src={card.icon}
            alt={card.title}
            width={30}
            height={30}
            className="object-contain sm:w-10 sm:h-10"
          />
        )}
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-primary leading-tight">
          {parseHighlight(card.title || '')}
        </h3>
      </div>

      {/* Description */}
      <div className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-normal mt-1">
        {parseHighlight(card.description || '')}
      </div>

      {/* Progress Bar */}
      {typeof card.progressValue === 'number' && (
        <BarProgressChart 
          label={`Progress: ${card.progressValue}%`} 
          value={card.progressValue}
        />
      )}

      {/* Footer: Tech icons + Action buttons */}
      <div
        className="
          flex justify-between items-center 
          mt-2 sm:mt-3
          gap-4
        "
      >
        {/* Tech Stack */}
        {card.iconCategory && card.iconCategory.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {card.iconCategory.map((icon: IconCategoryProps, idx: number) => (
              <Icon
                key={idx}
                tooltipLabel={icon.label}
                src={icon.src}
                size={18}
                className="
                  bg-gray-900/10 sm:bg-gray-900/20 
                  p-0.5 sm:p-1 
                  rounded-full 
                  border border-white/10
                "
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-1.5">
          {card.githubLink && typeof card.githubLink === 'string' && (
            <Icon
              tooltipLabel="Source code"
              href={card.githubLink}
              IconComponent={Github}
              size={18}
              className="
                bg-black
                p-1 sm:p-1.5 
                rounded-full 
                hover:bg-gray-800 transition
              "
            />
          )}
          {card.demoLink && typeof card.demoLink === 'string' && (
            <Icon
              tooltipLabel="View demo"
              href={card.demoLink}
              IconComponent={Eye}
              size={18}
              className="
                bg-primary
                p-1 sm:p-1.5 
                rounded-full 
                hover:bg-primary-light transition
              "
            />
          )}
        </div>
      </div>
    </div>
  );
};
