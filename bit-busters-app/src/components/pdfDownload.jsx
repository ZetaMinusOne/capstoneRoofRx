import PDFView from './pdfView'; // Import the exported component
import {Document} from "@react-pdf/renderer";



const generatePDF = async (data) => {
  const doc = await new Promise((resolve) => {
    resolve(<Document><PDFView/></Document>);
  });

  const buffer = await doc.toBuffer(); // Generate PDF buffer

  // Download logic (similar to the previous approach)
  const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfBlob);
  link.download = 'report.pdf';
  link.click();
};

export default generatePDF