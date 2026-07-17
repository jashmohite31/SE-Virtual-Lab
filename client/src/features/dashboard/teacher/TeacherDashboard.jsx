import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Users, Award, Trophy, GraduationCap, ChevronRight, BarChart } from 'lucide-react';

export const TeacherDashboard = () => {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['teacher-analytics'],
    queryFn: () => axiosInstance.get('/api/analytics/dashboard')
  });

  const stats = analyticsRes?.data?.data?.stats || {
    totalStudents: 0,
    totalExperiments: 12,
    avgQuizScore: 0,
    totalCertificates: 0,
    experimentCompletions: [],
    students: []
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor classroom activities, track quiz scores, and review student progress reports.
          </p>
        </div>
      </div>

      {/* Global Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Students</p>
              <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Class Quiz Average</p>
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
              <p className="text-xs text-slate-500 font-semibold">Certificates Issued</p>
              <h3 className="text-2xl font-bold">{stats.totalCertificates}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Hosted Experiments</p>
              <h3 className="text-2xl font-bold">{stats.totalExperiments}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Progress Monitoring Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Student Roster & Progress</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-semibold text-xs uppercase">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Registration</th>
                    <th className="px-6 py-4">Overall Completion</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  {stats.students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${student.progress}%` }}></div>
                          </div>
                          <span className="font-bold text-xs">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={student.progress === 100 ? 'success' : 'info'}>
                          {student.progress === 100 ? 'Graduated' : 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {stats.students.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-slate-500">
                        No students registered in the system yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Experiment Completion Distribution List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Completions by Lab</h2>
          <Card>
            <CardBody className="space-y-6">
              {stats.experimentCompletions.map((item) => (
                <div key={item.slug} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{item.title}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {item.completions} {item.completions === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{
                        width: `${
                          stats.totalStudents > 0 ? (item.completions / stats.totalStudents) * 100 : 0
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
