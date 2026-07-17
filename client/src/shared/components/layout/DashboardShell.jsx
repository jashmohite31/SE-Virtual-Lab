import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import { X } from 'lucide-react';

export const DashboardShell = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            
            {/* Sidebar drawer content */}
            <div className="relative flex w-64 max-w-xs flex-col bg-white dark:bg-slate-900 h-full shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800 animate-slide-in">
              <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-purple-650 bg-clip-text text-transparent">
                  Navigation
                </span>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  aria-label="Close sidebar menu"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Reuse standard sidebar with onItemClick toggle handler */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar isMobile={true} onItemClick={() => setIsMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-8">
          {/* Constrain width to 6xl for optimal readability and centered alignment on widescreen displays */}
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
