// src/app/components/pdfGenerator.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function generatePDF(studyPlan) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([600, 800]);
  
  // Add fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  // Title
  const titleFontSize = 24;
  page.drawText(studyPlan.title, {
    x: 50,
    y: 750,
    size: titleFontSize,
    font: timesRomanFont,
    color: rgb(0, 0.2, 0.5),
  });
  
  // Subtitle
  const subtitleFontSize = 14;
  page.drawText(`Level: ${studyPlan.level}`, {
    x: 50,
    y: 720,
    size: subtitleFontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  
  // Schedule Section
  let yPosition = 700;
  const lineSpacing = 20;
  const contentFontSize = 12;
  
  page.drawText('Study Schedule:', {
    x: 50,
    y: yPosition,
    size: contentFontSize,
    font: timesRomanFont,
    color: rgb(0, 0.2, 0.5),
  });
  
  yPosition -= lineSpacing;
  
  studyPlan.schedule.forEach((item) => {
    page.drawText(`Day ${item.day}: ${item.activity}`, {
      x: 70,
      y: yPosition,
      size: contentFontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineSpacing;
  });
  
  // Tips Section
  yPosition -= 2 * lineSpacing; // Extra spacing before tips
  page.drawText('Study Tips:', {
    x: 50,
    y: yPosition,
    size: contentFontSize,
    font: timesRomanFont,
    color: rgb(0, 0.2, 0.5),
  });
  
  yPosition -= lineSpacing;
  
  studyPlan.tips.forEach((tip) => {
    page.drawText(`- ${tip}`, {
      x: 70,
      y: yPosition,
      size: contentFontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineSpacing;
  });
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Generate a file path for saving
  const outputPath = path.join(__dirname, 'generatedStudyPlan.pdf');
  
  // Save PDF to file
  fs.writeFileSync(outputPath, pdfBytes);
  
  // Return the file path
  return outputPath;
}