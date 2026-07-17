import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '../../shared/lib/axiosInstance.js';
import { Card, CardBody } from '../../shared/components/ui/Card.jsx';
import { Award, ChevronRight, Download } from 'lucide-react';

export const Certificates = () => {
  const { data: certRes, isLoading } = useQuery({
    queryKey: ['student-certificates'],
    queryFn: () => axiosInstance.get('/api/certificates')
  });

  const certificates = certRes?.data?.data?.certificates || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earned Credentials</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and download certificates issued for successful laboratory completions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert._id} className="hover:shadow-md transition-shadow relative overflow-hidden group">
            <CardBody className="p-6 space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    {cert.metadataSnapshot?.experimentTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Serial: {cert.serialNumber}</p>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between mt-auto">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Issued {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/certificates/${cert.serialNumber}`}
                  className="inline-flex items-center gap-1 text-xs text-indigo-650 hover:text-indigo-750 font-bold hover:underline"
                >
                  View Certificate <ChevronRight size={14} />
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl bg-white dark:bg-slate-900/20 max-w-xl mx-auto space-y-3">
            <Award className="mx-auto text-slate-350" size={48} />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No certificates earned yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Complete any active laboratory and score at least 60% in the assessment quiz to unlock official credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
