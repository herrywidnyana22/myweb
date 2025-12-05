
import Image from 'next/image';

import { Profile } from '@/components/profile';
import { Contact } from '@/components/contact';
import { Projects } from '@/components/projects';
import { Experiences } from '@/components/experiences';
import { Education } from '@/components/education';


export const dockItems: DockItemProps[] = 
[
  {
    id: 'profile',
    name: 'Profile',
    children: <Profile />,
    icon: (
      <Image
        src={'/images/profile.webp'}
        alt='icon'
        height={240}
        width={240}
        className='size-10 sm:size-12 rounded-full object-cover border border-white/30'
      />
    ),
    className:
      'col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-4 xl:col-span-6',
  },
  {
    id: 'explorer',
    name: 'File Explorer',
    children: <Profile />,
    icon: (
      <Image
        src={'/icons/folder.png'}
        alt='icon'
        height={240}
        width={240}
        className='size-11 object-cover'
      />
    ),
  },
  {
    id: 'contact',
    name: 'Contact',
    children: <Contact />,
    icon: (
      <Image
        src={'/icons/contact.png'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 object-cover'
      />
    ),

    className:
      'col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 overflow-hidden',
  },
  {
    id: 'education',
    name: 'Education',
    children: <Education />,
    icon: (
      <Image
        src={'/icons/graduation.webp'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12  object-cover'
      />
    ),
    className:
      'col-span-1 sm:col-span-4 md:col-span-4 lg:col-span-6 xl:col-span-8 overflow-hidden'
  },
  {
    id: 'experience',
    name: 'Experience',
    children: <Experiences/>,
    icon: (
      <Image
        src={'/icons/experience.webp'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 object-cover'
      />
    ),
    className:
      'col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 xl:col-span-4',
  },
  {
    id: 'project',
    name: 'Project',
    children: <Projects/>,
    icon: (
      <Image
        src={'/icons/project3d.webp'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 object-cover'
      />
    ),
    className:
      'col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 xl:col-span-4',
  },
  {
    id: 'resume',
    name: 'Resume',
    icon: (
      <Image
        src={'/icons/pdf.png'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 object-cover'
      />
    ),
  },
];
