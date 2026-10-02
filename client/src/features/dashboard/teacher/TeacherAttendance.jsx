import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Clock, Plus, Copy, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherAttendance = () => {
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const { data: sessionsRes, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['teacher-attendance-sessions'],
    queryFn: () => axiosInstance.get('/api/attendance/sessions')
  });

  const { data: attendanceRes, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['teacher-attendance-records', selectedSessionId],
    queryFn: () => axiosInstance.get(`/api/attendance/sessions/${selectedSessionId}`),
    enabled: !!selectedSessionId,
    refetchInterval: 5000 // Poll every 5s for live updates
  });

  const createSessionMutation = useMutation({
    mutationFn: (durationHours) => axiosInstance.post('/api/attendance/sessions', { durationHours }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-attendance-sessions'] });
      toast.success('Attendance session created successfully!');
      setSelectedSessionId(res.data.data.session._id);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create session');
    }
  });

  const handleCreateSession = () => {
    createSessionMutation.mutate(duration);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied to clipboard!');
  };

  const sessions = sessionsRes?.data?.data?.sessions || [];
  const selectedSession = attendanceRes?.data?.data?.session || null;
  const records = attendanceRes?.data?.data?.records || [];

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Attendance Tracker</h2>
          <p className="text-slate-500 text-sm mt-1">
            Create attendance sessions with a time limit and monitor student attendance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Session & History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold">New Session</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                    className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  <button
                    onClick={handleCreateSession}
                    disabled={createSessionMutation.isPending}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 font-medium transition-colors"
                  >
                    {createSessionMutation.isPending ? 'Creating...' : <><Plus size={16} /> Create</>}
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold">Session History</h3>
            </CardHeader>
            <div className="max-h-96 overflow-y-auto">
              {isLoadingSessions ? (
                <div className="p-4 text-center text-slate-500">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No sessions created yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sessions.map(s => (
                    <div 
                      key={s._id} 
                      onClick={() => setSelectedSessionId(s._id)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedSessionId === s._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-lg tracking-widest">{s.classCode}</span>
                        <Badge variant={s.isActive ? 'success' : 'secondary'}>{s.isActive ? 'Active' : 'Expired'}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                        <span>{s.durationHours} hrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Selected Session Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedSessionId ? (
              <>
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Session Details</h3>
                      <p className="text-sm text-slate-500">Code: <span className="font-mono font-bold text-slate-800 text-lg tracking-widest">{selectedSession?.classCode}</span></p>
                    </div>
                    {selectedSession && (
                      <button onClick={() => copyCode(selectedSession.classCode)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
                        <Copy size={16} /> Copy Code
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoadingAttendance ? (
                    <div className="text-center py-12 text-slate-500">Loading attendance data...</div>
                  ) : (
                    <div>
                      <div className="flex gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl flex-1 flex items-center gap-3">
                          <Users className="text-indigo-500" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Total Joined</p>
                            <p className="text-xl font-bold">{records.length}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex-1 flex items-center gap-3">
                          <Clock className="text-emerald-500" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Completed (Present)</p>
                            <p className="text-xl font-bold">{records.filter(r => r.status === 'present').length}</p>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-700 mb-3">Student Records</h4>
                      {records.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                          No students have joined this session yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Join Time</th>
                                <th className="px-4 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                              {records.map(record => (
                                <tr key={record._id}>
                                  <td className="px-4 py-3 font-medium">{record.studentId.name}</td>
                                  <td className="px-4 py-3 text-slate-500">{new Date(record.joinTime).toLocaleTimeString()}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant={record.status === 'present' ? 'success' : 'warning'}>
                                      {record.status === 'present' ? 'Present' : 'Tracking...'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-24">
                <Users size={48} className="mb-4 opacity-20" />
                <p>Select a session from history or create a new one to view details.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
