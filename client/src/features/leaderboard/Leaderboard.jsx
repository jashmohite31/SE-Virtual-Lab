import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../shared/lib/axiosInstance.js';
import { Card, CardBody } from '../../shared/components/ui/Card.jsx';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard = () => {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['leaderboard-analytics'],
    queryFn: () => axiosInstance.get('/api/analytics/dashboard')
  });

  const students = analyticsRes?.data?.data?.stats?.students || [];

  // Sort students by progress (descending) then by name (ascending)
  const rankedStudents = [...students].sort((a, b) => {
    if (b.progress !== a.progress) {
      return b.progress - a.progress;
    }
    return a.name.localeCompare(b.name);
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500 rounded-2xl mb-2">
          <Trophy size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Virtual Lab Leaderboard</h1>
        <p className="text-slate-500 text-sm">
          Compete with your peers by completing experiments and passing quiz checkpoints.
        </p>
      </div>

      {/* Top 3 podium styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
        {/* Second Place */}
        {rankedStudents[1] && (
          <Card className="order-2 md:order-1 border-t-4 border-slate-300">
            <CardBody className="text-center p-6 space-y-3">
              <div className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                <Medal size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{rankedStudents[1].name}</h3>
                <p className="text-xs text-slate-500">{rankedStudents[1].email}</p>
              </div>
              <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {rankedStudents[1].progress}% Progress
              </div>
            </CardBody>
          </Card>
        )}

        {/* First Place */}
        {rankedStudents[0] && (
          <Card className="order-1 md:order-2 border-t-4 border-yellow-500 md:scale-105 shadow-md">
            <CardBody className="text-center p-8 space-y-4">
              <div className="inline-flex p-3.5 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500 rounded-full animate-bounce">
                <Trophy size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{rankedStudents[0].name}</h3>
                <p className="text-xs text-slate-500">{rankedStudents[0].email}</p>
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {rankedStudents[0].progress}% Progress
              </div>
            </CardBody>
          </Card>
        )}

        {/* Third Place */}
        {rankedStudents[2] && (
          <Card className="order-3 border-t-4 border-amber-600">
            <CardBody className="text-center p-6 space-y-3">
              <div className="inline-flex p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{rankedStudents[2].name}</h3>
                <p className="text-xs text-slate-500">{rankedStudents[2].email}</p>
              </div>
              <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {rankedStudents[2].progress}% Progress
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Remaining Students list */}
      <Card className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-semibold text-xs uppercase">
                <th className="px-6 py-4 w-16 text-center">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 text-right">Overall Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {rankedStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 text-center font-bold text-slate-500">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                    {student.progress}%
                  </td>
                </tr>
              ))}
              {rankedStudents.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-slate-500">
                    No records in leaderboard yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
