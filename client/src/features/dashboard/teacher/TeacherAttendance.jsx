import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Clock, Plus, Copy, Users, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const TeacherAttendance = () => {
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(60);
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
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
    mutationFn: (data) => axiosInstance.post('/api/attendance/sessions', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-attendance-sessions'] });
      toast.success('Attendance session created successfully!');
      setSelectedSessionId(res.data.data.session._id);
      setClassName('');
      setSemester('');
      setDuration(60);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create session');
    }
  });

  const handleCreateSession = () => {
    if (!className.trim() || !semester.trim()) {
      return toast.error('Please enter Class Name and Semester');
    }
    createSessionMutation.mutate({ durationMinutes: duration, className, semester });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied to clipboard!');
  };

  const downloadPDF = () => {
    if (!attendanceRes?.data?.data) return;
    const { session, records } = attendanceRes.data.data;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Attendance Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Class: ${session.className}`, 14, 32);
    doc.text(`Semester: ${session.semester}`, 14, 38);
    doc.text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`, 14, 44);
    doc.text(`Duration: ${session.durationMinutes} minutes`, 14, 50);
    doc.text(`Class Code: ${session.classCode}`, 14, 56);

    const tableColumn = ["Roll No", "Name", "Join Time", "Status"];
    const tableRows = [];

    records.forEach(record => {
      const rowData = [
        record.studentId?.studentId || 'N/A', 
        record.studentId?.name || 'Unknown',
        new Date(record.joinTime).toLocaleTimeString(),
        record.status === 'present' ? 'Present (>= 75%)' : 'Incomplete (< 75%)'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw.includes('Present')) {
            data.cell.styles.textColor = [0, 128, 0]; // Green
          } else {
            data.cell.styles.textColor = [255, 0, 0]; // Red
          }
        }
      }
    });

    doc.save(`Attendance_${session.className}_Sem${session.semester}_${new Date(session.createdAt).toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded successfully!');
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
                <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Semester</label>
                <input
                  type="text"
                  placeholder="e.g. 5"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Duration (Minutes)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-900 dark:border-slate-800 dark:text-white"
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
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map(s => (
                    <div 
                      key={s._id} 
                      onClick={() => setSelectedSessionId(s._id)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${selectedSessionId === s._id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-base">{s.className || 'Unknown Class'}</span>
                        <Badge variant={s.isActive ? 'success' : 'secondary'}>{s.isActive ? 'Active' : 'Expired'}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between mb-1">
                        <span>Code: <span className="font-bold tracking-widest text-slate-700 dark:text-slate-300">{s.classCode}</span></span>
                        <span>Sem: {s.semester || 'N/A'}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex justify-between">
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                        <span>{s.durationMinutes} mins</span>
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
                      <h3 className="text-lg font-bold">{selectedSession?.className || 'Session Details'}</h3>
                      <p className="text-sm text-slate-500">Sem: {selectedSession?.semester} • Code: <span className="font-mono font-bold text-slate-800 text-lg tracking-widest">{selectedSession?.classCode}</span></p>
                    </div>
                    <div className="flex gap-2">
                      {selectedSession && (
                        <button onClick={() => copyCode(selectedSession.classCode)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
                          <Copy size={16} /> Copy Code
                        </button>
                      )}
                      <button onClick={downloadPDF} className="bg-slate-800 text-white hover:bg-slate-700 p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
                        <Download size={16} /> Download PDF
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {isLoadingAttendance ? (
                    <div className="text-center py-12 text-slate-500">Loading attendance data...</div>
                  ) : (
                    <div>
                      <div className="flex gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl flex-1 flex items-center gap-3 dark:bg-slate-800/50">
                          <Users className="text-indigo-500" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Total Joined</p>
                            <p className="text-xl font-bold dark:text-slate-200">{records.length}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex-1 flex items-center gap-3 dark:bg-slate-800/50">
                          <Clock className="text-emerald-500" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Completed (Present)</p>
                            <p className="text-xl font-bold dark:text-slate-200">{records.filter(r => r.status === 'present').length}</p>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-700 mb-3 dark:text-slate-300">Student Records</h4>
                      {records.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                          No students have joined this session yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="px-4 py-3">Roll No / Student ID</th>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Join Time</th>
                                <th className="px-4 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                              {records.map(record => (
                                <tr key={record._id}>
                                  <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 tracking-widest">{record.studentId?.studentId || '-'}</td>
                                  <td className="px-4 py-3 font-medium dark:text-slate-200">
                                    {record.studentId?.name}
                                    <span className="block text-xs text-slate-400">{record.studentId?.email}</span>
                                  </td>
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

