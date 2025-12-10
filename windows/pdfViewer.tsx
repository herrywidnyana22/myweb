'use client'

import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFViewer() {
    return (
        <Document file="/files/resume.pdf" className="rounded-b-lg overflow-hidden shadow-2xl">
            <Page 
                pageNumber={1} 
                renderTextLayer
                renderAnnotationLayer
            />
        </Document>
    );
}
