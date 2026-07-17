import React, { useState, useEffect } from 'react';
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
import { BookOpen, FileText, HelpCircle, Laptop, ArrowLeft, CheckCircle2 } from 'lucide-react';

// Import all activity pages
import ProcessModelsActivity from './process-models/ProcessModelsActivity.jsx';
import SrsGeneratorActivity from './srs-generator/SrsGeneratorActivity.jsx';
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
  const [activeTab, setActiveTab] = useState('objective');
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

  // Mutation to save/submit activity work
  const saveSubmission = useMutation({
    mutationFn: ({ data, status }) =>
      axiosInstance.post(`/api/experiments/${slug}/submission`, { data, status }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['submission', slug]);
      queryClient.invalidateQueries(['student-progress']);
      queryClient.invalidateQueries(['student-certificates']);
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

  const tabs = [
    { id: 'objective', label: 'Objective', icon: <BookOpen size={14} /> },
    { id: 'theory', label: 'Theory', icon: <FileText size={14} /> },
    { id: 'procedure', label: 'Procedure', icon: <HelpCircle size={14} /> },
    { id: 'activity', label: 'Simulation Activity', icon: <Laptop size={14} /> },
    { id: 'quiz', label: 'Practice Quiz', icon: <HelpCircle size={14} /> },
    { id: 'report', label: 'Lab Report', icon: <FileText size={14} /> }
  ];

  const handleSaveActivity = async (data, status = 'in-progress') => {
    await saveSubmission.mutateAsync({ data, status });
  };

  return (
    <DashboardShell>
      <div className="space-y-6 text-left">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          <ArrowLeft size={14} /> Back to Laboratories
        </Link>

        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200 font-serif">
              {experiment.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Estimated duration: {experiment.estimatedDuration} minutes</p>
          </div>
          {submission?.status === 'submitted' && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 size={12} /> Activity Logged
            </Badge>
          )}
        </div>

        {/* Tab Steppers */}
        <div className="flex border-b overflow-x-auto gap-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-650'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'objective' && (
            <Card>
              <CardBody className="p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Laboratory Objective</h3>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.objective}</p>
              </CardBody>
            </Card>
          )}

          {activeTab === 'theory' && (
            <Card>
              <CardBody className="p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250 font-serif">Theoretical Concepts</h3>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.theory}</p>
              </CardBody>
            </Card>
          )}

          {activeTab === 'procedure' && (
            <Card>
              <CardBody className="p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Lab Instructions & Guidelines</h3>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{experiment.procedure}</p>
              </CardBody>
            </Card>
          )}

          {activeTab === 'activity' && ActivityComponent && (
            <ActivityComponent
              submission={submission}
              onSave={handleSaveActivity}
            />
          )}

          {activeTab === 'quiz' && (
            <Card>
              <CardBody className="p-6">
                <QuizEngine experimentSlug={slug} />
              </CardBody>
            </Card>
          )}

          {activeTab === 'report' && (
            <Card>
              <CardBody className="p-6 text-center space-y-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Compile Laboratory Report</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Upon completion of the interactive activity, you can compile and download your results as an official PDF lab sheet.
                </p>

                {submission?.status === 'submitted' ? (
                  <ReportGenerator
                    experimentTitle={experiment.title}
                    studentName={user?.name}
                    studentEmail={user?.email}
                    activityData={submission.data}
                  />
                ) : (
                  <div className="p-4 border border-dashed rounded-xl text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 max-w-sm mx-auto">
                    Please complete and submit the Simulation Activity first.
                  </div>
                )}
              </CardBody>
            </Card>
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
