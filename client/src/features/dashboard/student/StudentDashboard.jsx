import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Beaker, Award, Trophy, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export const StudentDashboard = () => {
  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ['student-analytics'],
    queryFn: () => axiosInstance.get('/api/analytics/dashboard')
  });

  const { data: progressRes, isLoading: progressLoading } = useQuery({
    queryKey: ['student-progress'],
    queryFn: () => axiosInstance.get('/api/progress')
  });

  const { data: certRes } = useQuery({
    queryKey: ['student-certificates'],
    queryFn: () => axiosInstance.get('/api/certificates')
  });

  const stats = analyticsRes?.data?.data?.stats || {
    totalExperiments: 12,
    completedActivities: 0,
    completedQuizzes: 0,
    certificatesCount: 0,
    avgQuizScore: 0,
    overallProgressPercentage: 0
  };

  const progressList = progressRes?.data?.data?.progress || [];
  const certificates = certRes?.data?.data?.certificates || [];

  if (analyticsLoading || progressLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold">Hello Student!</h1>
          <p className="text-indigo-100 max-w-xl">
            Welcome to the Software Engineering Virtual Laboratory. You have completed{' '}
            <strong className="text-white">{stats.completedActivities}</strong> out of{' '}
            <strong className="text-white">{stats.totalExperiments}</strong> experiments. Keep it up!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pr-12 hidden md:flex">
          <Beaker size={180} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
              <Beaker size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Labs Completed</p>
              <h3 className="text-2xl font-bold">{stats.completedActivities} / {stats.totalExperiments}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Average Quiz Score</p>
              <h3 className="text-2xl font-bold">{stats.avgQuizScore}%</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-500 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Certificates Earned</p>
              <h3 className="text-2xl font-bold">{stats.certificatesCount}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            {/* Circular Progress Display */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-indigo-500" strokeWidth="4" fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - stats.overallProgressPercentage / 100)} />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-800 dark:text-slate-200">{stats.overallProgressPercentage}%</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Overall Course Progress</p>
              <h3 className="text-sm font-bold text-slate-400">Activity + Quiz Milestones</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lab Progress Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Active Experiments</h2>
            <Link to="/experiments" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressList.slice(0, 4).map((prog) => (
              <Card key={prog._id} className="hover:shadow-md transition-shadow">
                <CardBody className="space-y-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={prog.activityCompleted && prog.quizCompleted ? 'success' : 'warning'}>
                        {prog.activityCompleted && prog.quizCompleted ? 'Completed' : 'In Progress'}
                      </Badge>
                      {prog.quizCompleted && (
                        <span className="text-xs text-slate-500 font-semibold">Quiz: {prog.maxQuizScore}%</span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{prog.experiment?.title}</h3>
                  </div>
                  <Link
                    to={`/experiments/${prog.experiment?.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-650 hover:text-indigo-750 font-semibold hover:underline mt-2 self-start"
                  >
                    Resume Activity <Play size={12} />
                  </Link>
                </CardBody>
              </Card>
            ))}
            {progressList.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-500 border border-dashed rounded-xl">
                You haven't started any experiments yet. Go to the Experiments tab to launch one!
              </div>
            )}
          </div>
        </div>

        {/* Certificates Unlocked Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Certificates</h2>
          <Card>
            <CardHeader className="font-semibold text-sm">Unlocked Credentials</CardHeader>
            <CardBody className="space-y-4">
              {certificates.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  <Award className="mx-auto text-slate-300 mb-2" size={32} />
                  Complete an activity and pass its quiz with 60% or higher to unlock certificates.
                </div>
              ) : (
                certificates.map((cert) => (
                  <div key={cert._id} className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
                        <Award size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {cert.metadataSnapshot?.experimentTitle}
                        </h4>
                        <p className="text-[10px] text-slate-500">{cert.serialNumber}</p>
                      </div>
                    </div>
                    <Link
                      to={`/certificates/${cert.serialNumber}`}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
