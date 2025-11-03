'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from '@/components/tooltip';
import { Eye, Github } from 'lucide-react';
import { Icon } from '../icon';
import { getColor } from '@/utils/getColor';

export const ProjectCard = (card: ProjectProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3">
            {card.icon && (
            <Image
                src={card.icon}
                alt={card.title}
                width={40}
                height={40}
                className="object-contain"
            />
            )}
            <h3 className="font-semibold text-lg">{card.title}</h3>
        </div>

        <div className="text-sm text-gray-600 leading-snug">
            <ReactMarkdown>{card.description}</ReactMarkdown>
        </div>

        {typeof card.progressValue === 'number' && (
            <Tooltip label={`Progress: ${card.progressValue}%`}>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                    width: `${Math.min(card.progressValue, 100)}%`,
                    backgroundColor: getColor(card.progressValue),
                }}
                />
            </div>
            </Tooltip>
        )}

        <div className='flex justify-between items-center mt-3'>

            {card.iconCategory && card.iconCategory.length > 0 && (
            <div className="flex gap-2 flex-wrap">
                {card.iconCategory.map((icon:IconCategoryProps, idx:number) => (
                <Icon
                    key={idx}
                    label={icon.label}
                    src={icon.src}
                    className='bg-gray-900/20'
                />
                ))}
            </div>
            )}
            <div className="flex gap-2">
            {card.githubLink && (
                <Icon 
                    label='Source code'
                    href={card.githubLink}
                    IconComponent={Github}
                    className='bg-black'
                />
            )}
            {card.demoLink && (
                <Icon 
                    label='View demo'
                    href={card.demoLink}
                    IconComponent={Eye}
                    className='bg-black/10'
                />
            )}
            
            </div>
        </div>
    </div>
  );
};
