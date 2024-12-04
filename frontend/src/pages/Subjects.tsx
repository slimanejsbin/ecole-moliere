import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SubjectList from '../components/subjects/SubjectList';
import SubjectForm from '../components/subjects/SubjectForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Subjects: React.FC = () => {
    return (
        <Routes>
            <Route
                index
                element={
                    <ProtectedRoute requiredPermissions={['SUBJECT_READ']}>
                        <SubjectList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="new"
                element={
                    <ProtectedRoute requiredPermissions={['SUBJECT_CREATE']}>
                        <SubjectForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <ProtectedRoute requiredPermissions={['SUBJECT_UPDATE']}>
                        <SubjectForm />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default Subjects;
