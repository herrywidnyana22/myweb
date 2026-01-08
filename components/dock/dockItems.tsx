
import Image from 'next/image';

import { Profile } from '@/components/widget/profile';
import { Contact } from '@/components/widget/contact';
import { Projects } from '@/components/widget/projects';
import { Education } from '../widget/education';
import { Experiences } from '../widget/experiences';

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
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 rounded-2xl object-cover border border-white/30'
      />
    ),
    className:
      'col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-4 xl:col-span-6',
  },
  {
    id: 'myContact',
    name: 'Contact',
    children: <Contact />,
    icon: (
      <Image
        src={'/icons/contact.png'}
        alt='icon'
        height={128}
        width={128}
        className='size-13 sm:size-15 md:size-17 object-cover'
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
        src={'/icons/education.svg'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 object-cover'
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
        src={'/icons/experience.svg'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 object-cover'
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
        src={'/icons/project.svg'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 object-cover'
      />
    ),
    className:
      'col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 xl:col-span-4',
  },
];
