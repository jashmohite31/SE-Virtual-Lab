import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, ShieldCheck, Cpu, Code2, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50">
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          SE Virtual Lab
        </span>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg transition-colors">
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6">
          <Cpu size={14} /> Interactive Simulation Sandbox
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Master Software Engineering <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Through Sandbox Testing</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
          An interactive laboratory hosting 12 software engineering experiments. Model architectures, schedule timelines, simulate version control, and compute complexity metrics on-the-fly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/10 transition-all hover:scale-[1.02]"
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 font-semibold border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 mb-4">
              <Beaker size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">12 Interactive Labs</h3>
            <p className="text-sm text-slate-500">Practice process modeling, SRS formulation, Gantt scheduling, COCOMO II calculations, and Git simulations.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-500 mb-4">
              <Code2 size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Code Control Graphs</h3>
            <p className="text-sm text-slate-500">Calculate cyclomatic complexity and write target execution paths to achieve full coverage inside testing blocks.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="h-10 w-10 rounded-lg bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center text-pink-500 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Certified Progress</h3>
            <p className="text-sm text-slate-500">Unlock official laboratory certificates upon scoring 60% or higher in the assessment quizes.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-900">
        &copy; {new Date().getFullYear()} Software Engineering Virtual Lab. Built for interactive CS education.
      </footer>
    </div>
  );
};

export default LandingPage;
