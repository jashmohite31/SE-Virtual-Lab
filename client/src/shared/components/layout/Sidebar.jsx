import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, Beaker, Trophy, Award, Users } from 'lucide-react';

export const Sidebar = ({ onItemClick, isMobile = false }) => {
  const { user } = useAuth();

  const links = [
    {
      to: user?.role === 'student' ? '/student' : user?.role === 'teacher' ? '/teacher' : '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      to: '/experiments',
      label: 'Experiments',
      icon: <Beaker size={18} />
    },
    {
      to: '/leaderboard',
      label: 'Leaderboard',
      icon: <Trophy size={18} />
    }
  ];

  // Only show certificates page for students
  if (user?.role === 'student') {
    links.push({
      to: '/certificates',
      label: 'Certificates',
      icon: <Award size={18} />
    });
  }

  const activeStyle = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold';
  const inactiveStyle = 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60';

  return (
    <aside className={`w-64 bg-white dark:bg-slate-900 h-full ${
      isMobile ? 'border-none' : 'border-r border-slate-200 dark:border-slate-800 hidden md:block'
    }`}>
      <div className="flex flex-col gap-2 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
