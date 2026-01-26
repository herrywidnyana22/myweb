'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import useDataStore from '@/store/data';

import { Download } from 'lucide-react';
import { WindowHeader } from '@/components/windowHeader';
import { WindowWrapper } from '@/hoc/windowWrapper';

const PDFViewer = dynamic(() => import('@/windows/pdfViewer'), { ssr: false });

const ResumeWindow = () => {
  const { profiles } = useDataStore();

  const hasProfile = profiles && profiles.length > 0;
  const resumeURL = hasProfile ? profiles[0].cvURL : null;

  return (
    <div className='flex h-[70vh] w-[90vw] flex-col overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[30vw]'>
      <WindowHeader
        target='resume'
        title='Resume.pdf'
        rightContent={
          resumeURL && (
            <Link
              href={resumeURL}
              download
              title='Download resume'
              className='cursor-pointer'
            >
              <Download className='rounded p-1 hover:cursor-default hover:bg-gray-200' />
            </Link>
          )
        }
      />

      <div className='flex-1'>
        <PDFViewer />
      </div>
    </div>
  );
};

export const Resume = WindowWrapper(ResumeWindow, 'resume');
