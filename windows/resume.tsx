'use client'

import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import Link from "next/link";

import { Download } from "lucide-react";
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowControls } from '@/components/windowControls';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const ResumeWindow = () => {
    return ( 
        <>
            <div id="window-header">
                <WindowControls target={'resume'}/>

                <h2>Resume.pdf</h2>

                <Link 
                    href={'/files/resume.pdf'}
                    download
                    title="Download resume"
                    className="cursor-pointer"
                >
                    <Download className="icon"/>
                </Link>
            </div>

            <Document file="/files/resume.pdf">
                <Page 
                    pageNumber={1} 
                    renderTextLayer
                    renderAnnotationLayer
                />
            </Document>
        </>
    );
}

export const Resume = WindowWrapper(ResumeWindow, "resume");