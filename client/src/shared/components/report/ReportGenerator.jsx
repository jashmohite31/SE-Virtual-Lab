import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ReportGenerator = ({ experimentTitle, studentName, studentEmail, activityData }) => {
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef();

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${experimentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-lab-report.pdf`);
    } catch (error) {
      console.error('Failed to generate report PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={handleDownload} variant="primary" disabled={generating} className="flex items-center gap-2">
        <Download size={16} /> {generating ? 'Generating PDF...' : 'Download Lab Report'}
      </Button>

      {/* Hidden container rendering target report layout */}
      <div className="hidden" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={reportRef}
          className="p-12 bg-white text-black font-sans w-[800px] flex flex-col gap-8 leading-relaxed"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h2 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Academic Lab Record</h2>
            <h1 className="text-2xl font-bold mt-1 uppercase">Laboratory Report</h1>
            <p className="text-xs text-slate-500 mt-0.5">Software Engineering Virtual Laboratory</p>
          </div>

          {/* Student metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">COURSE TITLE</span>
              <span className="font-bold text-slate-800">{experimentTitle}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">STUDENT NAME</span>
              <span className="font-bold text-slate-800">{studentName} ({studentEmail})</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">DATE EXECUTED</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">STATUS</span>
              <span className="font-bold text-green-700">COMPLETED & VERIFIED</span>
            </div>
          </div>

          {/* Activity Data Block */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-300 pb-1.5 uppercase">Activity Output Data</h3>
            <div className="p-4 bg-slate-50 border rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700">
              {typeof activityData === 'object' ? JSON.stringify(activityData, null, 2) : activityData}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400">
            This document is generated automatically by the Software Engineering Virtual Laboratory.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
