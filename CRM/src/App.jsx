import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core'; // Assuming MantineProvider is used
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth for ProtectedRoute
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage'; // Import AnalyticsPage

// Define ProtectedRoute inline as it was shown in the example structure
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; // Or a minimalist loading spinner
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS> {/* Assuming MantineProvider is used */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
