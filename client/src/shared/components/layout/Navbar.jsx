import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Sun, Moon, Bell, LogOut, ShieldAlert, Menu } from 'lucide-react';
import axiosInstance from '../../lib/axiosInstance.js';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/api/notifications');
      setNotifications(res.data.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            SE Virtual Lab
          </span>
          {user?.role && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
              user.role === 'admin' 
                ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' 
                : user.role === 'teacher'
                ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300'
                : 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300'
            }`}>
              {user.role}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                if (!showNotif) fetchNotifications();
              }}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50">
                <h4 className="font-semibold text-sm mb-3">Notifications</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                        className={`p-2.5 rounded-lg border transition-colors cursor-pointer text-left ${
                          notif.read
                            ? 'border-transparent bg-slate-50/50 dark:bg-slate-950/20'
                            : 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10'
                        }`}
                      >
                        <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {notif.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
