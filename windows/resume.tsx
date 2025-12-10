'use client'

import dynamic from 'next/dynamic';
import Link from "next/link";
import { Download } from "lucide-react";
import { WindowControls } from "@/components/windowControls";
import { WindowWrapper } from '@/hoc/windowWrapper';

const PDFViewer = dynamic(() => import('@/windows/pdfViewer'), { ssr: false });

const ResumeWindow = () => {
    return ( 
        <div className='shadow-2xl drop-shadow-2xl overflow-hidden rounded-xl'>
            <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400'>
                <WindowControls target={'resume'}/>

                <h2>Resume.pdf</h2>

                <Link 
                    href={'/files/resume.pdf'}
                    download
                    title="Download resume"
                    className="cursor-pointer"
                >
                    <Download className="p-1 hover:bg-gray-200 rounded hover:cursor-default"/>
                </Link>
            </div>

            <PDFViewer/>
        </div>
    );
}

export const Resume = WindowWrapper(ResumeWindow, "resume");