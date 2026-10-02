import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance.js';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext.jsx';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [record, setRecord] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Restore state from localStorage if it exists
  useEffect(() => {
    if (user?.role === 'student') {
      const storedSession = localStorage.getItem('attendance_session');
      const storedRecord = localStorage.getItem('attendance_record');
      const storedTime = localStorage.getItem('attendance_time');
      const storedLastTick = localStorage.getItem('attendance_last_tick');
      
      if (storedSession && storedRecord) {
        setSession(JSON.parse(storedSession));
        setRecord(JSON.parse(storedRecord));
        
        // Calculate offline elapsed time if we were tracking
        let currentElapsed = storedTime ? parseInt(storedTime, 10) : 0;
        if (storedLastTick && JSON.parse(storedRecord).status === 'pending') {
          const now = Date.now();
          const last = parseInt(storedLastTick, 10);
          const diffSeconds = Math.floor((now - last) / 1000);
          // Only add offline time if it's reasonable (e.g., less than 2 hours to avoid cheating too easily)
          if (diffSeconds > 0 && diffSeconds < 7200) {
            currentElapsed += diffSeconds;
          }
        }
        setElapsedTime(currentElapsed);
      }
    }
  }, [user]);

  const markAttendanceMutation = useMutation({
    mutationFn: (sessionId) => axiosInstance.post('/api/attendance/mark', { sessionId }),
    onSuccess: (res) => {
      setRecord(res.data.data.record);
      localStorage.setItem('attendance_record', JSON.stringify(res.data.data.record));
      toast.success('Attendance marked successfully!', { duration: 5000 });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to mark attendance automatically');
    }
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (session && record?.status === 'pending') {
      const requiredTimeSec = session.durationHours * 3600 * 0.75;
      
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          localStorage.setItem('attendance_time', next.toString());
          localStorage.setItem('attendance_last_tick', Date.now().toString());
          
          if (next >= requiredTimeSec && !markAttendanceMutation.isPending) {
            clearInterval(interval);
            markAttendanceMutation.mutate(session._id);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, record?.status, markAttendanceMutation]);

  const joinSession = async (code) => {
    try {
      const res = await axiosInstance.post('/api/attendance/join', { classCode: code });
      const newSession = res.data.data.session;
      const newRecord = res.data.data.record;
      
      setSession(newSession);
      setRecord(newRecord);
      
      // If joining a new session, reset time if it's a different session ID
      if (session?._id !== newSession._id) {
        setElapsedTime(0);
        localStorage.setItem('attendance_time', '0');
      }
      
      localStorage.setItem('attendance_session', JSON.stringify(newSession));
      localStorage.setItem('attendance_record', JSON.stringify(newRecord));
      localStorage.setItem('attendance_last_tick', Date.now().toString());
      
      toast.success('Joined session successfully!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join session');
      return false;
    }
  };

  const getProgress = () => {
    if (!session) return 0;
    const requiredTimeSec = session.durationHours * 3600 * 0.75;
    if (record?.status === 'present') return 100;
    return Math.min(100, (elapsedTime / requiredTimeSec) * 100);
  };

  const leaveSession = () => {
    setSession(null);
    setRecord(null);
    setElapsedTime(0);
    localStorage.removeItem('attendance_session');
    localStorage.removeItem('attendance_record');
    localStorage.removeItem('attendance_time');
    localStorage.removeItem('attendance_last_tick');
  };

  return (
    <AttendanceContext.Provider value={{ session, record, elapsedTime, progress: getProgress(), joinSession, leaveSession }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
