'use client'

import useDataStore from '@/store/data';

import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFViewer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number | null>(null);

    const { profiles } = useDataStore();

    const hasProfile = profiles && profiles.length > 0;
    const resumeURL = hasProfile ? profiles[0].cvURL : null;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Initial width
        setWidth(container.clientWidth - 32); // 32px for padding

        // ResizeObserver untuk track perubahan ukuran container
        const resizeObserver = new ResizeObserver(() => {
            if (container) {
                setWidth(container.clientWidth - 32);
            }
        });

        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div 
            ref={containerRef}
            className='h-full overflow-auto bg-white flex justify-center items-start p-4'
        >
            {width && (
                <Document file={resumeURL}>
                    <Page 
                        pageNumber={1}
                        width={width}
                        renderTextLayer
                        renderAnnotationLayer
                    />
                </Document>
            )}
        </div>
    );
}
