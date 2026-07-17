import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import StudentDashboard from '../features/dashboard/student/StudentDashboard.jsx';
import TeacherDashboard from '../features/dashboard/teacher/TeacherDashboard.jsx';
import AdminDashboard from '../features/dashboard/admin/AdminDashboard.jsx';
import ExperimentHub from '../features/experiments/ExperimentHub.jsx';
import ExperimentLayout from '../features/experiments/ExperimentLayout.jsx';
import Leaderboard from '../features/leaderboard/Leaderboard.jsx';
import Certificates from '../features/certificates/Certificates.jsx';
import CertificateDetail from '../features/certificates/CertificateDetail.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import DashboardShell from '../shared/components/layout/DashboardShell.jsx';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        {/* Student Only */}
        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/certificates/:serial" element={<CertificateDetail />} />
          </Route>
        </Route>

        {/* Teacher Only */}
        <Route element={<RoleRoute allowedRoles={['teacher']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>
        </Route>

        {/* Admin Only */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Shared Protected Pages (Any Authenticated Role) */}
        <Route element={<RoleRoute allowedRoles={['student', 'teacher', 'admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/experiments" element={<ExperimentHub />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="/experiments/:slug" element={<ExperimentLayout />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
