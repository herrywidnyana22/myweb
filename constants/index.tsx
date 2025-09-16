import { Profile } from '@/components/profile';
import Image from 'next/image';
import contact from '@/app/data/contact.json';
import { Contact } from '@/components/contact';
import Education from '@/components/education';
import { Projects } from '@/components/projects';

export const dockItems: DockItemProps[] = [
  {
    // grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8
    id: 'profile',
    name: 'Profile',
    children: <Profile />,
    icon: (
      <Image
        src={'/images/profile.jpg'}
        alt='icon'
        height={240}
        width={240}
        className='size-10 sm:size-12 md:size-14 rounded-full object-cover border border-white/30'
      />
    ),
    className: 'col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-4',
  },
  {
    id: 'kontak',
    name: 'Kontak',
    children: <Contact />,
    icon: (
      <div className='size-10 sm:size-12 md:size-14 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20'>
        <div className='grid grid-cols-2 gap-0.5 size-7 sm:size-8 md:size-9'>
          {contact.slice(0, 4).map((item, i) => (
            <div key={i} className='flex items-center justify-center'>
              <Image
                src={item.icon}
                alt={item.type}
                height={80}
                width={80}
                className='size-3 md:size-4 object-contain'
              />
            </div>
          ))}
        </div>
      </div>
    ),
    
    className: 'col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2 overflow-hidden',
  },
  {
    id: 'education',
    name: 'Education',
    children: <Education/>,
    icon: (
      <Image
        src={'/icons/graduation.png'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 object-cover'
      />
    ),
    className: 'col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2 overflow-hidden',
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: (
      <Image
        src={'/icons/experience.png'}
        alt='icon'
        height={128}
        width={128}
        className='size-10 sm:size-12 md:size-14 object-cover'
      />
    ),
    className: 'col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8',
  },
  {
    id: 'project',
    name: 'Project',
    children: <Projects/>,
    icon: (
      <Image
        src={'/icons/document.png'}
        alt='icon'
        height={240}
        width={240}
        className='size-10 sm:size-12 md:size-14 object-cover'
      />
    ),
    className: 'col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8',
  },
 
 
];
