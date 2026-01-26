'use client';

import Image from 'next/image';
import Link from 'next/link';
import useDataStore from '@/store/data';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowHeader } from '@/components/windowHeader';
import { Tooltip } from '@/components/tooltip';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const ContactWindow = () => {
  const { contacts } = useDataStore();
  const { getText, getUIText } = useLocalizedText();

  const contactList = Array.isArray(contacts) ? contacts : [];

  if (contactList.length === 0) return null;

  return (
    <div className='overflow-hidden rounded-xl bg-white shadow-2xl drop-shadow-2xl'>
      <WindowHeader
        target='contact'
        icon='/icons/contact.png'
        title='Contact'
      />

      <div className='flex w-auto flex-col justify-start space-y-5 p-6'>
        <h3 className='text-lg font-semibold text-black'>
          {getUIText('contactTitle')}
        </h3>

        <p className='text-sm leading-relaxed text-gray-600'>
          {getUIText('contactSubtitle')}
        </p>

        <ul className='flex items-center gap-3'>
          {contactList.map((contact, i) => (
            <Tooltip
              key={i}
              label={
                contact.tooltipText
                  ? getText(contact.tooltipText)
                  : contact.title
              }
              bgColor={contact.bgColor || 'bg-primary-light'}
              textColor='text-white'
            >
              <li
                style={{ backgroundColor: contact.bgColor || '#374151' }}
                className='w-32 origin-center rounded-lg p-3 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105'
              >
                <Link
                  href={contact.contactURL ?? '#'}
                  target='_blank'
                  className='flex flex-col gap-4 font-semibold'
                >
                  <Image
                    src={contact.icon || '/icons/contact.png'}
                    alt={contact.title}
                    width={128}
                    height={128}
                    className='size-6 object-contain'
                  />
                  <p className='text-sm font-semibold capitalize'>
                    {contact.title}
                  </p>
                </Link>
              </li>
            </Tooltip>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Contact = WindowWrapper(ContactWindow, 'contact');
