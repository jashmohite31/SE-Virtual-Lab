import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../shared/lib/axiosInstance.js';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { Button } from '../../shared/components/ui/Button.jsx';
import { DashboardShell } from '../../shared/components/layout/DashboardShell.jsx';
import { Card, CardBody } from '../../shared/components/ui/Card.jsx';
import { Badge } from '../../shared/components/ui/Badge.jsx';
import { QuizEngine } from '../../shared/components/quiz/QuizEngine.jsx';
import { ReportGenerator } from '../../shared/components/report/ReportGenerator.jsx';
import { SQA_EXPERIMENT_DATA } from './white-box-testing/sqaData.js';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Laptop,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Award,
  Sparkles,
  Target,
  Layers,
  FlaskConical,
  BarChart3
} from 'lucide-react';

// Import all activity pages
import ProcessModelsActivity from './process-models/ProcessModelsActivity.jsx';
import SrsGeneratorActivity from './srs-generator/SrsGeneratorActivity.jsx';
import SrsExperimentView from './srs-generator/SrsExperimentView.jsx';
import ProjectSchedulingActivity from './project-scheduling/ProjectSchedulingActivity.jsx';
import CostEstimationActivity from './cost-estimation/CostEstimationActivity.jsx';
import UmlLabActivity from './uml-lab/UmlLabActivity.jsx';
import DfdLabActivity from './dfd-lab/DfdLabActivity.jsx';
import ActivityStateLabActivity from './activity-state-lab/ActivityStateLabActivity.jsx';
import RiskManagementActivity from './risk-management/RiskManagementActivity.jsx';
import ScmGitSimulatorActivity from './scm-git-simulator/ScmGitSimulatorActivity.jsx';
import WhiteBoxTestingActivity from './white-box-testing/WhiteBoxTestingActivity.jsx';
import PrototypeUatActivity from './prototype-uat/PrototypeUatActivity.jsx';
import AgileBoardActivity from './agile-board/AgileBoardActivity.jsx';

const ACTIVITIES = {
  'process-models': ProcessModelsActivity,
  'srs-generator': SrsGeneratorActivity,
  'project-scheduling': ProjectSchedulingActivity,
  'cost-estimation': CostEstimationActivity,
  'uml-lab': UmlLabActivity,
  'dfd-lab': DfdLabActivity,
  'activity-state-lab': ActivityStateLabActivity,
  'risk-management': RiskManagementActivity,
  'scm-git-simulator': ScmGitSimulatorActivity,
  'white-box-testing': WhiteBoxTestingActivity,
  'prototype-uat': PrototypeUatActivity,
  'agile-board': AgileBoardActivity
};

export const ExperimentLayout = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isSrsModule = slug === 'srs-generator';
  const [activeTab, setActiveTab] = useState(isSrsModule ? 'aim' : 'objective');
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        setPopup({
          title: 'Screenshot Restricted',
          message: 'To protect intellectual property, taking screenshots is restricted on this platform.'
        });
      }
      if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 's')) {
        e.preventDefault();
        setPopup({
          title: 'Export Restricted',
          message: 'Saving or printing page contents is disabled.'
        });
      }
    };

    const handleBlur = () => {
      document.body.classList.add('blur-md');
    };

    const handleFocus = () => {
      document.body.classList.remove('blur-md');
    };

    window.addEventListener('keyup', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.body.classList.remove('blur-md');
    };
  }, []);

  // Fetch Experiment Static Content
  const { data: expRes, isLoading: expLoading } = useQuery({
    queryKey: ['experiment-detail', slug],
    queryFn: () => axiosInstance.get(`/api/experiments/${slug}`)
  });

  // Fetch User Submission State
  const { data: subRes, isLoading: subLoading } = useQuery({
    queryKey: ['submission', slug],
    queryFn: () => axiosInstance.get(`/api/experiments/${slug}/submission`)
  });

  // Fetch Experiment Progress (with fallback to localStorage)
  const { data: progRes, refetch: refetchProgress } = useQuery({
    queryKey: ['experiment-progress', slug],
    queryFn: async () => {
      const cacheKey = `vlab_prog_${user?._id || user?.id || 'guest'}_${slug}`;
      try {
        const res = await axiosInstance.get(`/api/progress/${slug}`);
        const serverProg = res.data?.data?.progress;
        if (serverProg) {
          localStorage.setItem(cacheKey, JSON.stringify(serverProg));
        }
        return res;
      } catch (err) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return { data: { data: { progress: JSON.parse(cached) } } };
        }
        throw err;
      }
    },
    enabled: !!user && !!slug
  });

  const progress = progRes?.data?.data?.progress;

  // Mutation to update experiment progress
  const updateProgressMutation = useMutation({
    mutationFn: async (payload) => {
      const cacheKey = `vlab_prog_${user?._id || user?.id || 'guest'}_${slug}`;
      try {
        const res = await axiosInstance.post(`/api/progress/${slug}`, payload);
        return res.data;
      } catch (err) {
        // Optimistic local update
        const current = progress || {
          visitedTabs: [],
          srsDownloaded: false,
          activityCompleted: false,
          quizCompleted: false,
          progressPercentage: 0
        };
        const updatedTabs =
          payload.visitedTab && !current.visitedTabs.includes(payload.visitedTab)
            ? [...current.visitedTabs, payload.visitedTab]
            : current.visitedTabs;
        const updatedDownloaded =
          payload.srsDownloaded !== undefined ? payload.srsDownloaded : current.srsDownloaded;
        const updatedQuiz =
          payload.quizCompleted !== undefined ? payload.quizCompleted : current.quizCompleted;

        let pct = 0;
        if (slug === 'srs-generator') {
          const THEORY = ['aim', 'introduction', 'objective', 'theory', 'case-study'];
          const vCount = THEORY.filter((t) => updatedTabs.includes(t)).length;
          let m = vCount;
          if (updatedDownloaded) m += 1;
          if (updatedQuiz) m += 1;
          pct = Math.min(100, Math.round((m / 7) * 100));
        } else {
          const BASE = ['objective', 'theory', 'procedure'];
          const vCount = BASE.filter((t) => updatedTabs.includes(t)).length;
          let m = vCount;
          if (current.activityCompleted) m += 1;
          if (updatedQuiz) m += 1;
          pct = Math.min(100, Math.round((m / 5) * 100));
        }

        const offlineProg = {
          ...current,
          visitedTabs: updatedTabs,
          srsDownloaded: updatedDownloaded,
          quizCompleted: updatedQuiz,
          progressPercentage: pct
        };
        localStorage.setItem(cacheKey, JSON.stringify(offlineProg));
        return { status: 'success', data: { progress: offlineProg } };
      }
    },
    onSuccess: (data) => {
      if (data?.data?.progress) {
        queryClient.setQueryData(['experiment-progress', slug], data);
        const cacheKey = `vlab_prog_${user?._id || user?.id || 'guest'}_${slug}`;
        localStorage.setItem(cacheKey, JSON.stringify(data.data.progress));
      }
      queryClient.invalidateQueries(['student-progress']);
      queryClient.invalidateQueries(['student-analytics']);
    }
  });

  // Track visiting active tab
  useEffect(() => {
    if (user && activeTab && slug) {
      if (!progress?.visitedTabs || !progress.visitedTabs.includes(activeTab)) {
        updateProgressMutation.mutate({ visitedTab: activeTab });
      }
    }
  }, [activeTab, slug, user, progress?.visitedTabs]);

  // Handler: SRS Downloaded
  const handleSrsDownloaded = () => {
    updateProgressMutation.mutate({ srsDownloaded: true });
    setPopup({
      title: 'SRS Document Downloaded! 🎉',
      message:
        'Official IEEE Std 830-1998 specification has been exported and your activity milestone is recorded! Complete the practice quiz to achieve 100% completion.'
    });
  };

  // Handler: Quiz Complete
  const handleQuizComplete = (quizResult) => {
    updateProgressMutation.mutate({
      quizCompleted: true,
      maxQuizScore: quizResult.score
    });
    refetchProgress();
  };

  // Mutation to save/submit activity work
  const saveSubmission = useMutation({
    mutationFn: ({ data, status }) =>
      axiosInstance.post(`/api/experiments/${slug}/submission`, { data, status }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['submission', slug]);
      queryClient.invalidateQueries(['student-progress']);
      queryClient.invalidateQueries(['experiment-progress', slug]);
      if (variables.status === 'submitted') {
        setPopup({
          title: 'Simulation Complete',
          message: 'Simulation activity completed and logged successfully! Moving to the Practice Quiz checkpoint.',
          action: () => setActiveTab('quiz')
        });
      } else {
        setPopup({
          title: 'Progress Saved',
          message: 'Your laboratory work draft has been saved successfully.'
        });
      }
    }
  });

  const experiment = expRes?.data?.data?.experiment;
  const submission = subRes?.data?.data?.submission;
  const ActivityComponent = ACTIVITIES[slug];

  const srsTabs = [
    { id: 'aim', label: 'Aim', icon: <BookOpen size={14} /> },
    { id: 'introduction', label: 'Introduction', icon: <FileText size={14} /> },
    { id: 'objective', label: 'Objective', icon: <CheckCircle2 size={14} /> },
    { id: 'theory', label: 'Theory', icon: <FileText size={14} /> },
    { id: 'srs-generator', label: 'SRS Generator', icon: <Laptop size={14} /> },
    { id: 'case-study', label: 'Case Study', icon: <FileText size={14} /> },
    { id: 'quiz', label: 'Practice Quiz', icon: <HelpCircle size={14} /> }
  ];

  const baseTabs = [
    { id: 'objective', label: 'Objective', icon: <BookOpen size={14} /> },
    { id: 'theory', label: 'Theory', icon: <FileText size={14} /> },
    { id: 'procedure', label: 'Procedure', icon: <HelpCircle size={14} /> }
  ];

  const defaultTabs =
    user?.role === 'visitor'
      ? baseTabs
      : [
          ...baseTabs,
          { id: 'activity', label: 'Simulation Activity', icon: <Laptop size={14} /> },
          { id: 'quiz', label: 'Practice Quiz', icon: <HelpCircle size={14} /> },
          { id: 'report', label: 'Lab Report', icon: <FileText size={14} /> }
        ];

  const tabs = isSrsModule ? srsTabs : defaultTabs;

  // Theory subsections count for SRS
  const SRS_THEORY_TABS = ['aim', 'introduction', 'objective', 'theory', 'case-study'];
  const srsTheoryCount = progress?.visitedTabs
    ? SRS_THEORY_TABS.filter((t) => progress.visitedTabs.includes(t)).length
    : 0;

  // Completion check per tab
  const isTabCompleted = (tabId) => {
    if (!progress) return false;
    if (isSrsModule) {
      if (SRS_THEORY_TABS.includes(tabId)) {
        return Boolean(progress.visitedTabs?.includes(tabId));
      }
      if (tabId === 'srs-generator') {
        return Boolean(progress.srsDownloaded);
      }
      if (tabId === 'quiz') {
        return Boolean(progress.quizCompleted);
      }
      return false;
    }
    if (['objective', 'theory', 'procedure'].includes(tabId)) {
      return Boolean(progress.visitedTabs?.includes(tabId));
    }
    if (tabId === 'activity') {
      return Boolean(progress.activityCompleted);
    }
    if (tabId === 'quiz') {
      return Boolean(progress.quizCompleted);
    }
    return false;
  };

  const handleSaveActivity = async (data, status = 'in-progress') => {
    await saveSubmission.mutateAsync({ data, status });
  };

  if (expLoading || subLoading) {
    return (
      <DashboardShell>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </DashboardShell>
    );
  }

  if (!experiment) {
    return (
      <DashboardShell>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold">Experiment not found</h2>
          <p className="text-slate-500 mt-2">The requested laboratory module slug could not be resolved.</p>
          <Link to="/experiments" className="text-indigo-650 font-semibold hover:underline block mt-4">
            Back to Experiments
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <DashboardShell>
      <div className="space-y-6 text-left">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          <ArrowLeft size={14} /> Back to Laboratories
        </Link>

        {/* Header with Title and Overall Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200 font-serif">
              {experiment.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Estimated duration: {experiment.estimatedDuration} minutes</p>
          </div>
          <div className="flex items-center gap-2">
            {submission?.status === 'submitted' && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 size={12} /> Activity Logged
              </Badge>
            )}
            {progressPercentage === 100 && (
              <Badge variant="success" className="flex items-center gap-1 font-bold">
                <Sparkles size={12} /> 100% Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Visual Progress Bar & Milestone Status Widget */}
        <div className="bg-slate-50/90 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Module Completion
              </span>
              <Badge
                variant={progressPercentage === 100 ? 'success' : 'warning'}
                className="text-[11px] font-semibold flex items-center gap-1"
              >
                {progressPercentage === 100 ? (
                  <>
                    <CheckCircle2 size={12} /> 100% Completed • Lab Finished
                  </>
                ) : (
                  <>
                    <Clock size={12} /> {progressPercentage}% Progress
                  </>
                )}
              </Badge>
            </div>

            {/* SRS Milestone Breakdown Pills */}
            {isSrsModule ? (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition-all ${
                    srsTheoryCount === 5
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                  title="Aim, Introduction, Objective, Theory, Case Study (visited once is enough)"
                >
                  {srsTheoryCount === 5 ? <CheckCircle2 size={12} /> : <BookOpen size={12} />}
                  {srsTheoryCount}/5 Theory Subsections Visited
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition-all ${
                    progress?.srsDownloaded
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                  title="Document must be downloaded from the SRS Generator to complete this milestone"
                >
                  {progress?.srsDownloaded ? <CheckCircle2 size={12} /> : <Download size={12} />}
                  {progress?.srsDownloaded ? 'SRS Downloaded' : 'Download Required (SRS)'}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium transition-all ${
                    progress?.quizCompleted
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                  title="Complete the practice assessment checkpoint"
                >
                  {progress?.quizCompleted ? <CheckCircle2 size={12} /> : <HelpCircle size={12} />}
                  {progress?.quizCompleted
                    ? `Quiz Completed (${progress?.maxQuizScore || 0}%)`
                    : 'Quiz Pending'}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${
                    progress?.activityCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 size={12} /> Activity {progress?.activityCompleted ? 'Done' : 'Pending'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${
                    progress?.quizCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 size={12} /> Quiz {progress?.quizCompleted ? 'Passed' : 'Pending'}
                </span>
              </div>
            )}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressPercentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>

        {/* Tab Steppers */}
        <div className="flex border-b overflow-x-auto gap-2 scrollbar-none">
          {tabs.map((tab) => {
            const completed = isTabCompleted(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {completed && (
                  <span className="flex items-center text-emerald-500 ml-0.5" title="Section Completed">
                    <CheckCircle2 size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {isSrsModule ? (
            <SrsExperimentView
              activeTab={activeTab}
              submission={submission}
              onSave={handleSaveActivity}
              slug={slug}
              progress={progress}
              onSrsDownloaded={handleSrsDownloaded}
              onQuizComplete={handleQuizComplete}
            />
          ) : (
            <>
              {activeTab === 'objective' && (
                slug === 'white-box-testing' ? (
                  <div className="space-y-4">
                    {/* Aim Banner */}
                    <Card>
                      <CardBody className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                            <Target size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">Aim of the Experiment</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{SQA_EXPERIMENT_DATA.aim.content}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Introduction */}
                    <Card>
                      <CardBody className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={15} className="text-indigo-500" />
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Introduction</h3>
                        </div>
                        <div className="space-y-3">
                          {SQA_EXPERIMENT_DATA.introduction.content.split('\n\n').map((para, i) => (
                            <p key={i} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{para}</p>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Learning Objectives */}
                    <Card>
                      <CardBody className="p-6">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 size={15} className="text-emerald-500" />
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.objective.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">{SQA_EXPERIMENT_DATA.objective.subtitle}</p>
                        <ol className="space-y-2">
                          {SQA_EXPERIMENT_DATA.objective.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pt}</span>
                            </li>
                          ))}
                        </ol>
                      </CardBody>
                    </Card>

                    {/* Key Concepts at a glance */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { icon: <Layers size={18} />, label: 'Control Flow Graph', desc: 'Directed graph representing all possible execution paths through program source code.' },
                        { icon: <BarChart3 size={18} />, label: 'Cyclomatic Complexity', desc: 'Quantitative measure of program logic complexity introduced by McCabe (1976).' },
                        { icon: <FlaskConical size={18} />, label: 'Basis Path Testing', desc: 'Technique using V(G) to identify the minimum set of independent test paths for 100% coverage.' }
                      ].map((c, i) => (
                        <Card key={i}>
                          <CardBody className="p-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 mb-3">{c.icon}</div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">{c.label}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardBody className="p-6 space-y-4">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Laboratory Objective</h3>
                      <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.objective}</p>
                    </CardBody>
                  </Card>
                )
              )}

              {activeTab === 'theory' && (
                slug === 'white-box-testing' ? (
                  <div className="space-y-4">
                    {/* White-Box Testing */}
                    <Card>
                      <CardBody className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <FileText size={15} className="text-indigo-500" />
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.whiteBoxHeading}</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{SQA_EXPERIMENT_DATA.theory.whiteBoxIntro}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {SQA_EXPERIMENT_DATA.theory.whiteBoxPoints.map((pt) => (
                            <div key={pt.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                              <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{pt.name}</h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{pt.text}</p>
                              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Example</p>
                                <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-relaxed">{pt.example}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* CFG */}
                    <Card>
                      <CardBody className="p-6 space-y-3">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.cfgHeading}</h3>
                        <p className="text-xs text-slate-500">{SQA_EXPERIMENT_DATA.theory.cfgIntro}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {SQA_EXPERIMENT_DATA.theory.cfgPoints.map((pt) => (
                            <div key={pt.label} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                              <span className="text-[10px] font-extrabold text-indigo-500 uppercase block mb-0.5">{pt.label}</span>
                              <span className="text-[11px] text-slate-600 dark:text-slate-300">{pt.detail}</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">{SQA_EXPERIMENT_DATA.theory.cfgTip}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CFG Construction Rules</p>
                          {SQA_EXPERIMENT_DATA.theory.cfgConstruction.map((rule, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="text-[11px] text-slate-600 dark:text-slate-300">{rule}</span>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Cyclomatic Complexity */}
                    <Card>
                      <CardBody className="p-6 space-y-4">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.complexityHeading}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{SQA_EXPERIMENT_DATA.theory.complexityIntro}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {SQA_EXPERIMENT_DATA.theory.formulas.map((f) => (
                            <div key={f.name} className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{f.name}</p>
                              <p className="font-mono text-lg font-extrabold text-indigo-700 dark:text-indigo-300">{f.formula}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{f.description}</p>
                              <div className="p-2 rounded-lg bg-white dark:bg-slate-900/40 border border-indigo-100 dark:border-indigo-900/30">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">Worked Example</p>
                                <p className="text-[10px] font-mono text-slate-600 dark:text-slate-300">{f.example}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Risk Scale */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Complexity Risk Scale</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SQA_EXPERIMENT_DATA.theory.complexityScale.map((s) => (
                              <div key={s.risk} className="p-3 rounded-xl border text-center" style={{ borderColor: s.color === 'emerald' ? '#6ee7b7' : s.color === 'amber' ? '#fcd34d' : s.color === 'orange' ? '#fdba74' : '#fca5a5', background: s.color === 'emerald' ? '#f0fdf4' : s.color === 'amber' ? '#fffbeb' : s.color === 'orange' ? '#fff7ed' : '#fef2f2' }}>
                                <span className="text-[9px] font-bold block" style={{ color: s.color === 'emerald' ? '#059669' : s.color === 'amber' ? '#d97706' : s.color === 'orange' ? '#ea580c' : '#dc2626' }}>{s.range}</span>
                                <span className="text-[10px] font-extrabold block mt-0.5" style={{ color: s.color === 'emerald' ? '#047857' : s.color === 'amber' ? '#b45309' : s.color === 'orange' ? '#c2410c' : '#b91c1c' }}>{s.risk}</span>
                                <span className="text-[9px] text-slate-500 mt-1 block leading-tight">{s.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Basis Path Testing */}
                    <Card>
                      <CardBody className="p-6 space-y-3">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.basisPathHeading}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{SQA_EXPERIMENT_DATA.theory.basisPathIntro}</p>
                        <ol className="space-y-2">
                          {SQA_EXPERIMENT_DATA.theory.basisPathSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 text-[10px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="text-xs text-slate-600 dark:text-slate-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardBody>
                    </Card>

                    {/* WB vs BB Comparison Table */}
                    <Card>
                      <CardBody className="p-6 space-y-3">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.comparisonTable.heading}</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-indigo-50 dark:bg-indigo-950/40">
                                {SQA_EXPERIMENT_DATA.theory.comparisonTable.columns.map((col, i) => (
                                  <th key={i} className={`px-4 py-3 text-left font-bold uppercase tracking-widest text-xs ${i === 0 ? 'text-slate-500 w-40' : i === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {SQA_EXPERIMENT_DATA.theory.comparisonTable.rows.map((row, ri) => (
                                <tr key={ri} className={`border-t border-slate-100 dark:border-slate-800 ${ri % 2 === 0 ? 'bg-white dark:bg-slate-900/40' : 'bg-slate-50/60 dark:bg-slate-900/20'}`}>
                                  <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">{row[0]}</td>
                                  <td className="px-4 py-2.5 text-indigo-700 dark:text-indigo-300">{row[1]}</td>
                                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row[2]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>

                    {/* SQA in SDLC */}
                    <Card>
                      <CardBody className="p-6 space-y-4">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.theory.sqaProcessHeading}</h3>
                        <div className="flex flex-col gap-0">
                          {SQA_EXPERIMENT_DATA.theory.sqaProcessSteps.map((step, i) => {
                            const iconMap = { requirements: '📝', design: '🏗️', coding: '💻', testing: '🧪', maintenance: '🔧' };
                            return (
                              <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-base shrink-0">{iconMap[step.icon] || '•'}</div>
                                  {i < SQA_EXPERIMENT_DATA.theory.sqaProcessSteps.length - 1 && <div className="w-0.5 flex-1 bg-indigo-100 dark:bg-indigo-900/40 my-1" />}
                                </div>
                                <div className="pb-5">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{step.phase}</span>
                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{step.activity}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardBody className="p-6 space-y-4">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250 font-serif">Theoretical Concepts</h3>
                      <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.theory}</p>
                    </CardBody>
                  </Card>
                )
              )}

              {activeTab === 'procedure' && (
                slug === 'white-box-testing' ? (
                  <div className="space-y-4">
                    <Card>
                      <CardBody className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <HelpCircle size={15} className="text-indigo-500" />
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{SQA_EXPERIMENT_DATA.procedure.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400">Follow these steps in order to complete the SQA experiment successfully:</p>
                        <ol className="space-y-3">
                          {SQA_EXPERIMENT_DATA.procedure.steps.map((step, i) => (
                            <li key={i} className={`flex items-start gap-4 p-3 rounded-xl border transition-colors ${
                              i < 2 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' :
                              i < 6 ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30' :
                              i < 9 ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' :
                              'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
                            }`}>
                              <span className={`mt-0.5 w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                                i < 2 ? 'bg-emerald-500 text-white' :
                                i < 6 ? 'bg-indigo-500 text-white' :
                                i < 9 ? 'bg-amber-500 text-white' :
                                'bg-slate-400 text-white'
                              }`}>{i + 1}</span>
                              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardBody>
                    </Card>

                    {/* Quick Reference */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { color: 'emerald', label: 'Setup', steps: 'Steps 1–2', desc: 'Choose preset & read the code carefully' },
                        { color: 'indigo', label: 'Analysis', steps: 'Steps 3–6', desc: 'Build CFG, count metrics, derive paths' },
                        { color: 'amber', label: 'Verification', steps: 'Steps 7–9', desc: 'Run/animate paths, use calculator, achieve 100%' }
                      ].map((phase) => (
                        <Card key={phase.label}>
                          <CardBody className="p-4">
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest block mb-1 ${
                              phase.color === 'emerald' ? 'text-emerald-600' : phase.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600'
                            }`}>{phase.label} — {phase.steps}</span>
                            <p className="text-[11px] text-slate-500">{phase.desc}</p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardBody className="p-6 space-y-4">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Lab Instructions & Guidelines</h3>
                      <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.procedure}</p>
                    </CardBody>
                  </Card>
                )
              )}

              {activeTab === 'activity' && ActivityComponent && (
                <ActivityComponent submission={submission} onSave={handleSaveActivity} />
              )}

              {activeTab === 'quiz' && (
                <Card>
                  <CardBody className="p-6">
                    <QuizEngine experimentSlug={slug} onComplete={handleQuizComplete} />
                  </CardBody>
                </Card>
              )}

              {activeTab === 'report' && (
                <div className="space-y-4">
                  <Card>
                    <CardBody className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                          <FileText size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">SQA Laboratory Report</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Your CFG analysis, complexity metrics, and path coverage results — compiled as a downloadable PDF lab sheet.</p>
                        </div>
                      </div>

                      {submission?.status === 'submitted' ? (
                        <div className="space-y-5">
                          {/* Report Preview */}
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {/* Preview Header */}
                            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest">Report Preview</span>
                              <Badge variant="success" className="text-[10px]">Submitted</Badge>
                            </div>

                            <div className="p-5 bg-white dark:bg-slate-900/40 space-y-5">
                              {/* Student Info */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                {[
                                  { label: 'Experiment', value: experiment.title },
                                  { label: 'Student', value: user?.name },
                                  { label: 'Email', value: user?.email },
                                  { label: 'Date', value: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
                                ].map((m) => (
                                  <div key={m.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">{m.label}</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{m.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* CFG Metrics */}
                              {submission.data && (
                                <>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">CFG Metrics — {submission.data.presetLabel}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                      {[
                                        { label: 'Nodes (N)', value: submission.data.nodes },
                                        { label: 'Edges (E)', value: submission.data.edges },
                                        { label: 'Predicates (P)', value: submission.data.predicateNodes },
                                        { label: 'Regions', value: submission.data.complexity - 1 },
                                        { label: 'V(G) = CC', value: submission.data.complexity, hi: true }
                                      ].map((m) => (
                                        <div key={m.label} className={`p-3 rounded-xl border text-center ${m.hi ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'}`}>
                                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">{m.label}</span>
                                          <span className={`text-xl font-extrabold ${m.hi ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{m.value ?? '—'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Formula Verification */}
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Formula Verification</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                      {[
                                        { name: 'V(G) = E – N + 2P', result: (submission.data.edges - submission.data.nodes + 2) },
                                        { name: 'V(G) = P + 1', result: (submission.data.predicateNodes + 1) },
                                        { name: 'V(G) = R + 1', result: submission.data.complexity }
                                      ].map((f) => (
                                        <div key={f.name} className="flex items-center justify-between p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{f.name}</span>
                                          <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-lg">= {f.result}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Basis Paths */}
                                  {submission.data.log?.length > 0 && (
                                    <div>
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Basis Paths Exercised ({submission.data.log.length} / {submission.data.complexity})</p>
                                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/60">
                                              <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase text-[9px] tracking-widest">Path</th>
                                              <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase text-[9px] tracking-widest">Traversal</th>
                                              <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase text-[9px] tracking-widest">Description</th>
                                              <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase text-[9px] tracking-widest">Expected Output</th>
                                              <th className="px-3 py-2 text-center font-bold text-slate-500 uppercase text-[9px] tracking-widest">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {submission.data.log.map((entry, i) => (
                                              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                                                <td className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{entry.pathId}</td>
                                                <td className="px-3 py-2 font-mono text-[10px] text-slate-600 dark:text-slate-300">{entry.pathLabel}</td>
                                                <td className="px-3 py-2 text-[11px] text-slate-500">{entry.description}</td>
                                                <td className="px-3 py-2 font-mono text-emerald-600 font-semibold">{String(entry.expected)}</td>
                                                <td className="px-3 py-2 text-center">
                                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                    <CheckCircle2 size={12} /> Covered
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {/* Coverage & Risk */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Path Coverage</p>
                                      <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">100%</p>
                                      <p className="text-[11px] text-emerald-600 mt-0.5">All {submission.data.complexity} basis paths exercised</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Risk Assessment</p>
                                      <p className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">{submission.data.complexity <= 10 ? 'Low Risk' : submission.data.complexity <= 20 ? 'Moderate Risk' : 'High Risk'}</p>
                                      <p className="text-[11px] text-indigo-600 mt-0.5">V(G) = {submission.data.complexity}</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <ReportGenerator
                            experimentTitle={experiment.title}
                            studentName={user?.name}
                            studentEmail={user?.email}
                            activityData={submission.data}
                          />
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-2">
                          <FileText size={32} className="text-slate-300 dark:text-slate-600 mx-auto" />
                          <p className="text-sm font-semibold text-slate-500">Report Not Yet Available</p>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">Complete and submit the Simulation Activity first to unlock the full lab report with CFG metrics, basis paths, and coverage analysis.</p>
                          <Button variant="secondary" className="mt-2 text-xs" onClick={() => setActiveTab('activity')}>
                            Go to Simulation Activity
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setPopup(null)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{popup.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{popup.message}</p>
            <Button
              onClick={() => {
                if (popup.action) popup.action();
                setPopup(null);
              }}
              variant="primary"
              className="w-full text-xs font-semibold"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default ExperimentLayout;
