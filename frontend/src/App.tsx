import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import UnauthorizedPage from './components/common/UnauthorizedPage';

// Pages (to be implemented)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Students = React.lazy(() => import('./pages/Students'));
const Teachers = React.lazy(() => import('./pages/Teachers'));
const Classes = React.lazy(() => import('./pages/Classes'));
const Subjects = React.lazy(() => import('./pages/Subjects'));

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/signup" element={<SignupForm />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />

                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                
                                <Route
                                    path="students"
                                    element={
                                        <ProtectedRoute requiredPermissions={['STUDENT_READ']}>
                                            <Students />
                                        </ProtectedRoute>
                                    }
                                />
                                
                                <Route
                                    path="teachers"
                                    element={
                                        <ProtectedRoute requiredPermissions={['TEACHER_READ']}>
                                            <Teachers />
                                        </ProtectedRoute>
                                    }
                                />
                                
                                <Route
                                    path="classes"
                                    element={
                                        <ProtectedRoute requiredPermissions={['CLASS_READ']}>
                                            <Classes />
                                        </ProtectedRoute>
                                    }
                                />
                                
                                <Route
                                    path="subjects"
                                    element={
                                        <ProtectedRoute requiredPermissions={['SUBJECT_READ']}>
                                            <Subjects />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </React.Suspense>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
