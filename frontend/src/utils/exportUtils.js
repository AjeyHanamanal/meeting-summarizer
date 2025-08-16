import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Export summary as PDF
export const exportToPDF = (summary, filename = 'meeting-summary') => {
  try {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Summary', 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Summary content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const splitText = doc.splitTextToSize(summary, 170);
    doc.text(splitText, 20, 60);
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
};

// Export summary as Word document
export const exportToWord = async (summary, filename = 'meeting-summary') => {
  try {
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Meeting Summary',
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated on: ${new Date().toLocaleDateString()}`,
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: {
                after: 400,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: summary,
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
    
    return true;
  } catch (error) {
    console.error('Word export error:', error);
    throw new Error('Failed to export Word document');
  }
};

// Export with custom formatting
export const exportToPDFFormatted = (data, filename = 'meeting-summary') => {
  try {
    const { summary, prompt, style, processingTime } = data;
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Summary', 20, 30);
    
    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Style: ${style || 'Custom'}`, 20, 55);
    if (processingTime) {
      doc.text(`Processing time: ${processingTime}ms`, 20, 65);
    }
    
    // Prompt (if provided)
    if (prompt) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Prompt:', 20, 80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const promptText = doc.splitTextToSize(prompt, 170);
      doc.text(promptText, 20, 90);
    }
    
    // Summary content
    const startY = prompt ? 110 : 80;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary:', 20, startY);
    doc.setFont('helvetica', 'normal');
    
    const splitText = doc.splitTextToSize(summary, 170);
    doc.text(splitText, 20, startY + 10);
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
};

// Export to Word with custom formatting
export const exportToWordFormatted = async (data, filename = 'meeting-summary') => {
  try {
    const { summary, prompt, style, processingTime } = data;
    
    const children = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Meeting Summary',
            bold: true,
            size: 32,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on: ${new Date().toLocaleDateString()}`,
            size: 20,
            color: '666666',
          }),
        ],
        spacing: { after: 200 },
      }),
    ];
    
    // Add metadata
    if (style) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Style: ${style}`,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    
    if (processingTime) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Processing time: ${processingTime}ms`,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    
    // Add prompt if provided
    if (prompt) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Prompt:',
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: prompt,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }
    
    // Add summary
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Summary:',
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: summary,
            size: 24,
          }),
        ],
      })
    );
    
    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
    
    return true;
  } catch (error) {
    console.error('Word export error:', error);
    throw new Error('Failed to export Word document');
  }
};
