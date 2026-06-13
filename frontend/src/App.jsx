import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#8B5CF6',
              secondary: '#F8FAFC',
            },
          },
          error: {
            iconTheme: {
              primary: '#EC4899',
              secondary: '#F8FAFC',
            },
          },
        }}
      />
    </>
  );
};

export default App;