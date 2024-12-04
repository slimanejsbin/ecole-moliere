import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Students: React.FC = () => {
    return (
        <Routes>
            <Route
                index
                element={
                    <ProtectedRoute requiredPermissions={['STUDENT_READ']}>
                        <StudentList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="new"
                element={
                    <ProtectedRoute requiredPermissions={['STUDENT_CREATE']}>
                        <StudentForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <ProtectedRoute requiredPermissions={['STUDENT_UPDATE']}>
                        <StudentForm />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default Students;
