import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    pdfUrl: string;
    pageNumber: number;
}

const PDFViewer:React.FC<PDFViewerProps> = ({ pdfUrl, pageNumber }) => {
  return (
      <Document file={pdfUrl}>
        <Page pageNumber={pageNumber} />
      </Document>
  );
}

export default PDFViewer;