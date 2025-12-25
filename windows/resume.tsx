'use client'

import dynamic from 'next/dynamic';
import Link from "next/link";
import { Download } from "lucide-react";
import { WindowControls } from "@/components/windowControls";
import { WindowWrapper } from '@/hoc/windowWrapper';

const PDFViewer = dynamic(() => import('@/windows/pdfViewer'), { ssr: false });

const ResumeWindow = () => {
    return ( 
        <div className='h-[70vh] w-[90vw] md:w-[70vw] md:h-[60vh] lg:w-[60vw] xl:w-[50vw] shadow-2xl drop-shadow-2xl overflow-hidden rounded-xl flex flex-col'>
            <div className='window-header flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-gray-50 border-b border-gray-200 select-none text-xs md:text-sm text-gray-400 cursor-grab active:cursor-grabbing'>
                <WindowControls target={'resume'}/>

                <h2 className='text-sm md:text-base'>Resume.pdf</h2>

                <Link 
                    href={'/files/resume.pdf'}
                    download
                    title="Download resume"
                    className="cursor-pointer"
                >
                    <Download className="p-1 hover:bg-gray-200 rounded hover:cursor-default"/>
                </Link>
            </div>

            <div className='flex-1'>
                <PDFViewer/>
            </div>
        </div>
    );
}

export const Resume = WindowWrapper(ResumeWindow, "resume");