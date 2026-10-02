import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../shared/lib/axiosInstance.js';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx';
import { Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentAttendance = () => {
  const [classCode, setClassCode] = useState('');
  const [session, setSession] = useState(null);
  const [record, setRecord] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const joinSessionMutation = useMutation({
    mutationFn: (code) => axiosInstance.post('/api/attendance/join', { classCode: code }),
    onSuccess: (res) => {
      setSession(res.data.data.session);
      setRecord(res.data.data.record);
      toast.success('Joined session successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to join session');
    }
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (sessionId) => axiosInstance.post('/api/attendance/mark', { sessionId }),
    onSuccess: (res) => {
      setRecord(res.data.data.record);
      toast.success('Attendance marked successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    }
  });

  const handleJoin = (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    joinSessionMutation.mutate(classCode);
  };

  useEffect(() => {
    let interval;
    if (session && record?.status === 'pending') {
      const requiredTimeSec = session.durationHours * 3600 * 0.75;
      
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          if (next >= requiredTimeSec) {
            clearInterval(interval);
            markAttendanceMutation.mutate(session._id);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, record?.status, markAttendanceMutation]);

  const getProgress = () => {
    if (!session) return 0;
    const requiredTimeSec = session.durationHours * 3600 * 0.75;
    if (record?.status === 'present') return 100;
    return Math.min(100, (elapsedTime / requiredTimeSec) * 100);
  };

  const progress = getProgress();

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-bold tracking-tight">Attendance</h2>
      
      <Card>
        <CardBody className="p-6">
          {!session ? (
            <form onSubmit={handleJoin} className="max-w-md mx-auto space-y-4">
              <div className="text-center mb-6">
                <Clock className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <h3 className="text-lg font-medium text-slate-900">Mark Your Attendance</h3>
                <p className="text-sm text-slate-500">Enter the class code provided by your instructor.</p>
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Enter Class Code"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="w-full text-center tracking-widest uppercase font-bold text-lg rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={joinSessionMutation.isPending}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
              >
                {joinSessionMutation.isPending ? 'Joining...' : 'Join Session'}
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-6 py-4">
              {record?.status === 'present' ? (
                <div className="space-y-2">
                  <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-900">Attendance Marked!</h3>
                  <p className="text-slate-500 text-sm">You have successfully completed the attendance requirement.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Clock className="mx-auto h-12 w-12 text-indigo-500 animate-pulse" />
                  <h3 className="text-lg font-medium text-slate-900">Tracking Attendance</h3>
                  <p className="text-sm text-slate-500">
                    Stay on this page. Your attendance will be marked automatically once you complete 75% of the class duration.
                  </p>
                  
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
