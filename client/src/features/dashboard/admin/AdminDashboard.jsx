import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Shield, ShieldAlert, Trash2, Award } from 'lucide-react';

export const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => axiosInstance.get('/api/analytics/dashboard')
  });

  const stats = analyticsRes?.data?.data?.stats || {
    totalStudents: 0,
    totalExperiments: 12,
    avgQuizScore: 0,
    totalCertificates: 0,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-slate-500 text-sm mt-1">Global platform overview and student progress logs.</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-750 text-xs font-semibold rounded-lg">{success}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Active Student Profiles</p>
              <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Issued Certificates</p>
              <h3 className="text-2xl font-bold">{stats.totalCertificates}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-500 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Classroom Score Average</p>
              <h3 className="text-2xl font-bold">{stats.avgQuizScore}%</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* User Table */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight">Access Control & Student Logs</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-semibold text-xs uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Overall Progress</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {stats.students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{student.name}</td>
                    <td className="px-6 py-4 text-slate-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="font-bold text-xs">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {stats.students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-500">
                      No user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
