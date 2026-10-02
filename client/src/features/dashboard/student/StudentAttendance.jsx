import React, { useState } from 'react';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Clock, CheckCircle, LogOut } from 'lucide-react';
import { useAttendance } from '../../../shared/context/AttendanceContext.jsx';

export const StudentAttendance = () => {
  const [classCode, setClassCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { session, record, progress, joinSession, leaveSession } = useAttendance();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setIsJoining(true);
    await joinSession(classCode.toUpperCase());
    setIsJoining(false);
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Attendance</h2>
        {session && (
          <button 
            onClick={leaveSession}
            className="text-xs font-semibold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <LogOut size={14} /> Leave Session
          </button>
        )}
      </div>
      
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
                  className="w-full text-center tracking-widest uppercase font-bold text-lg rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
              >
                {isJoining ? 'Joining...' : 'Join Session'}
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-6 py-4">
              {record?.status === 'present' ? (
                <div className="space-y-2">
                  <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Marked!</h3>
                  <p className="text-slate-500 text-sm">You have successfully completed the attendance requirement.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Clock className="mx-auto h-12 w-12 text-indigo-500 animate-pulse" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tracking Attendance</h3>
                  <p className="text-sm text-slate-500">
                    Your attendance is being tracked globally. You can navigate to other tabs and your time will continue to be recorded.
                  </p>
                  
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
