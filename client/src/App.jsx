import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/queryClient.js';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import { AuthProvider } from './shared/context/AuthContext.jsx';
import { AttendanceProvider } from './shared/context/AttendanceContext.jsx';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/globals.css';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AttendanceProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <AppRoutes />
            </BrowserRouter>
          </AttendanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
