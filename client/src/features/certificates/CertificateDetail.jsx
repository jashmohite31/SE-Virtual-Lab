import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../shared/lib/axiosInstance.js';
import { Button } from '../../shared/components/ui/Button.jsx';
import { Award, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';

export const CertificateDetail = () => {
  const { serial } = useParams();
  const certRef = useRef();

  const { data: certRes, isLoading } = useQuery({
    queryKey: ['certificate-detail', serial],
    queryFn: () => axiosInstance.get(`/api/certificates/${serial}`)
  });

  const certificate = certRes?.data?.data?.certificate;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold">Certificate Not Found</h2>
        <p className="text-slate-500">The certificate serial number is invalid or has expired.</p>
        <Link to="/certificates" className="text-indigo-600 font-semibold hover:underline">
          Back to Certificates
        </Link>
      </div>
    );
  }

  const { metadataSnapshot, issuedAt, serialNumber } = certificate;

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link
          to="/certificates"
          className="inline-flex items-center gap-1.5 text-sm text-slate-650 hover:text-slate-905 font-medium"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <Button onClick={handlePrint} variant="primary" className="flex items-center gap-2">
          <Printer size={16} /> Print / Save PDF
        </Button>
      </div>

      {/* Diplomatic Frame container */}
      <div
        ref={certRef}
        className="w-full bg-white dark:bg-slate-900 border-8 border-double border-indigo-100 dark:border-indigo-950 p-8 sm:p-16 rounded-2xl relative shadow-xl text-center space-y-8 print:shadow-none print:border-indigo-400 print:bg-white print:text-black"
      >
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-indigo-500 rounded-br-lg"></div>

        <div className="flex flex-col items-center gap-2">
          <Award className="text-indigo-600 dark:text-indigo-400" size={54} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mt-2">
            Software Engineering Virtual Laboratory
          </h2>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mt-1 print:text-slate-900">
            Certificate of Completion
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-sm italic text-slate-500">This is proudly presented to</p>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white underline decoration-indigo-500/50 underline-offset-8 decoration-2 print:text-black">
            {metadataSnapshot?.studentName}
          </h3>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed print:text-slate-800">
          for successfully satisfying all academic requirements and executing the simulation exercises for the
          laboratory course:
          <strong className="block text-slate-900 dark:text-slate-100 mt-2 font-bold print:text-black">
            {metadataSnapshot?.experimentTitle}
          </strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 max-w-md mx-auto border-t border-slate-100 dark:border-slate-800 print:border-slate-300">
          <div className="text-left space-y-1 text-xs">
            <span className="text-slate-400 font-medium block">SERIAL NUMBER</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-350">{serialNumber}</span>
          </div>
          <div className="text-right space-y-1 text-xs">
            <span className="text-slate-400 font-medium block">ISSUED ON</span>
            <span className="font-bold text-slate-700 dark:text-slate-350">
              {new Date(issuedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-450 mt-6 pt-4 print:text-slate-500">
          <ShieldCheck className="text-green-500" size={14} /> Secured & Verified Academic Credential
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;
