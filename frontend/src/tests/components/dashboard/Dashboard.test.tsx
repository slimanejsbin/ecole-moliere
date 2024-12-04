import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../theme';
import Dashboard from '../../../components/dashboard/Dashboard';
import { dashboardService } from '../../../services/dashboardService';

// Mock the dashboard service
jest.mock('../../../services/dashboardService');

const mockDashboardData = {
    stats: {
        totalStudents: 500,
        totalTeachers: 50,
        activeClasses: 20,
        totalSubjects: 30
    },
    gradeDistribution: [
        { name: 'A', value: 30 },
        { name: 'B', value: 40 },
        { name: 'C', value: 20 },
        { name: 'D', value: 10 }
    ],
    attendanceStats: [
        { date: '2023-01-01', present: 450, absent: 30, late: 20 }
    ],
    teacherWorkload: [
        { name: 'John Doe', classes: 5, students: 150 }
    ]
};

describe('Dashboard Component', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup mock implementations
        (dashboardService.getStats as jest.Mock).mockResolvedValue(mockDashboardData.stats);
        (dashboardService.getGradeDistribution as jest.Mock).mockResolvedValue(mockDashboardData.gradeDistribution);
        (dashboardService.getAttendanceStats as jest.Mock).mockResolvedValue(mockDashboardData.attendanceStats);
        (dashboardService.getTeacherWorkload as jest.Mock).mockResolvedValue(mockDashboardData.teacherWorkload);
    });

    it('renders dashboard with loading state initially', () => {
        render(
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays statistics cards after loading', async () => {
        render(
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Total Students')).toBeInTheDocument();
            expect(screen.getByText('500')).toBeInTheDocument();
            expect(screen.getByText('Total Teachers')).toBeInTheDocument();
            expect(screen.getByText('50')).toBeInTheDocument();
        });
    });

    it('displays charts after loading', async () => {
        render(
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Student Attendance Trends')).toBeInTheDocument();
            expect(screen.getByText('Grade Distribution')).toBeInTheDocument();
            expect(screen.getByText('Teacher Workload')).toBeInTheDocument();
        });
    });

    it('handles API error gracefully', async () => {
        // Mock API error
        (dashboardService.getStats as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch dashboard data')).toBeInTheDocument();
        });
    });

    it('makes all required API calls on mount', async () => {
        render(
            <ThemeProvider theme={theme}>
                <Dashboard />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(dashboardService.getStats).toHaveBeenCalledTimes(1);
            expect(dashboardService.getGradeDistribution).toHaveBeenCalledTimes(1);
            expect(dashboardService.getAttendanceStats).toHaveBeenCalledTimes(1);
            expect(dashboardService.getTeacherWorkload).toHaveBeenCalledTimes(1);
        });
    });
});
