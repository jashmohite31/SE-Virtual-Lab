import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
      <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mb-6 border border-red-100 dark:border-red-900/30">
        <ShieldAlert size={32} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        You do not have the required permissions to view this dashboard page.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} /> Back to Safety
      </Link>
    </div>
  );
};

export default Unauthorized;
