'use client';

import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Task {
  title: string;
  timeSpent?: number;
  priority?: string;
}

interface Challenge {
  description: string;
  solution?: string;
}

interface IReport {
  _id: string;
  weekStartDate: Date | string;
  weekEndDate: Date | string;
  tasksCompleted: Task[];
  workInProgress: Task[];
  challenges: Challenge[];
  improvements?: string;
  nextWeekPlan?: string;
  summary?: string;
  status: 'draft' | 'submitted';
  submittedAt?: Date | string;
  createdAt: Date | string;
}

interface PDFExportProps {
  report: IReport;
}

export default function PDFExport({ report }: PDFExportProps) {
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      
      const primaryColor: [number, number, number] = [147, 51, 234];
      const secondaryColor: [number, number, number] = [236, 72, 153];
      
      let yPosition = 20;

      // HEADER
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Weekly Work Report', 20, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${formatDate(report.weekStartDate)} - ${formatDate(report.weekEndDate)}`, 20, 30);
      
      const statusText = report.status === 'submitted' ? 'SUBMITTED' : 'DRAFT';
      const statusColor: [number, number, number] = report.status === 'submitted' ? [16, 185, 129] : [245, 158, 11];
      doc.setFillColor(...statusColor);
      doc.roundedRect(150, 22, 40, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText, 170, 29, { align: 'center' });

      yPosition = 50;

      // SUMMARY
      if (report.summary) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SUMMARY', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(report.summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += (summaryLines.length * 5) + 10;
      }

      // TASKS COMPLETED
      if (report.tasksCompleted?.length > 0) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('TASKS COMPLETED', 20, yPosition);
        yPosition += 8;

        const tasksData = report.tasksCompleted.map((task, i) => [
          `${i + 1}`,
          task.title || '-',
          task.timeSpent ? `${task.timeSpent}h` : '-',
          task.priority || 'Medium',
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Task', 'Time', 'Priority']],
          body: tasksData,
          theme: 'striped',
          headStyles: { 
            fillColor: primaryColor,
            fontSize: 10,
            fontStyle: 'bold',
          },
          styles: { 
            fontSize: 9,
            cellPadding: 4,
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 100 },
            2: { cellWidth: 20 },
            3: { cellWidth: 30 },
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 12;
      }

      // WORK IN PROGRESS
      if (report.workInProgress?.length > 0) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...secondaryColor);
        doc.text('WORK IN PROGRESS', 20, yPosition);
        yPosition += 8;

        const wipData = report.workInProgress.map((task, i) => [
          `${i + 1}`,
          task.title || '-',
          task.timeSpent ? `${task.timeSpent}h` : '-',
          task.priority || 'Medium',
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Task', 'Time', 'Priority']],
          body: wipData,
          theme: 'striped',
          headStyles: { 
            fillColor: secondaryColor,
            fontSize: 10,
            fontStyle: 'bold',
          },
          styles: { 
            fontSize: 9,
            cellPadding: 4,
          },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 100 },
            2: { cellWidth: 20 },
            3: { cellWidth: 30 },
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 12;
      }

      // CHALLENGES
      if (report.challenges?.length > 0) {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68);
        doc.text('CHALLENGES FACED', 20, yPosition);
        yPosition += 10;

        report.challenges.forEach((challenge, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${index + 1}. Challenge:`, 20, yPosition);
          yPosition += 6;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          const descLines = doc.splitTextToSize(challenge.description, 170);
          doc.text(descLines, 25, yPosition);
          yPosition += (descLines.length * 5) + 4;

          if (challenge.solution) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('   Solution:', 20, yPosition);
            yPosition += 6;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            const solLines = doc.splitTextToSize(challenge.solution, 170);
            doc.text(solLines, 25, yPosition);
            yPosition += (solLines.length * 5) + 8;
          } else {
            yPosition += 8;
          }
        });
      }

      // IMPROVEMENTS
      if (report.improvements) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('IMPROVEMENTS & LEARNINGS', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const improvLines = doc.splitTextToSize(report.improvements, 170);
        doc.text(improvLines, 20, yPosition);
        yPosition += (improvLines.length * 5) + 10;
      }

      // NEXT WEEK PLAN
      if (report.nextWeekPlan) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...secondaryColor);
        doc.text('NEXT WEEK PLAN', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const planLines = doc.splitTextToSize(report.nextWeekPlan, 170);
        doc.text(planLines, 20, yPosition);
      }

      // FOOTER
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      const fileName = `MyWeekly_Report_${formatDate(report.weekStartDate).replace(/[, ]/g, '_')}.pdf`;
      doc.save(fileName);
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToWord = () => {
    try {
      let content = `MYWEEKLY - WEEKLY WORK REPORT\n\n`;
      content += `Week: ${formatDate(report.weekStartDate)} - ${formatDate(report.weekEndDate)}\n`;
      content += `Status: ${report.status?.toUpperCase() || 'DRAFT'}\n`;
      content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      content += `${'='.repeat(60)}\n\n`;

      if (report.summary) {
        content += `SUMMARY\n\n${report.summary}\n\n${'='.repeat(60)}\n\n`;
      }

      if (report.tasksCompleted?.length > 0) {
        content += `TASKS COMPLETED\n\n`;
        report.tasksCompleted.forEach((task, i) => {
          content += `${i + 1}. ${task.title}\n`;
          if (task.timeSpent) content += `   Time: ${task.timeSpent} hours\n`;
          if (task.priority) content += `   Priority: ${task.priority}\n`;
          content += `\n`;
        });
        content += `${'='.repeat(60)}\n\n`;
      }

      if (report.workInProgress?.length > 0) {
        content += `WORK IN PROGRESS\n\n`;
        report.workInProgress.forEach((task, i) => {
          content += `${i + 1}. ${task.title}\n`;
          if (task.timeSpent) content += `   Time: ${task.timeSpent} hours\n`;
          if (task.priority) content += `   Priority: ${task.priority}\n`;
          content += `\n`;
        });
        content += `${'='.repeat(60)}\n\n`;
      }

      if (report.challenges?.length > 0) {
        content += `CHALLENGES FACED\n\n`;
        report.challenges.forEach((challenge, i) => {
          content += `${i + 1}. CHALLENGE:\n   ${challenge.description}\n\n`;
          if (challenge.solution) {
            content += `   SOLUTION:\n   ${challenge.solution}\n\n`;
          }
        });
        content += `${'='.repeat(60)}\n\n`;
      }

      if (report.improvements) {
        content += `IMPROVEMENTS & LEARNINGS\n\n${report.improvements}\n\n${'='.repeat(60)}\n\n`;
      }

      if (report.nextWeekPlan) {
        content += `NEXT WEEK PLAN\n\n${report.nextWeekPlan}\n\n${'='.repeat(60)}\n`;
      }

      const blob = new Blob([content], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MyWeekly_Report_${formatDate(report.weekStartDate).replace(/[, ]/g, '_')}.doc`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Word document exported successfully!');
    } catch (err) {
      console.error('Word export error:', err);
      toast.error('Failed to export Word document');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={exportToPDF}
        disabled={loading}
        type="button"
        className="btn btn-primary flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span className="hidden sm:inline">Generating...</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </>
        )}
      </button>

      <button
        onClick={exportToWord}
        type="button"
        className="btn btn-secondary flex items-center gap-2"
      >
        <FileText size={18} />
        <span className="hidden sm:inline">Export Word</span>
        <span className="sm:hidden">Word</span>
      </button>
    </div>
  );
}