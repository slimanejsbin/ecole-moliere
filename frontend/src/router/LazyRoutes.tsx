import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy loading des composants principaux
export const Dashboard = React.lazy(() => import('../components/dashboard/Dashboard'));
export const StudentList = React.lazy(() => import('../components/students/StudentList'));
export const StudentForm = React.lazy(() => import('../components/students/StudentForm'));
export const TeacherList = React.lazy(() => import('../components/teachers/TeacherList'));
export const TeacherForm = React.lazy(() => import('../components/teachers/TeacherForm'));
export const ClassList = React.lazy(() => import('../components/classes/ClassList'));
export const ClassForm = React.lazy(() => import('../components/classes/ClassForm'));
export const SubjectList = React.lazy(() => import('../components/subjects/SubjectList'));
export const SubjectForm = React.lazy(() => import('../components/subjects/SubjectForm'));

// Composant de chargement
export const LoadingFallback: React.FC = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}
    >
        <CircularProgress />
    </Box>
);

// HOC pour le lazy loading
export const withLazyLoading = (Component: React.LazyExoticComponent<any>) => {
    return (props: any) => (
        <Suspense fallback={<LoadingFallback />}>
            <Component {...props} />
        </Suspense>
    );
};
