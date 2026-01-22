'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import useDataStore from '@/store/data';

import { Download } from 'lucide-react';
import { WindowControls } from '@/components/windowControls';
import { WindowWrapper } from '@/hoc/windowWrapper';

const PDFViewer = dynamic(() => import('@/windows/pdfViewer'), { ssr: false });

const ResumeWindow = () => {
  const { profiles } = useDataStore();

  const hasProfile = profiles && profiles.length > 0;
  const resumeURL = hasProfile ? profiles[0].cvURL : null;

  return (
    <div className='flex h-[70vh] w-[90vw] flex-col overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[30vw]'>
      <div className='window-header flex cursor-grab items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400 select-none active:cursor-grabbing md:px-4 md:py-3 md:text-sm'>
        <WindowControls target={'resume'} />

        <h2 className='text-sm md:text-base'>Resume.pdf</h2>
        {resumeURL && (
          <Link
            href={resumeURL}
            download
            title='Download resume'
            className='cursor-pointer'
          >
            <Download className='rounded p-1 hover:cursor-default hover:bg-gray-200' />
          </Link>
        )}
      </div>

      <div className='flex-1'>
        <PDFViewer />
      </div>
    </div>
  );
};

export const Resume = WindowWrapper(ResumeWindow, 'resume');
