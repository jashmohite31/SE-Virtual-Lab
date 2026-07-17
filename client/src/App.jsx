import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/queryClient.js';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import { AuthProvider } from './shared/context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './styles/globals.css';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
