import { jsPDF } from 'jspdf';
import type { QRConfig } from './types';
import { exportPNG } from './qr-engine';

export async function exportPDF(config: QRConfig, filename = 'qr-code.pdf') {
  // Generate high quality composite image
  const dataUrl = await exportPNG(config, 1600);

  // Determine aspect ratio from composite canvas
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = dataUrl;
  });

  const aspect = img.height / img.width;

  // Create standard A4 document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Page background: Soft clean aesthetic
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(23, 32, 51);
  doc.text('QR Studio Print Card', pageWidth / 2, 35, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString()} • Ready to print & display`, pageWidth / 2, 43, {
    align: 'center',
  });

  // Calculate image box
  const targetWidth = 110;
  const targetHeight = targetWidth * aspect;
  const x = (pageWidth - targetWidth) / 2;
  const y = 60;

  // Card shadow / border
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.8);
  doc.roundedRect(x - 5, y - 5, targetWidth + 10, targetHeight + 10, 5, 5, 'S');

  // Add QR Code Image
  doc.addImage(dataUrl, 'PNG', x, y, targetWidth, targetHeight);

  // Footer note
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Powered by QR Studio • High Resolution Vector Render', pageWidth / 2, pageHeight - 20, {
    align: 'center',
  });

  doc.save(filename);
}
