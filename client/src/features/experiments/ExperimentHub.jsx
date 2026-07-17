import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '../../shared/lib/axiosInstance.js';
import { Card, CardBody } from '../../shared/components/ui/Card.jsx';
import { Badge } from '../../shared/components/ui/Badge.jsx';
import { Beaker, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export const ExperimentHub = () => {
  const { data: experimentsRes, isLoading: expLoading } = useQuery({
    queryKey: ['experiments'],
    queryFn: () => axiosInstance.get('/api/experiments')
  });

  const { data: progressRes, isLoading: progLoading } = useQuery({
    queryKey: ['student-progress'],
    queryFn: () => axiosInstance.get('/api/progress')
  });

  const experiments = experimentsRes?.data?.data?.experiments || [];
  const progressList = progressRes?.data?.data?.progress || [];

  if (expLoading || progLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const getStatus = (expId) => {
    const prog = progressList.find((p) => p.experiment === expId || p.experiment?._id === expId);
    if (!prog) return { label: 'Not Started', variant: 'info' };
    if (prog.activityCompleted && prog.quizCompleted) {
      return { label: 'Completed', variant: 'success', score: prog.maxQuizScore };
    }
    return { label: 'In Progress', variant: 'warning' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Laboratories</h1>
        <p className="text-slate-500 text-sm mt-1">
          Select an SDLC simulation, requirements modeler, or testing block to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp) => {
          const status = getStatus(exp._id);
          return (
            <Card key={exp._id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardBody className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                      <Clock size={12} /> {exp.estimatedDuration} min
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{exp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{exp.objective}</p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between mt-auto">
                  {status.label === 'Completed' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold">
                      <CheckCircle2 size={14} /> Passed ({status.score}%)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Score &gt;= 60% required</span>
                  )}
                  <Link
                    to={`/experiments/${exp.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                  >
                    Start Lab <ChevronRight size={14} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExperimentHub;
