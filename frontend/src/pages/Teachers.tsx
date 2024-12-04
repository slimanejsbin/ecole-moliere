import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherList from '../components/teachers/TeacherList';
import TeacherForm from '../components/teachers/TeacherForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Teachers: React.FC = () => {
    return (
        <Routes>
            <Route
                index
                element={
                    <ProtectedRoute requiredPermissions={['TEACHER_READ']}>
                        <TeacherList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="new"
                element={
                    <ProtectedRoute requiredPermissions={['TEACHER_CREATE']}>
                        <TeacherForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <ProtectedRoute requiredPermissions={['TEACHER_UPDATE']}>
                        <TeacherForm />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default Teachers;
