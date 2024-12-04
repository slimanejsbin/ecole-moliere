import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClassList from '../components/classes/ClassList';
import ClassForm from '../components/classes/ClassForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Classes: React.FC = () => {
    return (
        <Routes>
            <Route
                index
                element={
                    <ProtectedRoute requiredPermissions={['CLASS_READ']}>
                        <ClassList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="new"
                element={
                    <ProtectedRoute requiredPermissions={['CLASS_CREATE']}>
                        <ClassForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <ProtectedRoute requiredPermissions={['CLASS_UPDATE']}>
                        <ClassForm />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default Classes;
