import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
      <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 mb-6 border border-slate-200 dark:border-slate-800">
        <HelpCircle size={32} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
