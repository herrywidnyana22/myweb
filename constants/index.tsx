import { Profile } from '@/components/profile';
import Image from 'next/image';
import contact from '@/app/data/contact.json';
import { Contact } from '@/components/contact';

export const dockItems: DockItemProps[] = [
  {
    id: 'profile',
    name: 'Profile',
    icon: (
      <Image
        src={'/images/profile.jpg'}
        alt='icon'
        height={240}
        width={240}
        className='size-12 rounded-full object-cover border border-white/30'
      />
    ),
    children: <Profile />,
    className: 'col-span-4',
  },
  {
    id: 'kontak',
    name: 'Kontak',
    icon: (
      <div className='size-12 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20'>
        <div className='grid grid-cols-2 gap-0.5 size-8'>
          {contact.slice(0, 4).map((item, i) => (
            <div key={i} className='flex items-center justify-center'>
              <Image
                src={item.icon}
                alt={item.type}
                height={80}
                width={80}
                className='size-3 object-contain'
              />
            </div>
          ))}
        </div>
      </div>
    ),
    children: <Contact />,
    className: 'col-span-2',
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: (
      <div className='size-12 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20'>
        <div className='grid grid-cols-2 gap-0.5 size-8'>
          {contact.slice(0, 4).map((item, i) => (
            <div key={i} className='flex items-center justify-center'>
              <Image
                src={item.icon}
                alt={item.type}
                height={80}
                width={80}
                className='size-3 object-contain'
              />
            </div>
          ))}
        </div>
      </div>
    ),
    className: 'col-span-6',
  },
  {
    id: 'education',
    name: 'Education',
    icon: (
      <Image
        src={'/icons/graduation.png'}
        alt='icon'
        height={240}
        width={240}
        className='size-12 object-cover'
      />
    ),
    className: 'col-span-6',
  },
];
